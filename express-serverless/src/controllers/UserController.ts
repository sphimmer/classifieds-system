import { Container, Service } from "typedi";
import { UserService } from "../services/UserService";
import { ISession } from "../interfaces/ISession";
import { NotFoundError } from "../errors/NotFoundError";
import { IListing } from "../interfaces/IListing";
import { IUser } from "../interfaces/IUser";
import { UserRequest } from "../models/requests/UserRequest";
import { Request } from "express";
import { InternalServerError } from "../errors/InternalServerError";
import { BadRequestError } from "../errors/BadRequestError";
import { ListingService } from "../services/ListingService";

@Service()
export class UserController{

    private userService: UserService;
    private listingService: ListingService;

    constructor() {
        this.userService = Container.get(UserService);
        this.listingService = Container.get(ListingService);
    }

    public async getMe(session: ISession): Promise<IUser>{
        try {
            return await this.userService.getUserById(session.id);
        } catch (error) {
            console.error(error);
            throw new NotFoundError("There was an issue retrieving your data");
        }
    }

    public async getMyListings(session: ISession): Promise<IListing[]>{
        try {
            const listings = await this.listingService.listingsByUserId(session.id);
            return listings;
        } catch (error) {
            console.error(error);
            throw new NotFoundError("There was an issue retrieving your data");
        }
    }

    public async updateMe(session: ISession, req: Request): Promise<IUser>{
        try{
            console.log(req.body)
            const userRequest = new UserRequest(req.body);
            const errors = await userRequest.validate();
            console.error(errors)
            if(errors.length > 0){
                throw new BadRequestError(errors.join(', '));
            }
            const user = userRequest.toEntity();
            console.log(user)

            const updatedMe = await this.userService.updateMe(user, session.id);

            return updatedMe;
        } catch(error){
            if(error.statusCode){
                throw error
            } else {
                throw new InternalServerError();
            }
        }
    }
}