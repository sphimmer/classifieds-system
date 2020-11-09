import { ISignedUrlRequest } from "../../interfaces/ISignedUrlRequest";
import { FileRequest } from "./FileRequest";
import { ValidateNested, validate } from "class-validator";
import { AnyLengthString } from "aws-sdk/clients/comprehend";
import { BadRequestError } from "../../errors/BadRequestError";


export class SignedUrlRequest implements ISignedUrlRequest{
    constructor(requestBody: any){
        if(requestBody.files && requestBody.files.length > 0){
            for (let i = 0; i < requestBody.files.length; i++) {
                const fileRequest = new FileRequest();
                fileRequest.contentType = requestBody.files[i].contentType;
                fileRequest.fileName = requestBody.files[i].fileName;
                this.files.push(fileRequest)
            }
        } else {
            throw new BadRequestError("Request body must contain a list of files");
        }
        
    }
    @ValidateNested({each: true})
    files: FileRequest[] = [];

    async validate(){
        return await validate(this);
    }
}