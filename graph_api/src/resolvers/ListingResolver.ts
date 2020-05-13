import { IListingResolver } from "../interfaces/IListingResolver";
import { IListing } from "../interfaces/IListing";
import { IListingRequest } from "../interfaces/IListingRequest";
import { Resolver, Query, Mutation, Args, Arg } from "type-graphql";
import { Listing } from "../models/entities/Listing";
import { ListingService } from "../services/ListingService";
import Container from "typedi";
import { ListingRequest } from "../models/requests/ListingRequest";

@Resolver(Listing)
export class ListingResolver implements IListingResolver{

    private listingService: ListingService;

    constructor(){
        this.listingService = Container.get(ListingService);
    }

    @Query(() => Listing)
    async listing(@Arg('id') id: string): Promise<IListing> {
        return await this.listingService.getListingById(id);
    }

    @Query(() => [Listing])
    async listings(@Arg('search') search: string): Promise<IListing[]> {
        return await this.listingService.searchListings(search);
    }

    @Mutation(() => Listing)
    async createListing(@Arg('data') data: ListingRequest, @Arg('userId') userId: string): Promise<IListing> {
        return await this.listingService.createListing(data, userId);
    }
}