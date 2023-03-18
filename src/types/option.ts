import { Category } from './category';

export type Option = {
    uuid: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
    big_description: string;
    category_uuid: string;
    category?: Category|string;
    product_uuid: string;
    product?: any;
}