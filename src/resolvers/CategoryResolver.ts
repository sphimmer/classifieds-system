import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Category } from "../models/entities/Category";
import { CategoryRequest } from "../models/requests/CategoryRequest";
import { CategoryService } from "../services/CategoryService";
import Container from "typedi";
import { ICategory } from "../interfaces/ICategory";
import { ICategoryResolver } from "../interfaces/ICategoryResolver";

@Resolver(Category)
export class CategoryResolver implements ICategoryResolver{
    private categoryService: CategoryService;
    
    public constructor(){
        this.categoryService = Container.get(CategoryService);
    }

    @Query(() => [Category])
    public async categories(): Promise<ICategory[]> {
        return await this.categoryService.getAllCategories();
    }

    @Query(() => Category)
    public async category(@Arg("id") id : string){
        return await this.categoryService.getCategoryById(id);
    }

    @Mutation(() => Category)
    public async createCategory(@Arg("data") data: CategoryRequest){
        return await this.categoryService.createCategory(data);
    }

    @Mutation(() => Category)
    public async updateCategory(@Arg("id") id: string, @Arg("data") data: CategoryRequest): Promise<ICategory>{
       return await this.categoryService.updateCategory(id, data);
    }

    @Mutation(() => Boolean)
    public async deleteCategory(@Arg("id") id: string) {
        return await this.categoryService.deleteCategory(id);
    }
}