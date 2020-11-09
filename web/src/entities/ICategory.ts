export interface ICategory{
    id: string,
    name: string,
    subcategories?: ICategory[];
    slug: string;
    parentCategory?: ICategory;
}