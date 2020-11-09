import 'reflect-metadata';
import { Service} from 'typedi';
import { APIService } from "./APIService";
import { ILocation } from "entities/ILocation";

@Service()
export class LocationService extends APIService {
    public async getLocations(location?: ILocation): Promise<ILocation[]> {
        
        const response = await this.apiClient.get('/locations', {params: {...location}});
        return response.data;
    }

    public async postLocation(location: ILocation): Promise<ILocation>{
        const response = await this.apiClient.post("/locations", location)
        return response.data;
    }

}