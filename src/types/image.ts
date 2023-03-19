export type Image = {
    uuid: string,
    product_uuid?: string,
    option_uuid?: string,
    path: string,
    isDeleted: boolean,
    isOption: boolean,
    isFirst: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export type CreateImage = {
    product_uuid?: string,
    option_uuid?: string,
}