import { APIService } from "./APIService";
import { ILocation } from "entities/ILocation";

export class LocationService extends APIService {
    public async getLocations(): Promise<ILocation[]> {
        const body = {
            query: `
            {
                locations{
                  id
                  city
                  state
                  zip
                }
            }`
        }
        const response = await this.apiClient.post('/graphql', body);
        return response.data.data.locations;
    }
}