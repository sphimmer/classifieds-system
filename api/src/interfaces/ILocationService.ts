import { ILocation } from "./ILocation";
import { ILocationRequest } from "./ILocationRequest";

/**
 * Service for location operations
 */
export interface ILocationService{

    /**
     * Gets a list of all locations
     */
    getAllLocations(): Promise<ILocation[]>;

    /**
     * Get the location its Id
     * @param {string} id locations id
     */
    getLocationById(id: string): Promise<ILocation>;
    
    /**
     * Creates a new location
     * @param data A location request object to supply needed values
     */
    createLocation(data: ILocationRequest): Promise<ILocation>;

    /**
     * Updates the location
     * @param id Id of the location
     * @param data Location request object 
     */
    updateLocation(id: string, data: ILocationRequest): Promise<ILocation>;

    /**
     * Finds a location by given values
     * @param locationData location request object to supply needed values
     */
    findLocation(locationData: ILocationRequest):Promise<ILocation[]>;
}