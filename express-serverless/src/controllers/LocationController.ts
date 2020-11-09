import { LocationService } from "../services/LocationService";
import Container, { Service } from "typedi";
import { ILocation } from "../interfaces/ILocation";
import { LocationRequest } from "../models/requests/LocationRequest";
import { NotFoundError } from "../errors/NotFoundError";
import { InternalServerError } from "../errors/InternalServerError";
import { BadRequestError } from "../errors/BadRequestError";
import { Request } from "express";

@Service()
export class LocationController {
    private locationService: LocationService;
    public constructor() {
        this.locationService = Container.get(LocationService);
    }

    async getLocationById(id: string): Promise<ILocation> {
        try {
            return await this.locationService.getLocationById(id);
        } catch (error) {
            throw new NotFoundError("Location not found");
        }
        
    }

    async locations(req: Request): Promise<ILocation[]> {
        try {
            let result: ILocation[];
            if('city' in req.query || 'zip' in req.query || 'state' in req.query){
                const locationRequest = new LocationRequest({city: req.query.city as string, zip: req.query.zip as string, state: req.query.state as string, id: null, dateDeleted: null, dateCreated: null});
                result = await this.locationService.findLocation(locationRequest)
            } else {
                result = await this.locationService.getAllLocations();
            }
            return result;
        } catch (error) {
            console.error(error);
            throw new InternalServerError();
        }
    }

    async createLocation(data: ILocation): Promise<ILocation> {
        const locRequest = new LocationRequest(data);
        try {
            const errors = await locRequest.validate();
            if (errors.length > 0) {
                throw new BadRequestError(errors.join(', '));
            }
            return await this.locationService.createLocation(locRequest);
        } catch (error) {
            if(error.statusCode){
                throw error;
            } else {
                console.error(error);
                throw new InternalServerError();
            }
        }
    }

    async updateLocation(id: string, data: LocationRequest): Promise<ILocation> {
        const errors = await data.validate();
        if (errors) {
            throw new BadRequestError(errors.join(', '));
        }
        return await this.locationService.updateLocation(id, data);
    }
}