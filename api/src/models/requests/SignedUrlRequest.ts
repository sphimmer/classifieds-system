import { ISignedUrlRequest } from "../../interfaces/ISignedUrlRequest";
import { InputType, Field } from "type-graphql";
import { IFile } from "../../interfaces/IFile";
import { FileRequest } from "./FileRequest";

@InputType()
export class SignedUrlRequest implements ISignedUrlRequest{
    @Field(() => [FileRequest])
    files: FileRequest[];   
}