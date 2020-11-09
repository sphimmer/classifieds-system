import { ListingCondition } from "enums/ListingCondition";
import { ICategory } from "./ICategory";
import { IUser } from "./IUser";
import { ILocation } from "./ILocation";

export interface IListing{
    title: string;
    price: number;
    condition: ListingCondition;
    description: string;
    category: ICategory;
    views?: number;
    images: [];
    user?: IUser;
    location: ILocation;
}