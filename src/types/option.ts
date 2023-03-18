import { Category } from './category';

export type Option = {
    uuid: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
    big_description: string;
    isDeleted: boolean;
    isFirst: boolean;
    category_uuid: string;
    category?: Category|string;
    product_uuid: string;
    product?: any;
    productOrder?: any; //TODO: add type for productOrder
    createdAt: string;
    updatedAt: string;
}