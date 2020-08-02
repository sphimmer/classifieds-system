import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";

export interface IApiError{
    statusCode: HttpStatusCodes
}