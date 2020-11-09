import { IListingService } from "../interfaces/IListingService";
import { IListing } from "../interfaces/IListing";
import { Connection, Repository, Like, Raw } from "typeorm";
import Container, { Service } from "typedi";
import { Listing } from "../models/entities/Listing";
import { IListingRequest } from "../interfaces/IListingRequest";
import { ListingImage } from "../models/entities/ListingImage";
import { IListingImage } from "../interfaces/IListingImage";
import { IListingImageRequest } from "../interfaces/IListingImageRequest";
import { SignedURL } from "../models/entities/SignedUrl";
import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';
import { IFile } from "../interfaces/IFile";
import { NotFoundError } from "../errors/NotFoundError";
import { ListingSearchRequest } from "../models/requests/ListingSearchRequest";
import { User } from "../models/entities/User";
import { IUser } from "../interfaces/IUser";
import { InternalServerError } from "../errors/InternalServerError";

@Service()
export class ListingService implements IListingService {
    private repo: Repository<Listing>;
    private imageRepo: Repository<ListingImage>;
    private s3Client: S3;
    private connection: Connection;

    constructor() {
        this.connection = Container.get('connection');
        this.repo = this.connection.getRepository(Listing);
        this.imageRepo = this.connection.getRepository(ListingImage);
        this.s3Client = Container.get('S3');
    }

    async listingsByUserId(userId: string): Promise<IListing[]> {
        try {
            const listings = await this.repo.find({ where: { user: { id: userId } }, order: {dateCreated: 'DESC'} });
            return listings;
        } catch (error) {
            console.error(error);
            throw new InternalServerError();
        }
    }

    async getListingUser(listingId: string): Promise<IUser> {
        try {
            const listing = await this.repo.findOneOrFail(listingId, { relations: ['user'] });
            return listing.user;
        } catch (error) {
            if (error.name == 'EntityNotFound') {
                throw new NotFoundError("Listing not found");
            } else {
                throw error;
            }
        }
    }

    async getListings(searchRequest: ListingSearchRequest): Promise<IListing[]> {
        return await this.repo.find({ order: { dateCreated: 'DESC' }, relations: ['category', 'location'], take: searchRequest.pageLength })
    }

    async searchListings(searchRequest: ListingSearchRequest): Promise<IListing[]> {
        const query = this.repo.createQueryBuilder('listing')
            .select()
            // .leftJoinAndSelect('listing.images', 'images')
            .leftJoinAndSelect('listing.category', 'category')
            .leftJoinAndSelect('listing.location', 'location')
            .where("document @@ plainto_tsquery(:search)", { search: `${searchRequest.search}` })
        if (searchRequest.category) {
            query.andWhere("category = :categoryId", { categoryId: searchRequest.category });
        }
        return await query.skip(searchRequest.pageLength * (searchRequest.page - 1))
            // .orderBy('title', 'DESC')
            .limit(searchRequest.pageLength)
            .getMany();
    }

    async getListingById(id: string): Promise<IListing> {
        try {
            return await this.repo.findOneOrFail(id, { relations: ['images', 'category'] })
        } catch (error) {
            console.error(error);
            throw new NotFoundError("Listing not found.");
        }
    }

    async saveListing(data: IListingRequest, userId: string): Promise<IListing> {
        const user = await this.connection.manager.findOne(User, userId);
        const listing = data.toEntity(user);
        const newListing = await this.repo.save(listing);
        let fullListing = await this.repo.findOne(newListing.id, { relations: ['category', 'images'] });
        await this.updateFullTextSearchDocument(fullListing);
        await this.deleteListingImages(listing);
        listing.images = await this.saveListingImages(data.images, newListing);

        fullListing = await this.repo.findOne(newListing.id, { relations: ['images', 'user', 'category'] });
        return fullListing;
    }

    async deleteListingImages(listing: IListing): Promise<void>{
        const images = await this.imageRepo.find({where: {listing: {id: listing.id}}});
        images.filter((image: ListingImage) => {
            if(image.path !in listing.images.map(i => i.path)){
                // delete image
                this.imageRepo.delete(image.id);
            }
        })
    }

    async saveListingImages(images: IListingImageRequest[], listing: IListing): Promise<IListingImage[]> {
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

    async updateListing(listing: IListing) {
        await this.repo.update(listing.id, listing)
    }

    private async updateFullTextSearchDocument(listing: Listing): Promise<boolean> {
        try {
            const result = await this.repo.query(`
                UPDATE "listing" 
                SET "document" = setweight(to_tsvector(title), 'A') || setweight(to_tsvector(category.name), 'B') || setweight(to_tsvector(description), 'C')
                , "dateUpdated" = CURRENT_TIMESTAMP 
                FROM category 
                WHERE listing.id = $1
                AND category.id = $2
            `, [listing.id, listing.category.id]);
            console.log(result)
            return result.affected == 1;
        } catch (error) {
            console.error(error)
            throw error;
        }

    }

    public async deleteListing(listingId: string): Promise<boolean> {
        try {
            const deleteResult = await this.repo.softDelete(listingId)
            return deleteResult.affected == 1;
        } catch (error) {
            console.error(error);
            throw new InternalServerError();
        }
    }

    public async getSignedUrls(files: IFile[], userId: string): Promise<SignedURL[]> {
        const signedUrls: SignedURL[] = files.map(file => {

            const image_name_pad = uuidv4();
            const params = { Bucket: process.env.S3_BUCKET, Key: `${userId}/${image_name_pad}-${file.fileName}`, Expires: 120, ContentType: file.contentType };
            const signedUrl = new SignedURL();
            signedUrl.URL = this.s3Client.getSignedUrl('putObject', params);
            signedUrl.fileName = file.fileName;
            return signedUrl;
        });
        return signedUrls
    }
}