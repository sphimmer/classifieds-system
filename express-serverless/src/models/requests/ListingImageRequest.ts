import { IListingImageRequest } from "../../interfaces/IListingImageRequest";
import { IsString } from "class-validator";

export class ListingImageRequest implements IListingImageRequest{
    @IsString()
    path: string;
}