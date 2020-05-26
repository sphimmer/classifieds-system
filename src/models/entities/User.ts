import { IUser } from "../../interfaces/IUser";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, DeleteDateColumn, Timestamp, JoinColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Location } from "./Location";
import { Listing } from "./Listing";

@ObjectType()
@Entity()
export class User implements IUser{
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Field()
    @Column('varchar')
    firstName: string;

    @Field()
    @Column('varchar')
    lastName: string;

    @Field()
    @Column('varchar')
    email: string;

    @Field(() => Location)
    @ManyToOne((type) => Location, (location) => location.user, {eager: true})
    location: Location;

    @Field()
    @Column('varchar')
    phoneNumber: string;

    @Field(() => [Listing])
    @OneToMany((type) => Listing, (listing) => listing.user)
    listings: Listing[]

    @Field(() => String)
    @CreateDateColumn({ type: "timestamptz" })
    dateCreated: Timestamp;

    @Field(() => String)
    @DeleteDateColumn({ type: "timestamptz" })
    dateDeleted: Timestamp;

}