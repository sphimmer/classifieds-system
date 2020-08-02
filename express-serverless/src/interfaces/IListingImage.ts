import { IListing } from "./IListing";

/**
 * An image of the item for sale in a listing
 */
export interface IListingImage{
    /**
     * Unique identifier of the image
     */
    id: string;

    /**
     * Storage location of the image
     */
    path: string;

    /**
     * The listing the image belongs to
     */
    listing: IListing;
}