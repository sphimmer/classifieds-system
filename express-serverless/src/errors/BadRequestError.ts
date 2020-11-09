import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";
import { HttpError } from "./HTTPError";

export class BadRequestError extends HttpError{
   
    constructor(errors: any){
        super(HttpStatusCodes.BAD_REQUEST, "Invalid Request", errors);
    }
}