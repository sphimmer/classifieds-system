import axios, { AxiosResponse } from 'axios'
import * as qs from 'querystring'
import { APIService } from './APIService';
import { ICategory } from 'entities/ICategory';

export class CategoryService extends APIService{
    public async getCategories(): Promise<ICategory[]> {
        const request = {query: `{
            categories{
             id
             name
           }
         }`};
        try {
            const response = await this.apiClient.post('/graphql', request, {headers: {"Content-Type": "application/json"}});
            if (response.data.hasOwnProperty('errors')) {
                throw new Error(response.data.errors[0]);
            }
            console.log(response);
            return response.data.data.categories as ICategory[]
        } catch (error) {
            console.error(error);
            throw new Error(error)
        }
        
    }

    public async getCategory(id:string): Promise<ICategory>{
        const request = {
            query: `{
                category(id: "${id}"){
                    id
                    name
                    subcategories{
                        id
                        name
                    }
                }
            }`
        }

        try {
            const response = await this.apiClient.post('/graphql', request);
            return response.data.data.category as ICategory;
        } catch (error) {
            console.error(error);
            throw new Error(error)
        }
    }
}