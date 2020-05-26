import { ICategory } from "./ICategory";

/**
 * Category Request object
 */
export interface ICategoryRequest{
    /**
     * Name of the Category
     */
    name: string;

    /**
     * The subcategories that are children of this category
     */
    subcategories: ICategory[];
}