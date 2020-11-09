import { IListingRequest } from "./IListingRequest";
import { IListing } from "./IListing";
import { ListingSearchRequest } from "../models/requests/ListingSearchRequest";

/**
 * A service for managing listing operations
 */
export interface IListingService{

    searchListings(searchRequest: ListingSearchRequest): Promise<IListing[]>;

    getListingById(id: string): Promise<IListing>;

    saveListing(data: IListingRequest, userId: string): Promise<IListing>;
}