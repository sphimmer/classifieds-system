import { ILocation } from "../../interfaces/ILocation";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Timestamp, CreateDateColumn, DeleteDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Listing } from "./Listing";

/**
 * @inheritdoc
 */

@Entity()
export class Location implements ILocation{

    /**
     * @inheritdoc
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    /**
     * @inheritdoc
     */
    @OneToMany((type) => User, (user) => user.location)
    user: User;

    @OneToMany((type) => Listing, (listing) => listing.location)
    listing: Listing;
    
    /**
     * @inheritdoc
     */
    @Column('varchar')
    city: string;

    /**
     * @inheritdoc
     */
    @Column('varchar')
    zip: string;

    /**
     * @inheritdoc
     */
    @Column('varchar', {length: 2})
    state: string;

    /**
     * @inheritdoc
     */
    @CreateDateColumn({ type: "timestamptz" })
    dateCreated: Timestamp;

    /**
     * @inheritdoc
     */
    @DeleteDateColumn({ type: "timestamptz" })
    dateDeleted: Timestamp;
}
