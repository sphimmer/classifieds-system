import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";
import { HttpError } from "./HTTPError";

export class NotFoundError extends HttpError{
    constructor(errors: any){
        super(HttpStatusCodes.NOT_FOUND, "Resource not Found", errors)
    }
}