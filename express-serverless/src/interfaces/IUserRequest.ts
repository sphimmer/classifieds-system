import { Timestamp } from "typeorm";
import { ILocation } from "./ILocation";
import { IUser } from "./IUser";
import { ILocationRequest } from "./ILocationRequest";
import { ExistingResourceRequest } from "../models/requests/ExistingResourceRequest";

/**
 * A request for input of the User Type
 */
export interface IUserRequest{

    /**
     * User's name
     */
    name: string;

    /**
     * User's email
     */
    email: string;

    /**
     * User's Location
     */
    location: ExistingResourceRequest;

    /**
     * User's phone number
     */
    phoneNumber: string;

    /**
     * Transforms the request to the entity object
     */
    toEntity(): IUser;
}