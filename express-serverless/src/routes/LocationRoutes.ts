import { Router, Request, Response } from "express";
import { LocationController } from "../controllers/LocationController";
import Container from "typedi";
import { protectedEndpoint } from "../util/cookieMiddleware";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";

export class LocationRoutes {
    public router: Router;
    private locationController: LocationController

    constructor() {
        this.locationController = Container.get(LocationController);
        this.router = Router();
        this.configure();
    }

    private configure(): void {
        this.router.get("/", async (req: Request, res: Response) => {
            try {
                const locations = await this.locationController.locations(req);
                res.send(locations)
            } catch (error) {
                if(error.statusCode){
                    res.status(error.statusCode).send(error);
                } else {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(error);
                }
                
            }
        })

        this.router.get("/:id", async (req: Request, res: Response) => {
            try {
                const location = await this.locationController.getLocationById(req.params.id);
                res.send(location)
            } catch (error) {
                if(error.statusCode){
                    res.status(error.statusCode).send(error);
                } else {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(error);
                }
                
            }
        })

        this.router.post("/", protectedEndpoint, async (req: Request, res: Response) => {
            try {
                
                const location = await this.locationController.createLocation(req.body);
                res.send(location);
            } catch (error) {
                if(error.statusCode){
                    res.status(error.statusCode).send(error);
                } else {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(error);
                }
                
            }
        });

        this.router.put("/:id", protectedEndpoint, async (req: Request, res: Response) => {
            try {
                const location = await this.locationController.updateLocation(req.params.id, req.body);
                res.send(location);
            } catch (error) {
                if(error.statusCode){
                    res.status(error.statusCode).send(error);
                } else {
                    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(error);
                }
                
            }
        })
    }
}