import { IUser } from "./IUser";
import { IUserRequest } from "./IUserRequest";

/**
 * The graphql resolver for users
 */
export interface IUserResolver{

    /**
     * gets the user that is logged in
     */
    me(): Promise<IUser>;

    /**
     * Gets a user by their provied ID
     * @param {string} id The UUID of the user
     */
    user(id: string): Promise<IUser>;

    /**
     * Creates a new user
     * @param {IUserRequest} data The user profile data for creating a new user
     */
    createUser(data: IUserRequest): Promise<IUser>;
}