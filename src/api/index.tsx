import axios from 'axios'

export const api = {
    // CATEGORY API
    categoryAll: async () => {
        return await axios.get('category-all')
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    categoryDelete: async (uuid) => {
        return await axios.delete(`category/${uuid}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    categoryGetAllProduct: async (uuid) => {
        return await axios.get(`category/${uuid}`)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    categoryUpdate: async (data) => {
        return await axios.put(`category`, data)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    categoryCreate: async (data) => {
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

    getOneProduct: async (uuid) => {
        return await axios.get('product/' + uuid)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    updateProduct: async (data) => {
        return await axios.put('product', data)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },
    // PRODUCT API

    // USER API
    userLogin: async (data) => {
        if (data === undefined || data.identifiant === undefined || data.password === undefined){
            return new Promise((resolve, reject) => {
                reject("Missing data")
            })
        }
        return await axios.post('user/login', data)
    },

    getUser: async (uuid) => {
        return await axios.get('user/get-user/' + uuid)
        .then(({data}) => {return data})
        .catch((err) => {return err})
    },

    // USER API
}