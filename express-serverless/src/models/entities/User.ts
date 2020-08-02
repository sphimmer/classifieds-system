import { IUser } from "../../interfaces/IUser";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, DeleteDateColumn, Timestamp } from "typeorm";
import { Location } from "./Location";
import { Listing } from "./Listing";
import { UserRole } from "../enums/UserRoleEnum";
import { AccountType } from "../enums/AccountTypeEnum";


@Entity()
export class User implements IUser{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column('varchar')
    firstName: string;

    @Column('varchar')
    lastName: string;

    @Column('varchar', {unique: true})
    email: string;

    @Column('varchar')
    password: string;

    @ManyToOne((type) => Location, (location) => location.user, {eager: true})
    location: Location;

    @Column('varchar', { nullable: true })
    phoneNumber: string;

    @OneToMany((type) => Listing, (listing) => listing.user)
    listings: Listing[]

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Column({
        type: 'enum',
        enum: AccountType,
        default: AccountType.INDIVIDUAL
    })
    accountType: AccountType;

    @CreateDateColumn({ type: "timestamptz" })
    dateCreated: Timestamp;

    @DeleteDateColumn({ type: "timestamptz" })
    dateDeleted: Timestamp;

    @Column({ type: 'varchar', nullable: true })
    refreshToken: string;

    @Column({ type: "timestamptz", nullable: true })
    refreshTokenExpiration: Timestamp;
}