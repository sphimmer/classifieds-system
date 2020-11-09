import 'reflect-metadata';
import { Service} from 'typedi';
import { IUser } from "entities/IUser";
import { APIService } from "./APIService";
import { UpdateUserRequest } from "entities/requests/UpdateUserRequest";
import { AxiosResponse } from 'axios';
require('dotenv').config()

@Service()
export class AccountService extends APIService {

    public async login(state: string): Promise<AxiosResponse> {    
        const response = await this.apiClient.get(`/auth/login?state=${state}`);
        return response;
    }

    public async getFullProfile() {
        try {
            const response = await this.apiClient.get('/me');
            return response.data as IUser;
        } catch (error) {
            throw error;
        }
    }

    public async updateMe(user: IUser): Promise<IUser> {
        const updateUserRequest = new UpdateUserRequest(user);
        const response = await this.apiClient.put('/me', updateUserRequest);
        console.log(response);
        return response.data as IUser;
    }

    public async logout(){
        const response = await this.apiClient.get("/auth/logout")
        // console.log(response);
    }
}