import { validate } from "class-validator";
import { BadRequestError } from "../errors/BadRequestError";

export async function validateRequest(request: any): Promise<void>{
    const errors = await validate(request)
    console.log(errors);
    if (errors.length > 0) {
        const errorMessages = errors.map(e => {
            return e.constraints;
        })    
        throw new BadRequestError(errorMessages);
    }
}