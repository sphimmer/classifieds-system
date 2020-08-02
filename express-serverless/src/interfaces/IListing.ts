import { Timestamp } from "typeorm";
import { IUser } from "./IUser";
import { IListingImage } from "./IListingImage";
import { ICategory } from "./ICategory";
import { ConditionEnum } from "../models/enums/ConditionEnum";

/**
 * A Post for listing a classified ad
 */
export interface IListing{
    /**
     * Unique Identifier
     */
    id: string;

    /**
     * Listing Title
     */
    title: string;

    /**
     * A description for the listing
     */
    description: string;

    /**
     * Listing price
     */
    price: number;

    /**
     * The thumbnail image for the listing
     */
    thumbnailImage: string;

    /**
     * The images of the listing
     */
    images: IListingImage[];

    /**
     * condition of item
     */
    condition: ConditionEnum;

    /**
     * The number of views the listing has had
     */
    views: number;

    /**
     * The User that posted the listing
     */
    user: IUser;

    /**
     * The category that the listing belongs to
     */
    category: ICategory;

    /**
     * The date the listing was posted
     */
    dateCreated: Timestamp;

    /**
     * The date that the listing will expire and no longer be publicly viewable unless renewed
     */
    dateExpires: Timestamp;

    /**
     * The date the listing was updated
     */
    dateUpdated: Timestamp;

   /**
     * The date the listing was deleted
     */
    dateDeleted: Timestamp;

    /**
     * A Tsvector to optimize full text search
     */
    document: string;
}