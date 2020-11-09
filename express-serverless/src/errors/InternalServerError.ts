import { IApiError } from "../interfaces/IApiError";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";
import { HttpError } from "./HTTPError";

export class InternalServerError extends HttpError{
    
    constructor(){
        super(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", "There was an error. Excuse us while we fix this.")
    }
    
}