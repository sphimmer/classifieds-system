import { IListing } from "entities/IListing";
import { IImageUploadResponse } from "entities/responses/IImageUploadResponse";
import { ListingCondition } from "enums/ListingCondition";
import { IListingResponse } from "entities/responses/IListingResponse";

export class ListingUpdateRequest {
    id: string;
    title: string;
    price: number;
    condition: ListingCondition;
    description: string;
    category: {id: string};
    images: { path: string }[];

    constructor(listing: IListingResponse) {
        this.id = listing.id
        this.title = listing.title;
        this.price = listing.price;
        this.condition = listing.condition;
        this.description = listing.description
        this.category = {id: listing.category.id}
        this.images = listing.images
    }
}