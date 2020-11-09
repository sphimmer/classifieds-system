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

    /**
     * Update the user with the new data
     * @param data the data that will update the user
     * @param userId the id of the user from the jwt
     */
    updateMe(data: IUserRequest, userId: string): Promise<IUser>;
    
    /**
     * Set the refresh token to the user according to session duration
     * @param userId the user's id
     * @param refreshToken the refresh token value
     */
    setRefreshToken(userId: string, refreshToken: string): Promise<boolean>;
}