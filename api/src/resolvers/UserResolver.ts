import { IUserResolver } from "../interfaces/IUserResolver";
import { Repository, Connection } from "typeorm";
import { User } from "../models/entities/User";
import Container from "typedi";
import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { IUser } from "../interfaces/IUser";
import { UserService } from "../services/UserService";
import { UserRequest } from "../models/requests/UserRequest";
import { Login } from "../models/entities/Login";
import { LoginRequest } from "../models/requests/LoginRequest";
import { ILoginResult } from "../interfaces/ILoginResult";
import { StatusEnum } from "../models/enums/StatusEnum";
import { comparePasswords } from "../util/password";
import { createJWT, decodeJWT } from "../util/jwt";
import { AuthenticationError, UserInputError } from "apollo-server-koa";
import { isContext } from "vm";
import { IJWT } from "../interfaces/IJWT";
import { UserRole } from "../models/enums/UserRoleEnum";
import { IUserRequest } from "../interfaces/IUserRequest";
import { IContext } from "../interfaces/IContext";
import { LocationService } from "../services/LocationService";

/**
 * @inheritdoc
 */
@Resolver(User)
export class UserResolver implements IUserResolver{

    private userService: UserService;
    private locationService: LocationService;
    
    constructor(){
        this.userService = Container.get(UserService);
        this.locationService = Container.get(LocationService);
    }

    @Mutation(() => User)
    @Authorized()
    async updateMe(@Arg('data') data: UserRequest, @Ctx() ctx: IContext) {
        const token = ctx.token;
        const userJWT: IJWT = decodeJWT(token);
        if (data.location) {
            const locationResult = await this.locationService.findLocation(data.location)    
            if (locationResult.length > 0) {
                data.location = locationResult[0];
            } else {
                data.location.id = undefined;
                const newLocation = await this.locationService.createLocation(data.location);
                data.location = newLocation;
            }
        }
        
        
        return await this.userService.updateMe(data, userJWT.sub)

    }

    /**
     * @inheritdoc
     */
    @Query(() => User)
    @Authorized()
    async me(@Ctx() ctx: IContext): Promise<IUser> {
        const token = ctx.token;
        const userJWT: IJWT = decodeJWT(token);
        return this.userService.getUserById(userJWT.sub);
    }

    /**
     * @inheritdoc
     */
    @Query(() => User)
    @Authorized(UserRole.ADMIN)
    async user(@Arg('id') id: string): Promise<IUser> {
        return await this.userService.getUserById(id);
    }

    /**
     * @inheritdoc
     */
    @Mutation(() => Login)
    async createUser(@Arg('data') data: UserRequest): Promise<ILoginResult> {
        const validationErrors = data.validate();
        if (validationErrors.length > 0) {
            throw new UserInputError("Invalid Input", validationErrors);
        }
        const user = await this.userService.createUser(data);
        const jwt = createJWT(user);
        return {user: user, jwt: jwt, status: StatusEnum.SUCCESS, message: "Account created sucessfully."};
    }

    /**
     * @inheritdoc
     */
    @Mutation(() => Login)
    async login(@Arg('data') data: LoginRequest ): Promise<ILoginResult>{
        const user = await this.userService.login(data);
        
        if (await comparePasswords(data.password, user.password)) {
            const jwt = createJWT(user);
            return { status: StatusEnum.SUCCESS, message: "Successful login", jwt: jwt, user: user}
        } else {
            throw new AuthenticationError("Invalid credentials. Please try again.")
        }
    };
    
    
}