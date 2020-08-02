import { IListingResolver } from "../interfaces/IListingResolver";
import { IListing } from "../interfaces/IListing";
import { IListingRequest } from "../interfaces/IListingRequest";
import { Resolver, Query, Mutation, Args, Arg, Authorized, Ctx } from "type-graphql";
import { Listing } from "../models/entities/Listing";
import { ListingService } from "../services/ListingService";
import Container from "typedi";
import { ListingRequest } from "../models/requests/ListingRequest";
import { IContext } from "../interfaces/IContext";
import { IJWT } from "../interfaces/IJWT";
import { decodeJWT } from "../util/jwt";
import { GraphQLUpload } from 'graphql-upload';
import { SignedURL } from "../models/entities/SignedUrl";
import { SignedUrlRequest } from "../models/requests/SignedUrlRequest";

@Resolver(Listing)
export class ListingResolver implements IListingResolver {

    private listingService: ListingService;

    constructor() {
        this.listingService = Container.get(ListingService);
    }

    @Query(() => Listing)
    async listing(@Arg('id') id: string): Promise<IListing> {
        return await this.listingService.getListingById(id);
    }

    @Query(() => [Listing])
    async listings(
        @Arg('search') search: string,
        @Arg('category', { nullable: true }) category: string,
        @Arg('page', { defaultValue: 1 }) page: number
    ): Promise<IListing[]> {
        return await this.listingService.searchListings(search);
    }

    @Authorized()
    @Mutation(() => Listing)
    async createListing(@Arg('data') data: ListingRequest, @Ctx() ctx: IContext): Promise<IListing> {
        const decodedJwt: IJWT = decodeJWT(ctx.token);
        return await this.listingService.createListing(data, decodedJwt.sub);
    }

    @Authorized()
    @Query(() => [SignedURL])
    async signedUrls(@Arg('data') request: SignedUrlRequest, @Ctx() ctx: IContext): Promise<SignedURL[]> {
        const decodedJwt: IJWT = decodeJWT(ctx.token);
        return await this.listingService.getSignedUrls(request.files, decodedJwt.sub)
    }
}