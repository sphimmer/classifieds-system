import { HttpError } from "./HTTPError";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";

export class UnauthorizedError extends HttpError{
    constructor(){
        super(HttpStatusCodes.UNAUTHORIZED, "Unauthorized Error", "There was an issue with authorizng your account");
    }
}