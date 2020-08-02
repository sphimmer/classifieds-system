import { ICategory } from "../../interfaces/ICategory";
import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, Timestamp, getConnection, JoinTable, ManyToMany, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent, DeleteDateColumn } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IListing } from "../../interfaces/IListing";
import { Listing } from "./Listing";

/**
 * @inheritdoc
 */
@ObjectType()
@Entity()
@Tree("closure-table")
export class Category implements ICategory{
    
    /**
     * @inheritdoc
     */
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * @inheritdoc
     */
    @Field()
    @Unique("category_name", ["name"])
    @Column({ type: "character varying", nullable: false })
    name: string;

    /**
     * @inheritdoc
     */
    @Field(() => [Listing])
    @OneToMany((type) => Listing, (listing) => listing.category, {eager: true})
    listings: IListing[]

    /**
     * @inheritdoc
     */
    @DeleteDateColumn({type: 'timestamptz'})
    dateDeleted: Timestamp;

    /**
     * @inheritdoc
     */
    @Field(() => [Category])
    @TreeChildren()
    subcategories: ICategory[];

    /**
     * @inheritdoc
     */
    @Field(() => Category)
    @TreeParent()
    parentCategory: Category;

    /**
     * @inheritdoc
     */
    @Field(() => String)
    @CreateDateColumn({ type: "timestamptz" })
    dateCreated: Timestamp;
}

