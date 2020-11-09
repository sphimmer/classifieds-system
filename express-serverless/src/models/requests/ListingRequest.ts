import { IListingRequest } from "../../interfaces/IListingRequest";
import { ListingImageRequest } from "./ListingImageRequest";
import { IListing } from "../../interfaces/IListing";
import { Listing } from "../entities/Listing";
import { ListingImage } from "../entities/ListingImage";
import { User } from "../entities/User";
import { ExistingResourceRequest } from "./ExistingResourceRequest";
import { Category } from "../entities/Category";
import { ConditionEnum } from "../enums/ConditionEnum";
import { IsString, Length, IsNumber, Validate, ValidateNested, IsEnum, validate, MaxLength, MinLength, IsUUID, IsOptional } from "class-validator";
import { IUser } from "../../interfaces/IUser";


export class ListingRequest implements IListingRequest{

    @IsUUID()
    @IsOptional()
    id: string;
    
    @IsString()
    @MaxLength(56)
    @MinLength(2)
    title: string;

    @IsString()
    @MinLength(5)
    description: string;
    
    @IsNumber()
    price: number;
    
    @ValidateNested({each: true})
    images: ListingImageRequest[];

    @IsEnum(ConditionEnum)
    condition: ConditionEnum;

    @ValidateNested()
    category: ExistingResourceRequest;

    constructor(listing?: IListingRequest){
        if(listing){
            this.id = listing.id;
            this.title = listing.title
            this.condition = listing.condition;
            this.description = listing.description;
            this.price = listing.price;
            this.category = listing.category
            this.images = listing.images;
        }
    }

    public toEntity(user: User): IListing{
        console.log(this)
        const listing = new Listing()
        listing.id = this.id;
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
        listing.user.id = user.id;
        listing.location = user.location

        return listing
    }

    async validate(){
        return await validate(this);
    }
}