import 'reflect-metadata';
import { Service, Container } from 'typedi';
import { APIService } from './APIService';
import { ICategory } from 'entities/ICategory';
import { CacheService } from './CacheService';

@Service()
export class CategoryService extends APIService {
    private categoryCache: CacheService;
    constructor() {
        super()
        this.categoryCache = Container.get(CacheService);
    }

    public async getCategories(): Promise<ICategory[]> {
        const cachedCategories = this.categoryCache.getCategories();
        if (!cachedCategories) {
            const request = {
                query: `{
                    categories{
                    id
                    name
                    subcategories{
                        id
                        name
                        }
                    }
                }`
            };

            try {
                const response = await this.apiClient.post('/graphql', request, { headers: { "Content-Type": "application/json" } });
                if (response.data.hasOwnProperty('errors')) {
                    throw new Error(response.data.errors[0]);
                }
                this.categoryCache.cacheCategories(response.data.data.categories);
                return response.data.data.categories as ICategory[]
            } catch (error) {
                console.error(error);
                throw new Error(error)
            }
        } else {
            return cachedCategories;
        }


    }

    public async getCategory(id: string): Promise<ICategory> {
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