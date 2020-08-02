import { ILocation } from "./ILocation";
import { AccountType } from "enums/AccountType";
import { IListing } from "./IListing";

export interface IUser{
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    location?: ILocation;
    dateCreated?: string;
    accountType?: AccountType;
    listings?: IListing[];
    refreshToken?: string;
}