import { CategoryService } from "../services/CategoryService";
import Container, { Service } from "typedi";
import { ICategory } from "../interfaces/ICategory";
import { ICategoryRequest } from "../interfaces/ICategoryRequest";
import { IListing } from "../interfaces/IListing";
import { NotFoundError } from "../errors/NotFoundError";
import { ExistingResourceRequest } from "../models/requests/ExistingResourceRequest";
import { validateRequest } from "../util/requestValidator";
import { InternalServerError } from "../errors/InternalServerError";

@Service()
export class CategoryController {
    private categoryService: CategoryService;
    constructor() {
        this.categoryService = Container.get(CategoryService);
    }
    public async categories(): Promise<ICategory[]> {
        return await this.categoryService.getAllCategories();
    }


    public async category(id: string): Promise<ICategory> {
        try {
            const categoryIdRequest = new ExistingResourceRequest(id);
            await validateRequest(categoryIdRequest)
            return await this.categoryService.getCategoryById(categoryIdRequest.id);    
        } catch (error) {
            if(error.statusCode){
                throw error;
            }
            throw new NotFoundError('Category not found');
        }
    }

    public async categoryByName(name: string): Promise<ICategory[]> {
        try {
            return await this.categoryService.findCategoryByName(name);    
        } catch (error) {
            if(error.statusCode){
                throw error;
            }
            throw new NotFoundError('Category not found');
        }
        
    }

    public async getSubcategories(id: string): Promise<ICategory[]>{
        const category = await this.categoryService.getCategoryById(id);
        return category.subcategories;
    }


    public async createCategory(data: ICategoryRequest) {
        return await this.categoryService.createCategory(data);
    }


    public async updateCategory(id: string, data: ICategoryRequest): Promise<ICategory> {
        return await this.categoryService.updateCategory(id, data);
    }


    public async deleteCategory(id: string) {
        return await this.categoryService.deleteCategory(id);
    }

    public async categoryListings(id: string): Promise<IListing[]> {
        try {
            return await this.categoryService.getCategoryListingsById(id);    
        } catch (error) {
            console.error(error);
            throw new InternalServerError()
        }
        
    }
}