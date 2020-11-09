import { Router, Response, Request } from "express";
import Container from "typedi";
import { ListingController } from "../controllers/ListingController";
import { protectedEndpoint } from "../util/cookieMiddleware";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";
import { ISession } from "../interfaces/ISession";

export class ListingRoutes {
    private listingController: ListingController;
    public router: Router;

    constructor() {
        this.listingController = Container.get(ListingController);
        this.router = Router();
        this.configure();
    }

    private configure(): void {
        this.router.get("/:id", async (req: Request, res: Response) => {
            this.listingController.listing(req, res);
        });

        this.router.get("/:id/contact", protectedEndpoint, async (req: Request, res: Response) => {
            try {
                const contactInfo = await this.listingController.listingUser(req.params.id);
                res.send(contactInfo);
            } catch (error) {
                res.status(error.statusCode).send(error.message);
            }
        });
        
        this.router.delete("/:id", protectedEndpoint, async (req: Request, res: Response) => {
            try {
                const session = JSON.parse(req.signedCookies.session) as ISession;
                const result = await this.listingController.deleteListing(req.params.id, session.id);
                if(result){
                    res.status(HttpStatusCodes.NO_CONTENT).send();
                } else {
                    res.status(HttpStatusCodes.UNPROCESSABLE_ENTITY).send("Deletion result: " + result);
                }
                
            } catch (error) {
                if(error.statusCode){
                    res.status(error.statusCode).send(error.message);
                } else {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("There was an error deleting your listing.")
                }
            }
        });

        this.router.get("/", async (req: Request, res: Response) => {
            this.listingController.listings(req, res);
        });

        this.router.post("/", protectedEndpoint, async (req: Request, res: Response) => {
            res.status(HttpStatusCodes.CREATED).send(await this.listingController.createListing(req, res));
        });
        this.router.post("/signedUrls", protectedEndpoint, async (req: Request, res: Response) => { 
            this.listingController.signedUrls(req,res);
        });

        this.router.put("/:id", async (req: Request, res: Response) => {
            this.listingController.updateListing(req, res);
        });
    }
}