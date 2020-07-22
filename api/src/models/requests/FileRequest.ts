import { IFile } from "../../interfaces/IFile";
import { InputType, Field } from "type-graphql";

@InputType()
export class FileRequest implements IFile{
    @Field()
    fileName: string;
    @Field()
    contentType: string;
}