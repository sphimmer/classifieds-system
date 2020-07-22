import { IUser } from "./IUser";
import { IUserRequest } from "./IUserRequest";
import { ILoginRequest } from "./ILoginRequest";
import { ILoginResult } from "./ILoginResult";

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

    /**
     * Logs a user in
     * @param data The loginRequest containing an email and password
     */
    login(data: ILoginRequest): Promise<IUser>;

    /**
     * Update the user with the new data
     * @param data the data that will update the user
     * @param userId the id of the user from the jwt
     */
    updateMe(data: IUserRequest, userId: string): Promise<IUser>;
}