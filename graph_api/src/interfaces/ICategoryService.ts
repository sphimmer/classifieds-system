import { ICategory } from "./ICategory";
import { ICategoryRequest } from "./ICategoryRequest";

/**
 * Service for category data operations
 */
export interface ICategoryService{
    /**
     * Gets a list of all categories available
     * @returns a list of ICategory
     */
    getAllCategories(): Promise<ICategory[]>;

    /**
     * Fetches a single category
     * @param {string} id A UUID string of the category
     */
    getCategoryById(id: string): Promise<ICategory>; 

    /**
     * Creates a new category
     * @param {ICategoryRequest} data Request body containing the necessary data to create a category
     */
    createCategory(data: ICategoryRequest): Promise<ICategory>;

    /**
     * Updates a given category. Causes replacement
     * @param {string} id A UUID string of the category
     * @param {ICategoryRequest} data Request body containing the necessary data to update the category
     */
    updateCategory(id: string, data: ICategoryRequest): Promise<ICategory>;

    /**
     * Delets a given category. Soft delete
     * @param {string} id An UUID string of the category
     */
    deleteCategory(id: string): Promise<boolean>;
}