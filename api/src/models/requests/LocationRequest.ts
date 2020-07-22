import { ILocationRequest } from "../../interfaces/ILocationRequest";
import { InputType, Field, ID } from "type-graphql";

/**
 * @inheritdoc
 */
@InputType()
export class LocationRequest implements ILocationRequest{
    
    /**
     * @inheritdoc
     */
    @Field(() => ID)
    id: string;

    /**
     * @inheritdoc
     */
    @Field()
    city: string;
    
    /**
     * @inheritdoc
     */
    @Field()
    zip: string;
   
    /**
     * @inheritdoc
     */
    @Field()
    state: string;   
}