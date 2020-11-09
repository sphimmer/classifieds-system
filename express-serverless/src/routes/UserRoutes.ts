import {Request, Response, Router} from 'express';
import { UserController } from '../controllers/UserController';
import Container from 'typedi';
import { protectedEndpoint } from '../util/cookieMiddleware';

export class UserRoutes{
    public router: Router;
    private userController: UserController;

    constructor(){
        this.userController = Container.get(UserController);
        this.router = Router()
        this.configure();
    }

    private configure(): void {
        
        this.router.get("/", protectedEndpoint, async (req: Request, res: Response) =>{
            try {
                const session = JSON.parse(req.signedCookies.session)
                const me = await this.userController.getMe(session);
                res.send(me);
            } catch (error) {
                res.status(error.statusCode).send(error);
            }
        });

        this.router.put("/", protectedEndpoint, async (req: Request, res: Response) =>{
            try {
                const session = JSON.parse(req.signedCookies.session)
                const me = await this.userController.updateMe(session, req);
                res.send(me);
            } catch (error) {
                res.status(error.statusCode).send(error);
            }
        });

        this.router.get("/listings", protectedEndpoint, async (req: Request, res: Response) =>{
            try {
                const session = JSON.parse(req.signedCookies.session)
                const listings = await this.userController.getMyListings(session);
                res.send(listings);
            } catch (error) {
                res.status(error.statusCode).send(error);
            }
        });
    }
}