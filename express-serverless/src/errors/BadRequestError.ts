import { IApiError } from "../interfaces/IApiError";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";

export class BadRequestError extends Error implements IApiError{
    statusCode: HttpStatusCodes = HttpStatusCodes.BAD_REQUEST;
    constructor(message: string){
        super(message);
    }
}