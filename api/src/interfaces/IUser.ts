import { Timestamp } from "typeorm";
import { ILocation } from "./ILocation";
import { IListing } from "./IListing";

/**
 * A user of the system
 */
export interface IUser{
    /**
     * Unique Identifier of the user
     */
    id: string;

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
     * A user's Listings
     */
    listings: IListing[]

    /**
     * Date user joined
     */
    dateCreated: Timestamp;

    /**
     * Date user deleted account
     */
    dateDeleted: Timestamp;

    /**
     * user's password
     */
    password: string;
}