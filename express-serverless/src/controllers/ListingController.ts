import { ListingService } from "../services/ListingService";
import Container, { Service } from "typedi";
import { IListing } from "../interfaces/IListing";
import { Response, Request } from "express";
import { NotFoundError } from "../errors/NotFoundError";
import { ListingSearchRequest } from "../models/requests/ListingSearchRequest";
import { BadRequestError } from "../errors/BadRequestError";
import { ListingRequest } from "../models/requests/ListingRequest";
import { IListingRequest } from "../interfaces/IListingRequest";
import { ISession } from "../interfaces/ISession";
import { SignedUrlRequest } from "../models/requests/SignedUrlRequest";
import { HttpStatusCodes } from "../models/enums/HttpStatusCodes";
import { InternalServerError } from "../errors/InternalServerError";
import { IContactInfo } from "../interfaces/IContactInfo";
import { ForbiddenError } from "../errors/ForbiddenError";

@Service()
export class ListingController {

    private listingService: ListingService

    constructor() {
        this.listingService = Container.get(ListingService);
    }

    async listing(req: Request, res: Response) {
        try {
            const listing = await this.listingService.getListingById(req.params.id);
            res.send(listing)
        } catch (error) {
            console.error(error);
            res.status(error.statusCode).send(error);
        }
    }

    async listingUser(listingId: string): Promise<IContactInfo>{
        try{
            const user = await this.listingService.getListingUser(listingId);
            return {email: user.email, phoneNumber: user.phoneNumber};
        } catch(error){
            if(error.statusCode){
                throw error;
            } else {
                console.error(error)
                throw new InternalServerError()
            }
        }
    }
    
    async updateListing(req: Request, res: Response){
        try {
            const session = JSON.parse(req.signedCookies.session) as ISession;
            const body = req.body as IListingRequest;
            const listing = new ListingRequest({id: req.params.id, ...body});
            const errors = await listing.validate()
            if (errors.length > 0) {
                throw new BadRequestError(errors)
            }

            res.send(await this.listingService.saveListing(listing, session.id));
        } catch (error) {
            if(error.statusCode){
                res.status(error.statusCode).send(error);
            } else {
                console.error(error)
                res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
        }
    }

    async listings(req: Request, res: Response) {
        try {
            // console.log(req.query)
            const searchRequest = new ListingSearchRequest(req.query.search as string, req.query.page as string, req.query.category as string);
            // console.log(searchRequest)
            const errors = await searchRequest.validate();
            if (errors.length > 0) {
                throw new BadRequestError(errors)
            }
            let listings: IListing[];
            if (!searchRequest.search) {
                listings = await this.listingService.getListings(searchRequest);
            } else {
                listings = await this.listingService.searchListings(searchRequest);
            }
            res.send(listings)
        } catch (error) {
            console.error(error);
            res.status(error.statusCode).send(error);
        }
    }

    async createListing(req: Request, res: Response): Promise<IListing> {
        try {
            const session = JSON.parse(req.signedCookies.session) as ISession;
            const body = req.body as IListingRequest;
            const listing = new ListingRequest(body);

            const errors = await listing.validate()
            if (errors.length > 0) {
                throw new BadRequestError(errors)
            }
            
            return await this.listingService.saveListing(listing, session.id);
        } catch (error) {
            if(error.statusCode){
                res.status(error.statusCode).send(error);
            } else {
                console.error(error)
                res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
        }
    }

    async deleteListing(listingId: string, userId: string): Promise<boolean>{
        try {
            // check this user can delete this listing
            const user = await this.listingService.getListingUser(listingId);
            if(!user){
                throw new NotFoundError("Listing Not Found")
            }
            if(user.id != userId){
                throw new ForbiddenError(["Not allowed to delete another user's listing. listing id: " + listingId]);
            }
            const isDeleted = await this.listingService.deleteListing(listingId);
            return isDeleted;
        } catch (error) {
            if(error.statusCode){
                throw error
            } else {
                console.error(error);
                throw new InternalServerError();
            }
        }
        
    }

    async signedUrls(req: Request, res: Response) {
        try {
            const session = JSON.parse(req.signedCookies.session) as ISession;
            const request = new SignedUrlRequest(req.body)
            const errors = await request.validate()
            if (errors.length > 0) {
                throw new BadRequestError(errors.join(", "))
            }
            res.send(await this.listingService.getSignedUrls(request.files, session.id));
        } catch (error) {
            console.error(error)
            if(error.statusCode){
                res.status(error.statusCode).send(error);
            } else {
                res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(JSON.stringify(error));
            }
        }
    }
}