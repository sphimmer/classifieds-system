import { HttpError } from "./HTTPError";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";

export class ForbiddenError extends HttpError{
    constructor(errors: string[]){
        super(HttpStatusCodes.FORBIDDEN, "You are not allowed to make this action.", errors);
    }
}