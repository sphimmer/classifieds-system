import { TreeRepository, Connection, MoreThan, Raw } from "typeorm";
import { Container, Service } from "typedi";
import { ICategoryService } from "../interfaces/ICategoryService";
import { ICategory } from "../interfaces/ICategory";
import { ICategoryRequest } from "../interfaces/ICategoryRequest";
import { IExistingResourceRequest } from "../interfaces/IExistingResourceRequest";
import { Category } from "../models/entities/Category";
import { IListing } from "../interfaces/IListing";
import { Listing } from "../models/entities/Listing";

/**
 * @inheritdoc
 */
@Service()
export class CategoryService implements ICategoryService {
    private repo: TreeRepository<Category>;
    private connection: Connection;

    /**
     * @inheritdoc
     */
    public constructor() {
        this.connection = Container.get("connection");
        this.repo = this.connection.manager.getTreeRepository(Category);
    }

    /**
     * @inheritdoc
     */
    public async getAllCategories(): Promise<ICategory[]> {
        const result = await this.repo.findTrees();
        return result;
    }

    public async findCategoryByName(name: string): Promise<ICategory[]> {
        try {
            const category = await this.repo.find({where: {name: name}});
            console.log(category);
            return category;
        } catch (error) {
            console.error(error);
            throw error;
        }

    }
    /**
     * @inheritdoc
     */
    public async getCategoryById(id: string): Promise<ICategory> {
        try {
            const category = await this.repo.findOneOrFail(id, { relations: ['subcategories', 'parentCategory'] });
            console.log(category);
            return category;
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    public async getCategoryListingsById(id: string): Promise<IListing[]> {
        // const category = await this.repo.findOneOrFail(id, {relations: ['listings']});
        try {
            const listings = this.connection.getRepository(Listing).find({
                select: ["id", "title", "thumbnailImage", "price", "location", "dateCreated"] ,
                relations: ['location'],
                where: {category: {id: id}, dateExpires: Raw(alias =>`${alias} >= NOW()`)},
                order: {dateCreated: 'DESC'}
            });
                

            return listings;
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    /**
     * @inheritdoc
     */
    public async createCategory(data: ICategoryRequest) {
        const category = await this.repo.save(data);
        return category;
    }

    /**
     * @inheritdoc
     */
    public async updateCategory(id: string, data: ICategoryRequest): Promise<ICategory> {
        const category = new Category();
        category.id = id;
        category.name = data.name;

        data.subcategories?.map(async (sc: ICategory) => {
            const subcategory = new Category();
            subcategory.id = sc.id;

            subcategory.parentCategory = category
            this.repo.save(subcategory);

            await this.connection.createQueryBuilder()
                .insert()
                .into('category_closure')
                .values(
                    { id_ancestor: category, id_descendant: subcategory },
                )
                .execute();
            return subcategory;
        })

        category.subcategories = data.subcategories;

        const result = await this.repo.save(category);

        return await this.repo.findOne(id, { relations: ["subcategories"] });
    }

    /**
     * @inheritdoc
     */
    public async deleteCategory(id: string): Promise<boolean> {
        const result = await this.repo.softDelete(id);
        return result.affected == 1;
    }
}