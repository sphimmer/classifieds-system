import 'reflect-metadata';
import { Service } from 'typedi'
import NodeCache from 'node-cache';
import { ICategory } from 'entities/ICategory';

@Service()
export class CacheService {
    private cache: NodeCache;
    constructor() {
        this.cache = new NodeCache({ stdTTL: 60*60, checkperiod: 600 });
    }

    public cacheCategories(categories: ICategory[]): void {
        this.cache.set('categories', categories);
    }

    public getCategories(): ICategory[]{
        return this.cache.get('categories') as ICategory[];
    }
}