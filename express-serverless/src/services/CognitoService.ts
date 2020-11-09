import 'reflect-metadata';
import { Service } from 'typedi';
import axios, { AxiosInstance } from "axios";
import { ICognitoTokenResponse } from '../interfaces/ICognitoTokenResponse';
import { HttpStatusCodes } from '../models/enums/HttpStatusCodes';
import { InternalServerError } from '../errors/InternalServerError';
import qs from 'qs';
import { BadRequestError } from '../errors/BadRequestError';

@Service()
export class CognitoService {
    private cognitoClient: AxiosInstance;
    constructor() {
        const authString = Buffer.from(`${process.env.COGNITO_CLIENT_ID}:${process.env.CONGITO_CLIENT_SECRET}`).toString('base64');
        this.cognitoClient = axios.create({ baseURL: process.env.COGNITO_BASE_URL, headers: { 'Content-Type': 'application/x-www-form-urlencoded', "Authorization": `Basic ${authString}` } })
    }

    public async getToken(authCode: string): Promise<ICognitoTokenResponse> {
        try {
            const body = {
                grant_type: "authorization_code",
                code: authCode,
                redirect_uri: process.env.COGNITO_REDIRECT_URI,
            }
            const data = qs.stringify(body)
            // console.log(data)
            return await this.oauthTokenRequest(body)

        } catch (error) {
            throw error;
        }
    }

    public async refreshToken(refreshToken: string): Promise<ICognitoTokenResponse> {
        try {
            const body = {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }
            return await this.oauthTokenRequest(body)
        } catch (error) {
            throw error;
        }

    }

    private async oauthTokenRequest(body: ICognitoRequest): Promise<ICognitoTokenResponse> {
        try {
            const data = qs.stringify(body)
            // console.log(data)

            const response = await this.cognitoClient.post<ICognitoTokenResponse>("/oauth2/token", data);

            return response.data;
        } catch (error) {
            console.error("COGNITO ERROR *******")

            const errorMessage = "There was an error trying to log you in. Please try again later.";
            if (error.isAxiosError) {
                console.error(error.response.data)
                throw new InternalServerError();
            }
            console.error(error);
            throw new InternalServerError();
        }
    }
}

interface ICognitoRequest {
    grant_type: string,
    code?: string,
    redirect_uri?: string,
    refresh_token?: string
}