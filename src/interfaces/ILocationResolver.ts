import { ILocation } from "./ILocation";
import { ILocationRequest } from "./ILocationRequest";

export interface ILocationResolver{
    
    /**
     * Gets the location by its ID
     * @param {string} id ID of the location
     */
    location(id: string): Promise<ILocation>;
    
    /**
     * Gets all the locations
     */
    locations(): Promise<ILocation[]>;

    /**
     * Creates a new location entity
     * @param data The location data
     */
    createLocation(data: ILocationRequest): Promise<ILocation>;

    /**
     * Updates a location by its given ID
     * @param id The ID of the location to be updated
     * @param data The new location data
     */
    updateLocation(id: string, data: ILocationRequest): Promise<ILocation>;

}