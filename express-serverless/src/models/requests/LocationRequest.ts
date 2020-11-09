import { ILocationRequest } from "../../interfaces/ILocationRequest";
import {Length, IsString, validate, IsUUID, IsOptional} from 'class-validator'
import { ILocation } from "../../interfaces/ILocation";
/**
 * @inheritdoc
 */

export class LocationRequest implements ILocationRequest{
    
    /**
     * @inheritdoc
     */
    id: string;

    /**
     * @inheritdoc
     */
    @IsString()
    city: string;
    
    /**
     * @inheritdoc
     */
    @Length(5)
    @IsString()
    zip: string;
   
    /**
     * @inheritdoc
     */
    @Length(2)
    @IsString()
    state: string;   
    constructor(data: ILocation){
        this.city = data.city;
        this.zip = data.zip;
        this.state= data.state;
    }
    async validate(){
        const errors = await validate(this);
        return errors;

    }
}