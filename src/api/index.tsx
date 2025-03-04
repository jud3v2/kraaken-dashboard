import axios from 'axios'
import { config } from '../config/index'
export const api = {
    // CATEGORY API
    categoryAll: async () => {
        return await axios.get('category-all')
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    categoryDelete: async (uuid: string) => {
        return await axios.delete(`category/${uuid}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    categoryGetAllProduct: async (uuid: string) => {
        return await axios.get(`category/${uuid}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    categoryUpdate: async (data: any) => {
        return await axios.put(`category`, data)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    categoryCreate: async (data: any) => {
        return await axios.post(`category`, data)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },
    // CATEGORY API

    // PRODUCT API
    getProducts: async () => {
        return await axios.get('product-all')
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    getOneProduct: async (uuid: string|undefined) => {
        return await axios.get('product/' + uuid)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    updateProduct: async (data: any) => {
        return await axios.put('product', data)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    deleteProduct: async (uuid: string) => {
        return await axios.delete('product/' + uuid)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },
    createProduct: async (data: any) => {
        return await axios.post('product', data)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },
    // PRODUCT API

    // OPTION API
    optionCreate: async (data: any) => {
        return await axios.post(`option`, data)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    optionUpdate: async (data: any, uuid: string) => {
        return await axios.put(`option/${uuid}`, data)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    optionDelete: async (uuid: string) => {
        return await axios.delete(`option/${uuid}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    optionGetOne: async (uuid: string | undefined) => {
        if (uuid === undefined) return new Promise((resolve, reject) => {
            reject("Missing data")
        })
        return await axios.get(`option/${uuid}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    optionGetAllFromProduct: async (uuid: string) => {
        return await axios.get(`option/${uuid}/product`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },
    //OPTION API
    
    // USER API
    userLogin: async (data: any) => {
        if (data === undefined || data.identifiant === undefined || data.password === undefined){
            return new Promise((resolve, reject) => {
                reject("Missing data")
            })
        }
        return await axios.post('user/login', data)
    },

    getUser: async (uuid: string) => {
        return await axios.get('user/get-user/' + uuid)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    // USER API

    // IMAGE API
    imageCreate: async (data: any, uuid: string|undefined) => {
        if(uuid === undefined) {
            return new Promise((reject) => {
                reject("Missing data")
            })
        }

        return await axios.post(`product-image-create/${uuid}`, data)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    imageDelete: async (uuid: string) => {
        return await axios.delete(`product-image-delete/${uuid}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    imageGetAllFromProduct: async (uuid: string) => {
        return await axios.get(`product-image-get-all/${uuid}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    imageChangeToFirst: async (uuid: string, productUUID: string) => {
        return await axios.put(`product-image-update-first/${uuid}/${productUUID}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    imageGetOne: async (uuid: string) => {
        return await axios.get(`product-image/${uuid}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})   
    },

    imageUpdate: async (data: any, uuid: string) => {
        return await axios.put(`product-image-update/${uuid}`, data)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    imageGet: (name: string) => {
        return `${config.apiURL}show-product-image/${name}`
    },
    // IMAGE API

    // ORDER API

    orderCreate: async (data: any) => {
        return new Promise(async (resolve, reject) => {
            return await axios.post('order', data)
            .then(({data}) => resolve(data))
            .catch((err) => reject(err))
        })
    },

    orderGetAll: async () => {
        return new Promise(async (resolve, reject) => {
            return await axios.get('order-all')
            .then(({data}) => resolve(data))
            .catch((err) => reject(err))
        })
    },

    orderGetOne: async (uuid: string|undefined) => {
        return new Promise(async (resolve, reject) => {
            if(uuid === undefined) {
                reject("Missing data")
            }

            return await axios.get('order/' + uuid)
            .then(({data}) => resolve(data))
            .catch((err) => reject(err))
        })
    },

    orderUpdate: async (data: any, uuid: string|undefined) => {
        return new Promise(async (resolve, reject) => {
            if(uuid === undefined) {
                reject("Missing data")
            }

            return await axios.put('order/' + uuid, data)
            .then(({data}) => resolve(data))
            .catch((err) => reject(err))
        })
    },

    orderDelete: async (uuid: string|undefined) => {
        return new Promise(async (resolve, reject) => {
            if(uuid === undefined) {
                reject("Missing data")
            }

            return await axios.delete('order/' + uuid)
            .then(({data}) => resolve(data))
            .catch((err) => reject(err))
        })
    },

    orderPushProduct: async (data: any, uuid: string|undefined) => {
        return new Promise(async (resolve, reject) => {
            if(uuid === undefined) {
                reject("Missing data")
            }

            return await axios.post(`order-add-product/${uuid}`, data)
            .then(({data}) => resolve(data))
            .catch((err) => reject(err))
        })
    },

    orderDeleteProduct: async (uuid: string | undefined, productUUID: string | undefined) => {
        return new Promise(async (resolve, reject) => {
            if(uuid === undefined || productUUID === undefined) {
                reject("Missing data")
            }

            return await axios.delete(`order-remove-product/${uuid}/${productUUID}`)
            .then(({data}) => resolve(data))
            .catch((err) => reject(err))
        })
    },

    orderUpdateProductQuantity: async (data: any, uuid: string | undefined, productUUID: string | undefined) => {
        return new Promise(async (resolve, reject) => {
            if(uuid === undefined || productUUID === undefined) {
                reject("Missing data")
            }

            return await axios.put(`order-update-product/${uuid}/${productUUID}`, data)
            .then(({data}) => resolve(data))
            .catch((err) => reject(err))
        })
    },

    orderUpdateStatus: async (data: any, uuid: string|undefined) => {
        return new Promise(async (resolve, reject) => {
            if(uuid === undefined) {
                reject("Missing data")
            }

            return await axios.put('order-status/' + uuid, data)
            .then(({data}) => resolve(data))
            .catch((err) => reject(err))
        })
    },

    // ORDER API
}