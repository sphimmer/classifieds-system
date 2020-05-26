import { Field, InputType, ID } from "type-graphql";
import { IExistingResourceRequest } from "../../interfaces/IExistingResourceRequest";


/**
 * @inheritdoc
 */
@InputType()
export class ExistingResourceRequest implements IExistingResourceRequest{
    /**
     * @inheritdoc
     */
    @Field(() => ID)
    id: string;
}