import { InputType, Field } from "type-graphql";
import { ExistingResourceRequest } from "./ExistingResourceRequest";
import { Category } from "../entities/Category";
import { ICategoryRequest } from "../../interfaces/ICategoryRequest";

@InputType()
export class CategoryRequest implements ICategoryRequest{

    @Field()
    id: string;
    
    @Field()
    name: string;

    @Field(() => [ExistingResourceRequest])
    subcategories: Category[];
}