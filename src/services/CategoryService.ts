import { TreeRepository, Connection, getConnection } from "typeorm";
import { CategoryRequest } from "../models/requests/CategoryRequest";
import { ExistingResourceRequest } from "../models/requests/ExistingResourceRequest";
import { Container } from "typedi";
import { ICategoryService } from "../interfaces/ICategoryService";
import { ICategory } from "../interfaces/ICategory";
import { Category } from "../models/entities/Category";

/**
 * @inheritdoc
 */
export class CategoryService implements ICategoryService{
    private repo: TreeRepository<Category>;
    private connection: Connection;
    
    /**
     * @inheritdoc
     */
    public constructor(){
        this.connection = Container.get("connection");
        this.repo = this.connection.manager.getTreeRepository(Category);
    }

    /**
     * @inheritdoc
     */
    public async getAllCategories(): Promise<Category[]>{
        const result = await this.repo.findTrees();
        return result;
    }

    /**
     * @inheritdoc
     */
    public async getCategoryById(id: string): Promise<Category>{
        const category = await this.repo.findOne(id, {relations: ['subcategories', 'parentCategory', 'listings']})
        return category;
    }

    /**
     * @inheritdoc
     */
    public async createCategory(data: CategoryRequest){
        const category = await this.repo.save(data);
        return category;
    }

    /**
     * @inheritdoc
     */
    public async updateCategory(id: string, data: CategoryRequest): Promise<ICategory>{
        const category = new Category();
        category.id = id;
        category.name = data.name;
        
        data.subcategories?.map(async (sc: ExistingResourceRequest) => {
            const subcategory = new Category();
            subcategory.id = sc.id;

            subcategory.parentCategory = category
            this.repo.save(subcategory);

            await this.connection.createQueryBuilder()
                    .insert()
                    .into('category_closure')
                    .values(
                        {id_ancestor: category, id_descendant: subcategory},
                    )
                    .execute();
            return subcategory;
        })

        category.subcategories = data.subcategories;

        const result = await this.repo.save(category);
       
        return await this.repo.findOne(id, {relations: ["subcategories"]});
    }

    /**
     * @inheritdoc
     */
    public async deleteCategory(id: string): Promise<boolean> {
        const result = await this.repo.softDelete(id);
        return result.affected == 1;
    }
}