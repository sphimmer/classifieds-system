import { IUser } from "./IUser";
import { IUserRequest } from "./IUserRequest";
import { User } from "../models/entities/User";


export interface IUserService{

    /**
     * Gets the user by their Id
     * @param {string} id The Id of the user
     */
    getUserById(id: string): Promise<IUser>;

    /**
     * Gets the user by their session
     */
    getMe(congitoId: string): Promise<IUser>;

    /**
     * Creates a new user
     * @param {IUserRequet} data The request for creating the user
     */
    createUser(user: User):Promise<IUser>;

    /**
     * Update the user with the new data
     * @param data the data that will update the user
     * @param userId the id of the user from the jwt
     */
    updateMe(data: IUser, userId: string): Promise<IUser>;
    
}