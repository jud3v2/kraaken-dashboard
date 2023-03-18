import axios from 'axios'

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
    // PRODUCT API

    // OPTION API

    //OPTION
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

    optionGetOne: async (uuid: string) => {
        return await axios.get(`option/${uuid}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    optionGetAllFromProduct: async (uuid: string) => {
        return await axios.get(`option/${uuid}/product`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },
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
}