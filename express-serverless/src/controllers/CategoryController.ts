import { CategoryService } from "../services/CategoryService";
import Container, { Service } from "typedi";
import { ICategory } from "../interfaces/ICategory";
import { ICategoryRequest } from "../interfaces/ICategoryRequest";

@Service()
export class CategoryController{
    private categoryService: CategoryService;
    constructor(){
        this.categoryService = Container.get(CategoryService);
    }
    public async categories(): Promise<ICategory[]> {
        return await this.categoryService.getAllCategories();
    }


    public async category(id : string): Promise<ICategory>{
        return await this.categoryService.getCategoryById(id);
    }


    public async createCategory(data: ICategoryRequest){
        return await this.categoryService.createCategory(data);
    }


    public async updateCategory(id: string, data: ICategoryRequest): Promise<ICategory>{
       return await this.categoryService.updateCategory(id, data);
    }


    public async deleteCategory(id: string) {
        return await this.categoryService.deleteCategory(id);
    }

    public async categoryListings(id: string): Promise<ICategory>{
        return await this.categoryService.getCategoryListingsById(id);
    }
}