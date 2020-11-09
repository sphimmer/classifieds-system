import { IUserRequest } from "../../interfaces/IUserRequest";
import { ILocation } from "../../interfaces/ILocation";
import { IUser } from "../../interfaces/IUser";
import { User } from "../entities/User";
import { Location } from "../entities/Location";
import { IsString, IsEmail, IsPhoneNumber, validate, ValidateNested } from "class-validator";
import { LocationRequest } from "./LocationRequest";
import { ExistingResourceRequest } from "./ExistingResourceRequest";


/**
 * @inheritdoc
 */
export class UserRequest implements IUserRequest {

    constructor(jsonObject?: any) {
        if (jsonObject) {
            this.name = jsonObject.name;
            this.email = jsonObject.email;
            this.phoneNumber = jsonObject.phoneNumber;
            if ('location' in jsonObject) {
                this.location = new ExistingResourceRequest(jsonObject.location.id)
            }
        }
    }

    /**
     * @inheritdoc
     */
    id?: string;

    /**
     * @inheritdoc
     */
    @IsString()
    name: string;

    /**
     * @inheritdoc
     */
    @IsEmail()
    email: string;

    /**
     * @inheritdoc
     */
    @ValidateNested()
    location: ExistingResourceRequest;

    /**
     * @inheritdoc
     */
    @IsString()
    @IsPhoneNumber('US')
    phoneNumber: string;

    public async validate() {
        return await validate(this);
    }

    public toEntity(): IUser {
        const user = new User();
        user.name = this.name;

        user.email = this.email;
        if (this.location) {
            user.location = new Location();
            user.location.id = this.location.id;
            user.location.user = user;
        }
        user.phoneNumber = this.phoneNumber;
        return user;
    }
}