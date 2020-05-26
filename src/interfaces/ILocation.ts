import { Timestamp } from "typeorm";

/**
 * A Physical location
 */
export interface ILocation {
    /**
     * Unique identifier for the location
     */
    id: string;

    /**
     * The city of the location
     */
    city: string;

    /**
     * The zip code of the location
     */
    zip: string;

    /**
     * The state of the location
     */
    state: string;

    /**
     * Date location was created
     */
    dateCreated: Timestamp;

    /**
     * Date location was deleted
     */
    dateDeleted: Timestamp;
}