import { ICategory } from "../../interfaces/ICategory";
import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, Timestamp, getConnection, JoinTable, ManyToMany, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent, DeleteDateColumn } from "typeorm";
import { IListing } from "../../interfaces/IListing";
import { Listing } from "./Listing";

/**
 * @inheritdoc
 */

@Entity()
@Tree("closure-table")
export class Category implements ICategory{
    
    /**
     * @inheritdoc
     */
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * @inheritdoc
     */
    @Unique("category_name", ["name"])
    @Column({ type: "character varying", nullable: false })
    name: string;

    /**
     * @inheritdoc
     */
    @OneToMany((type) => Listing, (listing) => listing.category)
    listings: IListing[]

    /**
     * @inheritdoc
     */
    @DeleteDateColumn({type: 'timestamptz'})
    dateDeleted: Timestamp;

    /**
     * @inheritdoc
     */
    @TreeChildren()
    subcategories: ICategory[];

    /**
     * @inheritdoc
     */
    @TreeParent()
    parentCategory: Category;

    /**
     * @inheritdoc
     */
    @CreateDateColumn({ type: "timestamptz" })
    dateCreated: Timestamp;
}

