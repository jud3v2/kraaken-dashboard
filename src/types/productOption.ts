import { Category } from "./category.js"
import { Product } from "./product.js"
import { ProductImage } from "./productImage.js"
import { ProductOrder } from "./productOrdered.js"

export type ProductOption = {
    uuid: string,
    name: string,
    description: string,
    big_description: string,
    price: number,
    quantity: number,
    isDeleted: boolean,
    isFirst: boolean,
    product_uuid: string,
    product: Product,
    productImage: ProductImage,
    productOrder: ProductOrder,
    category_uuid: string,
    category: Category,
    createdAt: Date,
    updatedAt: Date,
}