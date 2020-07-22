import { ObjectType, Field } from "type-graphql";
import { StatusEnum } from "../enums/StatusEnum";
import { ILoginResult } from "../../interfaces/ILoginResult";
import { User } from "./User";

@ObjectType()
export class Login implements ILoginResult {

    @Field()
    status: StatusEnum;
    @Field()
    message: string;
    @Field()
    jwt: string;
    @Field()
    user: User;
}