import { IListingImage } from "../../interfaces/IListingImage";
import { IListing } from "../../interfaces/IListing";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Listing } from "./Listing";
import { ObjectType, Field, ID } from "type-graphql";

/**
 * @inheritdoc
 */
@ObjectType()
@Entity()
export class ListingImage implements IListingImage{

    /**
     * @inheritdoc
     */
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * @inheritdoc
     */
    @Field()
    @Column({type:"varchar"})
    path: string;

    /**
     * @inheritdoc
     */
    @ManyToOne((type) => Listing, (listing) => listing.images)
    listing: IListing;
}