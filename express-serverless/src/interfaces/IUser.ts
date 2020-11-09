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
     * User's name
     */
    name: string

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
     * user's refresh token for renewing a session
     */
    refreshToken: string;

    /**
     * the timestamp that the user's refresh token will expire forcing a login
     */
    refreshTokenExpiration: Timestamp;
}