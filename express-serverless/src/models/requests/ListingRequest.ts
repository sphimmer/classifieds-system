import { IListingRequest } from "../../interfaces/IListingRequest";
import { ListingImageRequest } from "./ListingImageRequest";
import { IListing } from "../../interfaces/IListing";
import { Listing } from "../entities/Listing";
import { ListingImage } from "../entities/ListingImage";
import { User } from "../entities/User";
import { ExistingResourceRequest } from "./ExistingResourceRequest";
import { Category } from "../entities/Category";
import { ConditionEnum } from "../enums/ConditionEnum";


export class ListingRequest implements IListingRequest{

    title: string;

    description: string;
    
    price: number;
    
    images: ListingImageRequest[];

    condition: ConditionEnum;

    category: ExistingResourceRequest;

    public toEntity(userId: string): IListing{
        console.log(this)
        const listing = new Listing()
        listing.title = this.title;
        listing.description = this.description;
        listing.price = this.price;
        listing.condition = this.condition;
        listing.category = new Category();
        listing.category.id = this.category.id;
        listing.thumbnailImage = this.images[0].path;
        listing.images = this.images.map((imageRequest) =>{
            const image = new ListingImage();
            image.path = imageRequest.path;
            return image;
        });
        listing.user = new User()
        listing.user.id = userId;

        return listing
    }
}