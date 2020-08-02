import { ISignedUrlRequest } from "../../interfaces/ISignedUrlRequest";
import { FileRequest } from "./FileRequest";


export class SignedUrlRequest implements ISignedUrlRequest{
    files: FileRequest[];   
}