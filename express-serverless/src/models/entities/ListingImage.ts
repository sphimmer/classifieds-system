import { IListingImage } from "../../interfaces/IListingImage";
import { IListing } from "../../interfaces/IListing";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Listing } from "./Listing";

/**
 * @inheritdoc
 */

@Entity()
export class ListingImage implements IListingImage{

    /**
     * @inheritdoc
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * @inheritdoc
     */
    @Column({type:"varchar"})
    path: string;

    /**
     * @inheritdoc
     */
    @ManyToOne((type) => Listing, (listing) => listing.images)
    listing: IListing;
}