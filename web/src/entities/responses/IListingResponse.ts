import { ListingCondition } from "enums/ListingCondition";
import { ICategory } from "entities/ICategory";
import { IUser } from "entities/IUser";
import { ILocation } from "entities/ILocation";
import { IListingImage } from "./IListingImage";

export interface IListingResponse{
    id: string;
    title: string;
    price: number;
    condition: ListingCondition;
    description: string;
    category: ICategory;
    views?: number;
    images: IListingImage[];
    thumbnailImage: string;
    user?: IUser;
    location: ILocation;
    dateCreated: string;
    dateExpires: string;
}