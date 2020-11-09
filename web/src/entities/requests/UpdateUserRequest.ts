import { IUser } from "entities/IUser";
import { ILocation } from "entities/ILocation";

export class UpdateUserRequest {

    name: string;
    email: string;
    phoneNumber?: string;
    location?: ILocation;

    constructor(user: IUser){
        this.name = user.name;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.location = user.location;
    }
}