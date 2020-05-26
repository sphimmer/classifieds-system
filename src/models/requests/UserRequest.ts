import { IUserRequest } from "../../interfaces/IUserRequest";
import { Field, InputType } from "type-graphql";
import { ILocation } from "../../interfaces/ILocation";
import { LocationRequest } from "./LocationRequest";
import { IUser } from "../../interfaces/IUser";
import { User } from "../entities/User";
import { Location } from "../entities/Location";

/**
 * @inheritdoc
 */
@InputType()
export class UserRequest implements IUserRequest{
    /**
     * @inheritdoc
     */
    @Field()
    firstName: string;

    /**
     * @inheritdoc
     */
    @Field()
    lastName: string;

    /**
     * @inheritdoc
     */
    @Field()
    email: string;

    /**
     * @inheritdoc
     */
    @Field(() => LocationRequest)
    location: ILocation;

    /**
     * @inheritdoc
     */
    @Field()
    phoneNumber: string;
    
    public toEntity(): IUser{
        const user = new User();
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        user.email = this.email;
        user.location = new Location();
        user.location.id = this.location.id;
        user.location.user = user;
        user.phoneNumber = this.phoneNumber;
        return user;
    }
}