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
import { SignedURL } from "../models/entities/SignedUrl";
import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';
import { IFile } from "../interfaces/IFile";
import { ValidationError } from "apollo-server-koa";
import { Category } from "../models/entities/Category";


export class ListingService implements IListingService {
    private repo: Repository<Listing>;
    private imageRepo: Repository<ListingImage>;
    private s3Client: S3;

    constructor() {
        const connection: Connection = Container.get('connection');
        this.repo = connection.getRepository(Listing);
        this.imageRepo = connection.getRepository(ListingImage);
        this.s3Client = Container.get('S3');

    }

    async searchListings(searchWord: string): Promise<IListing[]> {
        return await this.repo.createQueryBuilder('listing')
            .select()
            .leftJoinAndSelect('listing.images', 'images')
            .leftJoinAndSelect('listing.category', 'category')
            .leftJoinAndSelect('listing.user', 'user')
            .where("document @@ plainto_tsquery(:search)", { search: `${searchWord}` })
            .orderBy('title', 'DESC')
            .getMany();
    }

    async getListingById(id: string): Promise<IListing> {
        return await this.repo.findOne(id, { relations: ['user', 'images'] })
    }

    async createListing(data: IListingRequest, userId: string): Promise<IListing> {
        const listing = data.toEntity(userId);
        const newListing = await this.repo.save(listing);
        let fullListing = await this.repo.findOne(newListing.id, { relations: ['category'] })
        await this.updateFullTextSearchDocument(fullListing);
        listing.images = await this.saveListingImages(data.images, newListing);

        fullListing = await this.repo.findOne(newListing.id, { relations: ['images', 'user', 'category'] })
        fullListing.images = listing.images;
        console.log(fullListing)
        return fullListing
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
            // createQueryBuilder()
            //     .from('category', 'category')
            //     .update(listing)
            //     .set({ document: () => `setweight(to_tsvector(title), 'A') || setweight(to_tsvector(categor.name), 'B') || setweight(to_tsvector(description), 'C')` })
            //     .where("id = :id", { id: listing.id })
            //     .execute();
            console.log(result)
            return result.affected == 1;
        } catch (error) {
            console.error(error)
            throw error;
        }

    }

    public async getSignedUrls(files: IFile[], userId: string): Promise<SignedURL[]> {
        const signedUrls: SignedURL[] = files.map(file => {
            if (!file.contentType.includes('image/')) {
                throw new ValidationError("Invalid file type. Must be an image.")
            }
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