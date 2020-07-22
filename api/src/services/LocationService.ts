import { ILocationService } from "../interfaces/ILocationService";
import { ILocation } from "../interfaces/ILocation";
import { ILocationRequest } from "../interfaces/ILocationRequest";
import Container from "typedi";
import { Repository, Connection } from "typeorm";
import { Location } from "../models/entities/Location";
/**
 * @inheritdoc
 */
export class LocationService implements ILocationService {
    private repo: Repository<Location>;

    constructor() {
        const connection: Connection = Container.get('connection');
        this.repo = connection.getRepository(Location);
    }

    /**
     * @inheritdoc
     */
    async findLocation(locationData: ILocationRequest): Promise<ILocation[]> {
        return await this.repo.find({ city: locationData.city, state: locationData.state, zip: locationData.zip });
    }

    /**
     * @inheritdoc
     */
    async getAllLocations(): Promise<ILocation[]> {
        return await this.repo.find({ dateDeleted: null });
    }

    /**
     * @inheritdoc
     */
    async getLocationById(id: string): Promise<ILocation> {
        return await this.repo.findOne(id)
    }

    /**
     * @inheritdoc
     */
    async createLocation(data: ILocationRequest): Promise<ILocation> {
        const newLocation = await this.repo.save(data);
        return newLocation;
    }

    /**
     * @inheritdoc
     */
    async updateLocation(id: string, data: ILocationRequest): Promise<ILocation> {
        const location = new Location()
        location.id = id;
        location.city = data.city;
        location.state = data.state;
        location.zip = data.zip;

        return await this.repo.save(location);
    }
}