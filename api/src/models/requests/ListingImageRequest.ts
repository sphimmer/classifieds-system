import { IListingImageRequest } from "../../interfaces/IListingImageRequest";
import { InputType, Field } from "type-graphql";
import { IListingImage } from "../../interfaces/IListingImage";
import { ListingImage } from "../entities/ListingImage";

@InputType()
export class ListingImageRequest implements IListingImageRequest{

    @Field()
    path: string;

}