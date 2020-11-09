import { IsString, IsUUID, IsInt, validate, IsOptional, minLength, Length, MinLength, IsDefined, IsNotEmpty } from "class-validator";

export class ListingSearchRequest {
    @IsString()
    @IsOptional()
    search: string;

    @IsUUID()
    @IsOptional()
    category?: string;

    @IsInt()
    page: number;

    pageLength: number = 10;
    
    constructor(search: string, page: string = "1", category: string = undefined) {
        this.search = search;
        this.category = category;
        this.page = parseInt(page);
    }

    async validate() {
        const errors = await validate(this);
        if(errors) {
            return errors.map((vError) => {
                return vError.constraints;
            });
        }
    }
}