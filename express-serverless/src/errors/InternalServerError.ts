import { IApiError } from "../interfaces/IApiError";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";

export class InternalServerError extends Error implements IApiError{
    statusCode: HttpStatusCodes = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    constructor(message: string){
        super(message)
    }
    
}