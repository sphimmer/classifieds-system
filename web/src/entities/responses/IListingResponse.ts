import { ListingCondition } from "enums/ListingCondition";
import { ICategory } from "entities/ICategory";
import { IUser } from "entities/IUser";

export interface IListingResponse{
    id: string;
    title: string;
    price: number;
    condition: ListingCondition;
    description: string;
    category: ICategory;
    views?: number;
    images: { path: string }[];
    user?: IUser;
}