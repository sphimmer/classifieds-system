import { IFile } from "./IFile";

/**
 * S3 Signed URL Request object
 */
export interface ISignedUrlRequest{
    /**
     * Names of the files to be uploaded
     */
    files: IFile[];

   
}