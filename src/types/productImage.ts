import { Product } from "./product.js";

export type ProductImage = {
    uuid: string,
    product_uuid: string,
    product: Product,
    path: string,
    isFirst: boolean,
    isOption: boolean,
    option_uuid: string,
    product_option_uuid: string,
    createdAt: Date,
    updatedAt: Date,
}