import { Category } from './category';

export type Product = {
    uuid: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
    category_uuid: string;
    category?: Category;
}