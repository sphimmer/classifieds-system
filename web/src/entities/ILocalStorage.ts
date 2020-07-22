import { IUser } from "./IUser";

export interface ILocalStorage {
    jwt: string
    user: IUser;
}