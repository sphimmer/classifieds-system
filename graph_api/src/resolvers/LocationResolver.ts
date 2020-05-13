import { ILocationResolver } from "../interfaces/ILocationResolver";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Location } from "../models/entities/Location";
import { ILocation } from "../interfaces/ILocation";

import { ILocationService } from "../interfaces/ILocationService";
import Container from "typedi";
import { LocationService } from "../services/LocationService";
import { LocationRequest } from "../models/requests/LocationRequest";

@Resolver(Location)
export class LocationResolver implements ILocationResolver{

    private locationService: ILocationService;
    
    public constructor(){
        this.locationService = Container.get(LocationService);
    }

    @Query(() => Location)
    async location(@Arg("id") id: string): Promise<ILocation> {
        return await this.locationService.getLocationById(id);
    }

    @Query(() => [Location])
    async locations(): Promise<ILocation[]> {
        return await this.locationService.getAllLocations();
    }

    @Mutation(() => Location)
    async createLocation(@Arg("data") data: LocationRequest): Promise<ILocation> {
        return await this.locationService.createLocation(data);
    }

    @Mutation(() => Location)
    async updateLocation(@Arg("id") id: string, @Arg("data") data: LocationRequest): Promise<ILocation> {
        return await this.locationService.updateLocation(id, data);
    }
    
}