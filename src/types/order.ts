import { ProductOrder } from "./productOrdered.js"

export type Order = {
    uuid: string,
    name: string,
    forename: string,
    email: string,
    phoneNumber: string,
    isPaid: boolean,
    isDelivered: boolean,
    isDeleted: boolean,
    price: number,
    status: OrderStatus,
    paymentToken: string,
    paymentDate: string,
    deliveryToken: string,
    deliveryDate: Date,
    deliveryPrice: number,
    deliveryAddress: string,
    deliveryZipCode: string,
    deliveryCountry: string,
    deliveryComment: string,
    productOrder: ProductOrder,
    createdAt: Date,
    updatedAt: Date,
}

enum OrderStatus {
    'new',
    'paid',
    'delivered',
    'canceled',
    'preparation'
}

export type OrderCreate = {
    uuid: string,
    name: string,
    forename: string,
    email: string,
    phoneNumber: string,
}

