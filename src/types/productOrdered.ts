import { Product } from "./product.js"
import { Order } from "./order.js"
import { ProductOption } from "./productOption.js"


export type ProductOrder = {
    uuid: string,
    product_uuid: string,
    option_uuid: string,
    order_uuid: string,
    order: Order,
    productOption: ProductOption,
    product: Product,
    quantity: number,
    price: number,
    createdAt: Date,
    updatedAt: Date,
}