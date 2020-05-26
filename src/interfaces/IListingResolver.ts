import { IListing } from "./IListing";
import { IListingRequest } from "./IListingRequest";

export interface IListingResolver{
    listing(id: string): Promise<IListing>;

    listings(search: string): Promise<IListing[]>

    createListing(data: IListingRequest, userId: string): Promise<IListing>;
}