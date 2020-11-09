import 'reflect-metadata';
import { Service, Container } from 'typedi';
import { APIService } from './APIService';
import { ICategory } from 'entities/ICategory';
import { CacheService } from './CacheService';
import { IListingResponse } from 'entities/responses/IListingResponse';

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
            
            try {
                const response = await this.apiClient.get('/categories', { headers: { "Content-Type": "application/json" } });
                for (let index = 0; index < response.data.length; index++) {
                    const parentCategory: ICategory = response.data[index];
                    parentCategory.slug = this.createSlug(parentCategory);
                    if (parentCategory.subcategories) {
                        parentCategory.subcategories.map((subCategory: ICategory) => {
                            subCategory.slug = this.createSlug(subCategory, parentCategory)
                        })
                    }
                }
                
                this.categoryCache.cacheCategories(response.data);
                return response.data as ICategory[]
            } catch (error) {
                console.error(error);
                throw new Error(error)
            }
        } else {
            return cachedCategories;
        }
    }

    public async getCategory(id: string): Promise<ICategory> {
    
        try {
            const response = await this.apiClient.get(`/categories/${id}`);
            return response.data as ICategory;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getListingsByCategoryId(id: string): Promise<IListingResponse[]>{
        try {
            const response = await this.apiClient.get(`/categories/${id}/listings`);
            return response.data as IListingResponse[];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private createSlug(category: ICategory, parentCategory?: ICategory): string{
        let slug: string;
        const categorySlug = "/" + category.name.toLowerCase().replace(/\s/g, '-') + '/';
        
        if (parentCategory) {
            slug = "/" + parentCategory.name.toLowerCase().replace(/\s/g, '-') + categorySlug;
        } else {
            slug = categorySlug
        }
        return slug;
    }
}