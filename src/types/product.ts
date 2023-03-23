import { Category } from './category';
import { ProductOption } from './productOption';

export type Product = {
    uuid: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
    big_description: string;
    category_uuid: string;
    category: Category;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    productOption: ProductOption[];
}

export type CreateProduct = {
    name: string;
    quantity: number;
    price: number;
    description: string;
    big_description: string;
    category_uuid: string;
}