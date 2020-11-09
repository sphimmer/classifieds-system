import { CognitoService } from "../services/CognitoService";
import Container, { Service } from "typedi";
import { ISession } from "../interfaces/ISession";
import { BadRequestError } from "../errors/BadRequestError";
import { verifyCognitoJwt } from "../util/jwt";
import { UserService } from "../services/UserService";
import { UserRequest } from "../models/requests/UserRequest";
import { User } from "../models/entities/User";
import { InternalServerError } from "../errors/InternalServerError";

@Service()
export class AuthController {

    private cognitoService: CognitoService;
    private userService: UserService;

    constructor() {
        this.cognitoService = Container.get(CognitoService);
        this.userService = Container.get(UserService);
    }

    public async authorizeUser(authCode: string): Promise<ISession> {
        try {
            const cognitoResponse = await this.cognitoService.getToken(authCode);
            // console.log(cognitoResponse);
            const jwt = await verifyCognitoJwt(cognitoResponse.id_token);
            const userResult: User = await this.userService.findUserByCognitoIdAndEmail(jwt.sub, jwt.email);
            // console.log(userResult);

            if (!userResult) {
                const newUser = new User();
                newUser.email = jwt.email;
                newUser.phoneNumber = jwt.phone_number;
                newUser.name = jwt.name;
                newUser.cognitoId = jwt.sub;
                const savedUser = await this.userService.createUser(newUser);
                const session: ISession = {
                    accessToken: cognitoResponse.access_token,
                    refreshToken: cognitoResponse.refresh_token,
                    expirationDate: new Date(new Date().getTime() + parseInt(process.env.SESSION_DURATION) * 60000),
                    id: savedUser.id
                };
                return session;
            } else {

                const session: ISession = {
                    accessToken: cognitoResponse.access_token,
                    refreshToken: cognitoResponse.refresh_token,
                    expirationDate: new Date(new Date().getTime() + parseInt(process.env.SESSION_DURATION) * 60000),
                    id: userResult.id
                }
                return session;
            }

        } catch (error) {
            console.error(error);
            if(error.statusCode){
                throw error;
            } else {
                throw new InternalServerError();
            }
        }
    }
}
