import { Category } from "../entities/Category";
import { ICategoryRequest } from "../../interfaces/ICategoryRequest";
import { IsUUID, IsString, MinLength, validate } from "class-validator";

export class CategoryRequest implements ICategoryRequest{

    @IsUUID()
    id: string;
    
    @IsString()
    @MinLength(3)
    name: string;

    subcategories: Category[];

    async validate(){
        const errors = await validate(this);
        return errors.map(e => {
            return e.constraints
        })
    }
}