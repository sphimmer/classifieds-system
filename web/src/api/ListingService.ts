import 'reflect-metadata';
import { Service } from 'typedi';
import { APIService } from "./APIService";
import { IListing } from "entities/IListing";
import { ISignedUrlRepsonse } from "entities/responses/ISignedUrlResponse";
import { IImageUploadResponse } from "entities/responses/IImageUploadResponse";
import { ListingRequest } from "entities/requests/ListingRequest";
import { IListingResponse } from "entities/responses/IListingResponse";
import { IContactInfo } from 'entities/IContactInfo';
import { ListingUpdateRequest } from 'entities/requests/ListingUpdateRequest';

@Service()
export class ListingService extends APIService {
    public async createListing(listing: ListingRequest): Promise<IListingResponse> {
        const response = await this.apiClient.post('/listings', listing);
        console.log(response);
        return response.data;
    }

    private async getSignedUrls(files: File[]): Promise<ISignedUrlRepsonse[]> {

        const data = {
            files: files.map(file => {
                return { "fileName": file.name, "contentType": file.type }
            })
        }

        const response = await this.apiClient.post('/listings/signedUrls', data);

        return response.data;
    }

    public async uploadImages(files: File[]): Promise<IImageUploadResponse[]> {
        const urls = await this.getSignedUrls(files);
        const imageUploadResponses = await this.uploadToSignedUrls(urls, files)
       
        return imageUploadResponses
    }

    private async uploadToSignedUrls(urls: ISignedUrlRepsonse[], files: File[]): Promise<IImageUploadResponse[]> {
        return Promise.all(urls.map(async (signedUrl) => {
            const file = files.find(file => file.name === signedUrl.fileName);
            const response = await this.s3ApiClient.put(signedUrl.URL, file, { headers: { 'Content-Type': file!.type } });
            return { status: response.status, fileName: file!.name, uploadPath: response.config.url!.split('?')[0] }
        }));

    }

    public async getMyListings(): Promise<IListingResponse[]> {

        const response = await this.apiClient.get('/me/listings');

        return response.data;
    }

    public async getListing(id: string): Promise<IListingResponse> {
        const response = await this.apiClient.get(`/listings/${id}`)
        return response.data;
    }

    async getListingContact(id: string): Promise<IContactInfo> {
        const response = await this.apiClient.get(`/listings/${id}/contact`)
        return response.data;
    }

    async deleteListing(id: string): Promise<boolean> {
        const response = await this.apiClient.delete(`/listings/${id}`);
        console.log(response);
        if (response.status == 204) {
            return true;
        } else {
            return false;
        }
    }

    async searchListings(searchTerm: string): Promise<IListingResponse[]> {
        const response = await this.apiClient.get<IListingResponse[]>('/listings/', { params: { search: searchTerm } });
        return response.data;
    }

    async updateListing(listing: ListingUpdateRequest): Promise<IListingResponse[]> {
        const response = await this.apiClient.put(`/listings/${listing.id}`, listing);
        console.log(response);
        return response.data;
    }
}