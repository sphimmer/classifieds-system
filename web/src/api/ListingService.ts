import { APIService } from "./APIService";
import { IListing } from "entities/IListing";
import { getUser } from "util/session";
import { ISignedUrlRepsonse } from "entities/responses/ISignedUrlResponse";
import { IImageUploadResponse } from "entities/responses/IImageUploadResponse";
import { ListingRequest } from "entities/requests/ListingRequest";
import { IListingResponse } from "entities/responses/IListingResponse";

export class ListingService extends APIService {
    public async createListing(listing: IListing): Promise<IListingResponse> {
        const urls = await this.getSignedUrls(listing.images);
        const imageUploadResponses = await this.uploadToSignedUrls(urls, listing.images)
        console.log(imageUploadResponses);
        imageUploadResponses.map(resp => {
            if (resp.status != 200) {
                console.error("Error uploading file: " + resp.fileName);
            }
        });
        const listingRequest = new ListingRequest(listing, imageUploadResponses);
        const savedSession = getUser();
        const body = {
            query: `
                mutation($data: ListingRequest!){
                    createListing(data: $data)
                    {
                        id
                        title
                        description
                        price
                        images{
                            id
                            path
                        }
                        category{
                            id
                            name
                        }
                        user{
                            id
                            email
                        }
                    }

            }
            `,
            variables: {
                data: listingRequest
            }
        }
        const response = await this.apiClient.post('/graphql', body, { headers: { 'Authorization': 'Bearer ' + savedSession!.jwt } });
        if (response.data.hasOwnProperty('errors')) {
            throw new Error(response.data.errors[0].extensions.code + ': ' + response.data.errors[0].message);
        }
        console.log(response);
        return response.data.data.createListing;
    }

    public async getSignedUrls(files: File[]): Promise<ISignedUrlRepsonse[]> {
        const savedSession = getUser();
        const data = {
            files: files.map(file => {
                return { "fileName": file.name, "contentType": file.type }
            })
        }
        const body = {
            query: `
                    query($data: SignedUrlRequest!){
                        signedUrls(data: $data){
                            URL
                            fileName
                    }
                }
            `, variables: {
                data: data
            }
        };


        const response = await this.apiClient.post('/graphql', body, { headers: { 'Authorization': 'Bearer ' + savedSession!.jwt } });
        if (response.data.hasOwnProperty('errors')) {
            throw new Error(response.data.errors[0].extensions.code + ': ' + response.data.errors[0].message);
        }
        return response.data.data.signedUrls;
    }

    public async uploadToSignedUrls(urls: ISignedUrlRepsonse[], files: File[]): Promise<IImageUploadResponse[]> {
        return Promise.all(urls.map(async (signedUrl) => {
            const file = files.find(file => file.name == signedUrl.fileName);
            const response = await this.s3ApiClient.put(signedUrl.URL, file, { headers: { 'Content-Type': file!.type } });
            return { status: response.status, fileName: file!.name, uploadPath: response.config.url!.split('?')[0] }
        }));

    }

    public async getMyListings(): Promise<IListingResponse[]> {
        const savedSession = getUser();
        const body = {
            query: `{
                me{
                    location{
                        city
                        zip
                        state
                    }
                    listings{
                        id
                        title
                        description
                        price
                        condition
                        category{
                            id
                            name
                        }
                        images{
                            id
                            path
                        }
                        dateCreated
                        dateExpires
                        
                    }
                }
            }
            `
        }
        const response = await this.apiClient.post('/graphql', body, { headers: { 'Authorization': 'Bearer ' + savedSession!.jwt } });

        return response.data.data.me.listings.map((listing: any) => {
            listing.user = { location: response.data.data.me.location };
            return listing;
        });
    }
}