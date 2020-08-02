
import { StatusEnum } from "../enums/StatusEnum";
import { ILoginResult } from "../../interfaces/ILoginResult";
import { User } from "./User";

export class Login implements ILoginResult {
    status: StatusEnum;
    message: string;
    jwt: string;
    user: User;
}