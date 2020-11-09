import { Response, Request, NextFunction } from "express"
import { ISession } from "../interfaces/ISession";
import { verifyCognitoJwt } from "./jwt";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";
import Container from "typedi";
import { CognitoService } from "../services/CognitoService";

export async function protectedEndpoint(req: Request, res: Response, next: NextFunction) {

    try {
        if (req.signedCookies.session) {
            const cookie = JSON.parse(req.signedCookies.session) as ISession;
            const verifiedJwt = await verifyCognitoJwt(cookie.accessToken);
            if (!verifiedJwt) {
                const cognitoService = Container.get(CognitoService);
                const cognitoTokenResponse = await cognitoService.refreshToken(cookie.refreshToken);
                cookie.accessToken = cognitoTokenResponse.access_token;
                console.log(cookie.accessToken)
                res.cookie('session',
                    JSON.stringify(cookie),
                    { expires: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)), httpOnly: true, signed: true, sameSite: true })
            }
            next();
        } else {
            throw new UnauthorizedError();
        }
    } catch (error) {
        console.error(error);
        if (error.statusCode) {

            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Something Bad happened");
        }

    }
}