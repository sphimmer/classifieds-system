import { IUser } from "entities/IUser";
import { ILocation } from "entities/ILocation";

export class UpdateUserRequest {

    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    location?: ILocation;

    constructor(user: IUser){
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.location = user.location;
    }
}