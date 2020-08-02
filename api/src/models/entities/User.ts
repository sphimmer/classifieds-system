import { IUser } from "../../interfaces/IUser";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, DeleteDateColumn, Timestamp, JoinColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Location } from "./Location";
import { Listing } from "./Listing";
import { UserRole } from "../enums/UserRoleEnum";
import { AccountType } from "../enums/AccountTypeEnum";

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
    @Column('varchar', {unique: true})
    email: string;

    @Column('varchar')
    password: string;

    @Field(() => Location)
    @ManyToOne((type) => Location, (location) => location.user, {eager: true})
    location: Location;

    @Field()
    @Column('varchar', { nullable: true })
    phoneNumber: string;

    @Field(() => [Listing])
    @OneToMany((type) => Listing, (listing) => listing.user)
    listings: Listing[]

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Field()
    @Column({
        type: 'enum',
        enum: AccountType,
        default: AccountType.INDIVIDUAL
    })
    accountType: AccountType;

    @Field(() => String)
    @CreateDateColumn({ type: "timestamptz" })
    dateCreated: Timestamp;

    @Field(() => String)
    @DeleteDateColumn({ type: "timestamptz" })
    dateDeleted: Timestamp;

    @Field(() => String)
    @Column({ type: 'varchar', nullable: true })
    refreshToken: string;

    @Column({ type: "timestamptz", nullable: true })
    refreshTokenExpiration: Timestamp;
}