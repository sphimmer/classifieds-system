import { IFile } from "../../interfaces/IFile";
import { IsString, Contains } from "class-validator";

export class FileRequest implements IFile{
    @IsString()
    fileName: string;
    
    @IsString()
    @Contains("image/")
    contentType: string;
}