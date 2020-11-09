import { IListingImageRequest } from "./IListingImageRequest";
import { IListing } from "./IListing";
import { ConditionEnum } from "../models/enums/ConditionEnum";
import { IExistingResourceRequest } from "./IExistingResourceRequest";
import { User } from "../models/entities/User";

/**
 * A request for a listing
 */
export interface IListingRequest{

    /**
     * Listing id
     */
    id?: string;

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

    category: IExistingResourceRequest;

    /**
     * converts data to an Entity object
     */
    toEntity(user: User): IListing;
}