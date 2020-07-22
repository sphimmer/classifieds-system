import { IListing } from "../../interfaces/IListing";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Timestamp, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { ListingImage } from "./ListingImage";
import { ConditionEnum } from "../../enums/ConditionEnum";
import { IUser } from "../../interfaces/IUser";
import { User } from "./User";
import { ICategory } from "../../interfaces/ICategory";
import { Category } from "./Category";

/**
 * @inheritdoc
 */
@ObjectType()
@Entity()
export class Listing implements IListing{
    
    protected static DaysToExpiration: number = 60;
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
    @Column({type: "varchar", length: "56"})
    title: string;


    @Field()
    @Column({type: "varchar", nullable: true})
    thumbnailImage: string;

    /**
     * @inheritdoc
     */
    @Field(() => [ListingImage])
    @OneToMany((type) => ListingImage, (listingImage) => listingImage.listing, {eager: true})
    images: ListingImage[];

    /**
     * @inheritdoc
     */
    @Field()
    @Column({type: "text"})
    description: string;

    /**
     * @inheritdoc
     */
    @Field()
    @Column({type: "float"})
    price: number;

    /**
     * @inheritdoc
     */
    @Field()
    @Column({type: 'enum', enum: ConditionEnum})
    condition: ConditionEnum;

    /**
     * @inheritdoc
     */
    @Field()
    @Column({type: "int", default: 0})
    views: number;

    /**
     * @inheritdoc
     */
    @Field(() => User)
    @ManyToOne((type) => User, (user) => user.listings, {eager: true})
    user: IUser;
    
    /**
     * @inheritdoc
     */
    @Field(() => Category)
    @ManyToOne((type) => Category, (category) => category.listings, {eager: true})
    category: ICategory;


    /**
     * @inheritdoc
     */
    @Field(() => String)
    @CreateDateColumn({type: "timestamptz"})
    dateCreated: Timestamp;

    /**
     * @inheritdoc
     */
    @Field(() => String)
    @Column({type: "timestamptz", default: () => "(CURRENT_TIMESTAMP + INTERVAL '60 DAY')"})
    dateExpires: Timestamp;

    /**
     * @inheritdoc
     */
    @Field(() => String)
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
}