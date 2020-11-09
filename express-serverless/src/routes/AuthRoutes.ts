import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import Container from "typedi";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";
import { BadRequestError } from "../errors/BadRequestError";
import { ISession } from "../interfaces/ISession";
import { json } from "body-parser";

export class AuthRoutes {
    public router: Router;
    public authController: AuthController;

    constructor() {
        this.router = Router();
        this.authController = Container.get(AuthController);
        this.configure();
    }

    public configure(): void {
        this.router.get('/', async (req: any, res: Response) => {
            try {
                const authCode = req.query.code
                if(!authCode){
                    throw new BadRequestError('Auth code not provided');
                }
                const session: ISession = await this.authController.authorizeUser(authCode);
                const state = JSON.parse(new Buffer(req.query.state, 'base64').toString('ascii'));
                state.isLoggedIn = true;
                const stateEncoded = new Buffer(JSON.stringify(state)).toString('base64');

                res.cookie('session',
                     JSON.stringify(session), 
                     { expires: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)), httpOnly: true, signed: true, sameSite: true})
                .redirect(HttpStatusCodes.TEMPORARY_REDIRECT,"http://localhost:3000/?state=" + stateEncoded);

            } catch (error) {
                console.error(error);
                res.redirect(HttpStatusCodes.TEMPORARY_REDIRECT,"http://localhost:3000/?error=" + error.message);
            }
        });

        this.router.get('/login', async (req: Request, res: Response)=>{
            try{
                const params = `?client_id=${process.env.COGNITO_CLIENT_ID}&state=${req.query.state}&redirect_uri=${process.env.COGNITO_REDIRECT_URI}&response_type=code&scope=email+openid+phone+profile`;                   
                res.send({loginPage: process.env.COGNITO_BASE_URL + "/login/" + params});
            } catch (error){
                res.status(error.statusCode).send(error)
            }
        });

        this.router.get('/logout', async(req: Request, res: Response)=>{
            try {
                const params = `?client_id=${process.env.COGNITO_CLIENT_ID}&logout_uri=http://localhost:3000/`;

                res.cookie("session", null).status(HttpStatusCodes.NO_CONTENT).send();
            } catch (error) {
                res.status(error.statusCode).send(error)
            }
        });
    }
}