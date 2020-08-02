import { ILoginRequest } from "../interfaces/ILoginRequest";
import { Container, Service } from "typedi";
import { UserService } from "../services/UserService";
import { IUser } from "../interfaces/IUser";
import { comparePasswords } from "../util/password";
import { StatusEnum } from "../models/enums/StatusEnum";
import { AuthenticationError } from "../errors/AuthenticationError";
import { createJWT, createRefreshToken } from "../util/jwt";

@Service()
export class UserController{

    private userService: UserService;
    // private locationService: LocationService;

    constructor() {
        this.userService = Container.get(UserService);
        // this.locationService = Container.get(LocationService);
    }

    
    public async login(data: ILoginRequest, ){
        const loginUser: IUser = await this.userService.login(data);

        if (await comparePasswords(data.password, loginUser.password)) {
            
            const {jwt, user} = await this.setTokens(loginUser)
            return { status: StatusEnum.SUCCESS, message: "Successful login", jwt: jwt, user: user }
        } else {
            throw new AuthenticationError("Invalid credentials. Please try again.")
        }
    }

    private async setTokens(user: IUser): Promise<{jwt: string, user: IUser}>{
        const jwt = createJWT(user);
        user.refreshToken = createRefreshToken();
        await this.userService.setRefreshToken(user.id, user.refreshToken);
        return {jwt: jwt, user: user };
    }
}