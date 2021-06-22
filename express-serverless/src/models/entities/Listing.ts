import { IListing } from "../../interfaces/IListing";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Timestamp, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { ListingImage } from "./ListingImage";
import { IUser } from "../../interfaces/IUser";
import { User } from "./User";
import { ICategory } from "../../interfaces/ICategory";
import { Category } from "./Category";
import { ConditionEnum } from "../enums/ConditionEnum";
import { Location } from "./Location";
import { ILocation } from "../../interfaces/ILocation";

/**
 * @inheritdoc
 */

@Entity()
export class Listing implements IListing{
    
    protected static DaysToExpiration: number = 60;
    /**
     * @inheritdoc
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * @inheritdoc
     */
    @Column({type: "varchar", length: "56"})
    title: string;

    @Column({type: "varchar", nullable: true})
    thumbnailImage: string;

    /**
     * @inheritdoc
     */
    @OneToMany((type) => ListingImage, (listingImage) => listingImage.listing, {eager: true})
    images: ListingImage[];

    /**
     * @inheritdoc
     */
    @Column({type: "text"})
    description: string;

    /**
     * @inheritdoc
     */
    @Column({type: "float"})
    price: number;

    /**
     * @inheritdoc
     */
    @Column({type: 'enum', enum: ConditionEnum})
    condition: ConditionEnum;

    /**
     * @inheritdoc
     */
    @Column({type: "int", default: 0})
    views: number;

    /**
     * @inheritdoc
     */
    @ManyToOne((type) => User, (user) => user.listings)
    user: IUser;
    
    /**
     * @inheritdoc
     */
    @ManyToOne((type) => Category, (category) => category.listings)
    category: ICategory;

    @ManyToOne((type) => Location, (location) => location.listing, {eager: true})
    location: Location;

    /**
     * @inheritdoc
     */
    @CreateDateColumn({type: "timestamptz"})
    dateCreated: Timestamp;

    /**
     * @inheritdoc
     */
    @Column({type: "timestamptz", default: () => "(CURRENT_TIMESTAMP + INTERVAL '60 DAY')"})
    dateExpires: Timestamp;

    /**
     * @inheritdoc
     */
    @UpdateDateColumn({type: "timestamptz"})
    dateUpdated: Timestamp;

    /**
     * @inheritdoc
     */
    @DeleteDateColumn({type: "timestamptz"})
    dateDeleted: Timestamp;
    
    /**
     * @inheritdoc
     */
    @Column({type: 'tsvector', nullable: true})
    document: string;
    listing: ILocation;
}