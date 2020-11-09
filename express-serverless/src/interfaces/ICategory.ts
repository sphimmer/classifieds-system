import { Timestamp } from "typeorm";
import { IListing } from "./IListing";

/**
 * A category for ogranizing posts
 */
export interface ICategory{
    /**
     * The unique identifier of the category
     */
    id?: string;

    /**
     * The name of the category
     */
    name: string;

    /**
     * A boolean to determine if the category is archived or not
     */
    dateDeleted?: Timestamp;

    /**
     * The date the category was created
     */
    dateCreated?: Timestamp;

    /**
     * The children categories 
     */
    subcategories?: ICategory[];

    /**
     * The listings belonging to the category
     */
    listings: IListing[];
}