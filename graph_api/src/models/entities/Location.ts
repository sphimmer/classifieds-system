import { ILocation } from "../../interfaces/ILocation";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Timestamp, CreateDateColumn, DeleteDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";

/**
 * @inheritdoc
 */
@ObjectType()
@Entity()
export class Location implements ILocation{

    /**
     * @inheritdoc
     */
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    /**
     * @inheritdoc
     */
    @OneToMany((type) => User, (user) => user.location)
    user: User;

    /**
     * @inheritdoc
     */
    @Field()
    @Column('varchar')
    city: string;

    /**
     * @inheritdoc
     */
    @Field()
    @Column('varchar')
    zip: string;

    /**
     * @inheritdoc
     */
    @Field()
    @Column('varchar', {length: 2})
    state: string;

    /**
     * @inheritdoc
     */
    @Field(() => String)
    @CreateDateColumn({ type: "timestamptz" })
    dateCreated: Timestamp;

    /**
     * @inheritdoc
     */
    @DeleteDateColumn({ type: "timestamptz" })
    dateDeleted: Timestamp;
}
