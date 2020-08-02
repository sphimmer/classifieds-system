import { IRefreshRequest } from "../../interfaces/IRefreshRequest";
import { InputType, Field } from "type-graphql";

/**
 * @inheritdoc
 */
@InputType()
export class RefreshRequest implements IRefreshRequest{
    @Field()
    refreshToken: string;
    
}