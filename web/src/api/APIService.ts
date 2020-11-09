import 'reflect-metadata';
import { Service} from 'typedi';
import axios, { AxiosInstance } from "axios";

@Service()
export class APIService {
    protected apiClient: AxiosInstance;
    protected s3ApiClient: AxiosInstance;
    constructor() {
        this.apiClient = axios.create({ baseURL: "http://localhost:5000", headers: { "Content-Type": "application/json" } , withCredentials: true});
        this.s3ApiClient = axios.create();
    }

    async getPublicJwtKey(): Promise<string>{
        const response = await this.s3ApiClient.get("https://virginiagunexchange.s3.amazonaws.com/jwtRS256.key.pub")
        return response.data;
    }

}