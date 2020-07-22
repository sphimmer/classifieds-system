import { Status } from "enums/Status";
import { ICategory } from "entities/ICategory";
import { IUser } from "entities/IUser";

export interface IAccountState {
    status: Status,
    error: string,
    categories: ICategory[];
    user: IUser;
}