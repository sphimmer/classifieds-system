import { Router, Request, Response } from "express";
import { CategoryController } from "../controllers/CategoryController";
import Container from "typedi";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";


export class CategoryRoutes{
    public router: Router;
    private categoryController: CategoryController;

    constructor(){
        this.categoryController = Container.get(CategoryController);
        this.router = Router()
        this.configure();
    }
    
    private configure(): void {
        this.router.get('/', async (_req: Request, res: Response)=>{
            try{
                const categories = await this.categoryController.categories()
                res.status(HttpStatusCodes.OK).send(categories);
            } catch (error){
                res.status(error.statusCode).send(error.message);
            }
        });

        this.router.get('/:id', async (req: any, res: Response)=>{
            try{
                const categories = await this.categoryController.category(req.params.id);
                res.status(HttpStatusCodes.OK).send(categories)
            } catch (error){
                res.status(error.statusCode).send(error.message);
            }
        });

        this.router.get('/:id/listings', async (req: Request, res: Response) =>{
            try {
                const categoryListings = await this.categoryController.categoryListings(req.params.id)
                res.status(HttpStatusCodes.OK).send(categoryListings);
            } catch (error) {
                res.status(error.statusCode).send(error.message);
            }
        })
    }
}
