import { ICognitoTokenResponse } from "./ICognitoTokenResponse";

export interface ISession{
    accessToken: string,
    refreshToken: string,
    expirationDate: Date,
    id: string,
}