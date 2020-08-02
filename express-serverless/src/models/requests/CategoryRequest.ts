import { Category } from "../entities/Category";
import { ICategoryRequest } from "../../interfaces/ICategoryRequest";

export class CategoryRequest implements ICategoryRequest{

    id: string;
    
    name: string;

    subcategories: Category[];
}