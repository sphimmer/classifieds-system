import { IListingImageRequest } from "./IListingImageRequest";
import { IListing } from "./IListing";
import { ConditionEnum } from "../models/enums/ConditionEnum";

/**
 * A request for a listing
 */
export interface IListingRequest{

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
     * The images of the listing
     */
    images: IListingImageRequest[];

    /**
     * condition of item
     */
    condition: ConditionEnum;

    /**
     * converts data to an Entity object
     */
    toEntity(userId: string): IListing;
}