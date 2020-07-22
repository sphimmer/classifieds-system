import { ILoginRequest } from "../../interfaces/ILoginRequest";
import { Field, InputType } from "type-graphql";

/**
 * @inheritdoc
 */
@InputType()
export class LoginRequest implements ILoginRequest {
    @Field()
    email: string;
    @Field()
    password: string;
}