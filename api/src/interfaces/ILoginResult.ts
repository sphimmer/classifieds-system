import { StatusEnum } from "../models/enums/StatusEnum";
import { IUser } from "./IUser";

export interface ILoginResult{
    status: StatusEnum;
    message: string;
    jwt: string;
    user: IUser;
}