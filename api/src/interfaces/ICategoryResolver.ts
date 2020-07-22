import { ICategory } from "./ICategory";
import { ICategoryRequest } from "./ICategoryRequest";

export interface ICategoryResolver{
    
    /**
     * Retrieves all available categories
     */
    categories(): Promise<ICategory[]>;
    
    /**
     * Gets a single ICategory by its Id
     */
    category(id: string): Promise<ICategory>;

    /**
     * Creates a new category
     */
    createCategory(data: ICategoryRequest): Promise<ICategory>;
    
    /**
     * Updates (Destructive) the category by its given id
     */
    updateCategory(id: string, data: ICategoryRequest): Promise<ICategory>;

    /**
     * Deletes a category
     * @param {string} id id of the category
     */
    deleteCategory(id: string);

}