import { IListing } from "./IListing";
import { IListingRequest } from "./IListingRequest";
import { IContext } from "./IContext";

export interface IListingResolver{
    listing(id: string): Promise<IListing>;

    listings(search: string, category: string, page: number): Promise<IListing[]>

    createListing(data: IListingRequest, ctx: IContext): Promise<IListing>;
}