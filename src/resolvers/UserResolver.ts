import { IUserResolver } from "../interfaces/IUserResolver";
import { Repository, Connection } from "typeorm";
import { User } from "../models/entities/User";
import Container from "typedi";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { IUser } from "../interfaces/IUser";
import { IUserRequest } from "../interfaces/IUserRequest";
import { UserService } from "../services/UserService";
import { UserRequest } from "../models/requests/UserRequest";

/**
 * @inheritdoc
 */
@Resolver(User)
export class UserResolver implements IUserResolver{

    private userService: UserService;
    
    constructor(){
        this.userService = Container.get(UserService);
    }

    /**
     * @inheritdoc
     */
    me(): Promise<IUser> {
        throw new Error("Method not implemented.");
    }

    /**
     * @inheritdoc
     */
    @Query(() => User)
    async user(@Arg('id') id: string): Promise<IUser> {
        return await this.userService.getUserById(id);
    }

    /**
     * @inheritdoc
     */
    @Mutation(() => User)
    async createUser(@Arg('data') data: UserRequest): Promise<IUser> {
        return await this.userService.createUser(data);
    }
    
}