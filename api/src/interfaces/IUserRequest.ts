import { Timestamp } from "typeorm";
import { ILocation } from "./ILocation";
import { IUser } from "./IUser";

/**
 * A request for input of the User Type
 */
export interface IUserRequest{

    /**
     * User's first name
     */
    firstName: string;

    /**
     * User's last name
     */
    lastName: string;

    /**
     * User's email
     */
    email: string;

    /**
     * User's Location
     */
    location: ILocation;

    /**
     * User's phone number
     */
    phoneNumber: string;

    /**
     * Transforms the request to the entity object
     */
    toEntity(): IUser;
}