import { IFile } from "../../interfaces/IFile";

export class FileRequest implements IFile{
    fileName: string;
    contentType: string;
}