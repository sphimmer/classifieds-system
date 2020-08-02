import { IUserResolver } from "../interfaces/IUserResolver";
import { Repository, Connection, Timestamp } from "typeorm";
import { User } from "../models/entities/User";
import Container from "typedi";
import { Resolver, Query, Mutation, Arg, Authorized, Ctx, UnauthorizedError } from "type-graphql";
import { IUser } from "../interfaces/IUser";
import { UserService } from "../services/UserService";
import { UserRequest } from "../models/requests/UserRequest";
import { Login } from "../models/entities/Login";
import { LoginRequest } from "../models/requests/LoginRequest";
import { ILoginResult } from "../interfaces/ILoginResult";
import { StatusEnum } from "../models/enums/StatusEnum";
import { comparePasswords } from "../util/password";
import { createJWT, decodeJWT, createRefreshToken } from "../util/jwt";
import { AuthenticationError, UserInputError } from "apollo-server-koa";
import { isContext } from "vm";
import { IJWT } from "../interfaces/IJWT";
import { UserRole } from "../models/enums/UserRoleEnum";
import { IUserRequest } from "../interfaces/IUserRequest";
import { IContext } from "../interfaces/IContext";
import { LocationService } from "../services/LocationService";
import { IRefreshRequest } from "../interfaces/IRefreshRequest";
import { RefreshRequest } from "../models/requests/RefreshRequest";

/**
 * @inheritdoc
 */
@Resolver(User)
export class UserResolver implements IUserResolver {

    private userService: UserService;
    private locationService: LocationService;

    constructor() {
        this.userService = Container.get(UserService);
        this.locationService = Container.get(LocationService);
    }

    @Mutation(() => Login)
    async refreshSession(@Arg('data') data: RefreshRequest, @Ctx() ctx: IContext): Promise<ILoginResult> {
        const userJWT: IJWT = decodeJWT(ctx.token);
        const staleUser = await this.userService.getUserById(userJWT.sub);
        const expirationDate = new Date(staleUser.refreshTokenExpiration.toString());
        
        if (await comparePasswords(data.refreshToken, staleUser.refreshToken) && expirationDate >= new Date()){

            const {jwt, user} = await this.setTokens(staleUser);
            return { status: StatusEnum.SUCCESS, message: "Session Extended", jwt: jwt, user: user }
        } else {
            throw new AuthenticationError("session expired")
        }

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
        return { user: user, jwt: jwt, status: StatusEnum.SUCCESS, message: "Account created sucessfully." };
    }

    /**
     * @inheritdoc
     */
    @Mutation(() => Login)
    async login(@Arg('data') data: LoginRequest, @Ctx() ctx: IContext): Promise<ILoginResult> {
        const loginUser: IUser = await this.userService.login(data);

        if (await comparePasswords(data.password, loginUser.password)) {
            
            const {jwt, user} = await this.setTokens(loginUser)
            return { status: StatusEnum.SUCCESS, message: "Successful login", jwt: jwt, user: user }
        } else {
            throw new AuthenticationError("Invalid credentials. Please try again.")
        }
    };

    private async setTokens(user: IUser): Promise<{jwt: string, user: IUser}>{
        const jwt = createJWT(user);
        user.refreshToken = createRefreshToken();
        await this.userService.setRefreshToken(user.id, user.refreshToken);
        return {jwt: jwt, user: user };
    }
}