import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class SignedURL{
    @Field()
    URL: string;

    @Field()
    fileName: string;
}