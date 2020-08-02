import { IListingRequest } from "./IListingRequest";
import { IListing } from "./IListing";

/**
 * A service for managing listing operations
 */
export interface IListingService{

    searchListings(searchWord: string): Promise<IListing[]>;

    getListingById(id: string): Promise<IListing>;

    createListing(data: IListingRequest, userId: string): Promise<IListing>;
}