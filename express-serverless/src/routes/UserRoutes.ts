import {Request, Response, Router} from 'express';
import { UserController } from '../controllers/UserController';
import Container from 'typedi';
import { ILoginRequest } from '../interfaces/ILoginRequest';
import { HttpStatusCodes } from '../models/enums/HttpStatusCodes';

export class UserRoutes{
    public router: Router;
    private userController: UserController;

    constructor(){
        this.userController = Container.get(UserController);
        this.router = Router()
        this.configure();
    }

    private configure(): void {
        this.router.post('/login', async (req: Request, res: Response)=>{
            try{
                
                const loginRequest = req.body as ILoginRequest;
                const loginResult = await this.userController.login(loginRequest);
                res.status(HttpStatusCodes.OK).send()
            } catch (error){
                res.status(error.statusCode).send(error.message)
            }
        })

        this.router.get('/auth', async (req: Request, res: Response)=>{
            try {
                // console.log(req)
                const {headers, body} = req;
                res.status(HttpStatusCodes.OK).send({headers: headers, body: body});
            } catch (error) {
                console.error(error)
            }
        })
    }
}