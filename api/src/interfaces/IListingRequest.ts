import { IListingImageRequest } from "./IListingImageRequest";
import { ConditionEnum } from "../enums/ConditionEnum";
import { IUserRequest } from "./IUserRequest";
import { IListing } from "./IListing";

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