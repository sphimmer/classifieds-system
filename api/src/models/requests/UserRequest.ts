import { IUserRequest } from "../../interfaces/IUserRequest";
import { Field, InputType } from "type-graphql";
import { ILocation } from "../../interfaces/ILocation";
import { LocationRequest } from "./LocationRequest";
import { IUser } from "../../interfaces/IUser";
import { User } from "../entities/User";
import { Location } from "../entities/Location";
import { ExistingResourceRequest } from "./ExistingResourceRequest";

/**
 * @inheritdoc
 */
@InputType()
export class  UserRequest implements IUserRequest{
    /**
     * @inheritdoc
     */
    @Field()
    id?: string;
    
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
    @Field()
    password: string;

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
    
    public validate(): string[]{
        const errors = []
        this.firstName.length < 1 ? errors.push('First Name is required') : null;
        this.lastName.length < 1 ? errors.push('Last Name is required') : null;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const isValid = re.test(String(this.email).toLowerCase())
        if (!isValid) {
            errors.push("Please provide a valid email address.");
        }
        this.password.length < 8 ? errors.push('password is required and must have a length of 8 or more') : null;
        return errors
    }

    public toEntity(): IUser{
        const user = new User();
        user.firstName = this.firstName;
        user.lastName = this.lastName;
        user.email = this.email;
        if(this.location){
            user.location = new Location();
            user.location.id = this.location.id;
            user.location.user = user;
        }
        user.phoneNumber = this.phoneNumber;
        user.password = this.password
        return user;
    }
}