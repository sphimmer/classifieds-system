import { IApiError } from "../interfaces/IApiError";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";

export class AuthenticationError extends Error implements IApiError{
    statusCode: HttpStatusCodes = HttpStatusCodes.UNAUTHORIZED;
    constructor(message: string){
        super(message)
    }
}