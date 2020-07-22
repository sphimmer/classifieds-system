import axios, { AxiosInstance } from "axios";

export class APIService {
    protected apiClient: AxiosInstance;
    protected s3ApiClient: AxiosInstance;
    constructor() {
        this.apiClient = axios.create({ baseURL: "http://localhost:5000", headers: { "Content-Type": "application/json" } });
        this.s3ApiClient = axios.create();
    }


}