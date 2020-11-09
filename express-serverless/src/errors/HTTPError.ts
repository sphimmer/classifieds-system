import { IApiError } from "../interfaces/IApiError";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";

export class HttpError extends Error implements IApiError{
    statusCode: HttpStatusCodes;
    errors: any

    constructor(statusCode: HttpStatusCodes, message: string, errors: any){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
    }
}