import { IListingService } from "../interfaces/IListingService";
import { IListing } from "../interfaces/IListing";
import { Connection, Repository, Like, Raw } from "typeorm";
import Container from "typedi";
import { Listing } from "../models/entities/Listing";
import { IListingRequest } from "../interfaces/IListingRequest";
import { User } from "../models/entities/User";
import { ListingImage } from "../models/entities/ListingImage";
import { IListingImage } from "../interfaces/IListingImage";
import { IListingImageRequest } from "../interfaces/IListingImageRequest";

export class ListingService implements IListingService{
    private repo: Repository<Listing>;
    private imageRepo: Repository<ListingImage>;

    constructor(){
        const connection: Connection = Container.get('connection');
        this.repo = connection.getRepository(Listing);
        this.imageRepo = connection.getRepository(ListingImage);
    }

    async searchListings(searchWord: string): Promise<IListing[]> {
        


        return await this.repo.createQueryBuilder('listing')
        .select()
        .leftJoinAndSelect('listing.images', 'images')
        .leftJoinAndSelect('listing.category', 'category')
        .leftJoinAndSelect('listing.user', 'user')
        .where("document @@ plainto_tsquery(:search)", {search: `${searchWord}`})
        .orderBy('title', 'DESC')
        .getMany();
        
    }

    async getListingById(id: string): Promise<IListing>{
        return await this.repo.findOne(id, {relations: ['user', 'images']})
    }

    async createListing(data: IListingRequest, userId: string): Promise<IListing> {
        const listing = data.toEntity(userId);
        const newListing =  await this.repo.save(listing);
        await this.updateFullTextSearchDocument(newListing);
        listing.images = await this.saveListingImages(data.images, newListing);

        const fullListing = await this.repo.findOne(newListing.id, {relations: ['images', 'user']})
        fullListing.images = listing.images;
        console.log(fullListing)
        return fullListing
    }

    async saveListingImages(images: IListingImageRequest[], listing: IListing): Promise<IListingImage[]>{
        const savedImages: IListingImage[] = [];
        for (const i of images) {
            const image = new ListingImage()
            image.listing = listing;
            image.path = i.path
            const savedImage = await this.imageRepo.save(image)
            savedImages.push(savedImage);
        }
        
        console.log(images);
        console.log(savedImages);
        return savedImages;
    }

    private async updateFullTextSearchDocument(listing: Listing): Promise<boolean>{

        const result = await this.repo.createQueryBuilder()
        .update()
        .set({document: () => "setweight(to_tsvector(title), 'A') || setweight(to_tsvector(description), 'B')"})
        .execute();
        return result.affected == 1;
    }
    
}