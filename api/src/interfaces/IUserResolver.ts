import { IUser } from "./IUser";
import { IUserRequest } from "./IUserRequest";
import { ILoginRequest } from "./ILoginRequest";
import { ILoginResult } from "./ILoginResult";
import { IContext } from "./IContext";

/**
 * The graphql resolver for users
 */
export interface IUserResolver{

    /**
     * gets the user that is logged in
     */
    me(ctx): Promise<IUser>;
    
    /**
     * updates the account with the new fields
     * @param {IUserRequest} accountData the user profile data to update the account with
     */
    updateMe(data: IUserRequest, ctx: IContext)

    // changePassword(ctx, )

    /**
     * Gets a user by their provied ID
     * @param {string} id The UUID of the user
     */
    user(id: string): Promise<IUser>;

    /**
     * Creates a new user
     * @param {IUserRequest} data The user profile data for creating a new user
     */
    createUser(data: IUserRequest): Promise<ILoginResult>;

    /**
     * logs a user into the system
     * @param {ILoginRequest} data The user's email and password
     */
    login(data: ILoginRequest): Promise<ILoginResult>;
}