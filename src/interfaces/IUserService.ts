import { IUser } from "./IUser";
import { IUserRequest } from "./IUserRequest";

export interface IUserService{

    /**
     * Gets the user by their Id
     * @param {string} id The Id of the user
     */
    getUserById(id: string): Promise<IUser>;

    /**
     * Gets the user by their session
     */
    getMe(): Promise<IUser>;

    /**
     * Creates a new user
     * @param {IUserRequet} data The request for creating the user
     */
    createUser(data: IUserRequest):Promise<IUser>;
}