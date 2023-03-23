import React, {useState, useEffect} from 'react';
import {api} from '../../api';
import {useMutation, useQueryClient} from 'react-query';
import { LoadingButton } from '@mui/lab';
import { Stack, TextField, Typography, Divider, Select, MenuItem } from '@mui/material'
import {toast} from 'react-hot-toast'
import dayjs from 'dayjs'

export default function UpdateOrder(props: any) {
    const queryClient = useQueryClient();
    const [order, setOrder] = useState({...props.data})

    const handleChange = (e: any) => {
        setOrder({...order, [e.target.name]: e.target.value})
    }

    useEffect(() => {
        if(props.data.order){
            setOrder({
                deliveryAddress: props.data.order.deliveryAddress || '',
                deliveryCity: props.data.order.deliveryCity || '',
                deliveryZipCode: props.data.order.deliveryZipCode || '',
                deliveryCountry: props.data.order.deliveryCountry || '',
                deliveryComment: props.data.order.deliveryComment || '',
                deliveryPrice: props.data.order.deliveryPrice || 0,
                deliveryDate: dayjs(props.data.order.deliveryDate).format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
                deliveryToken: props.data.order.deliveryToken || '',
                isDelivered: props.data.order.isDelivered || false,
                name: props.data.order.name || '',
                forename: props.data.order.forename || '',
                phoneNumber: props.data.order.phoneNumber || '',
                email: props.data.order.email || '',
            })
        }
    }, [props.data])

    const spaceAroundStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }

    const inputStyle = {
        m: 1,
        width: '100%'
    }

    const {isLoading, mutate} = useMutation(async () => {
        const data = {
            ...order,
            deliveryPrice: parseFloat(order.deliveryPrice),
            deliveryDate: dayjs(order.deliveryDate).toDate(),
            isDelivered: parseInt(order.isDelivered) ? true : false
        }

        if(!validateData()){
            return;
        }

        return await api.orderUpdate(data, props.data.order.uuid)
        .then((data) => {
            toast.success('Commande modifiée avec succès')
            queryClient.invalidateQueries(['orders', order.uuid])
            return data
        })
        .catch((err) => {
            toast.error('Une erreur est survenue')
            return err
        })
        
    })

    const validateData = () => {
        const errors = [];
        if(order.name === ''){
            errors.push('Le nom du client est requis')
        }
        if(order.forename === ''){
            errors.push('Le prénom du client est requis')
        }
        if(order.phoneNumber === ''){
            errors.push('Le numéro de téléphone du client est requis')
        }
        if(order.email === ''){
            errors.push('L\'email du client est requis')
        }
        for(let i = 0; i < errors.length; i++){
            toast.error(errors[i])
        }
        return errors.length === 0
    }

    return (
        <Stack sx={{
            p: 2
        }}>
            <Typography variant='h4'>
                Modification de la commande: {order.uuid?.substring(0, 8)}
            </Typography>
            <Divider sx={{my: 2}} />
            <Stack sx={{my: 2}}>
                <Typography variant='h6' sx={{mb: 2}}>
                    Informations du client
                </Typography>
                <Stack sx={spaceAroundStyle}>
                    <TextField  sx={inputStyle} required value={order.name || ''} type={'text'} onChange={handleChange} name='name' label='Nom du client' />
                    <TextField  sx={inputStyle} required value={order.forename || ''} type={'text'} onChange={handleChange} name='forename' label='Prénom du client' />
                </Stack>
                <Typography variant='h6' sx={{my: 2}}>
                    Informations de contact du client
                </Typography>
                <Stack sx={spaceAroundStyle}>
                    <TextField  sx={inputStyle} required value={order.phoneNumber || ''} type={'text'} onChange={handleChange} name='phoneNumber' label='Numéro de téléphone du client' />
                    <TextField  sx={inputStyle} required value={order.email || ''} type={'text'} onChange={handleChange} name='email' label='Email du client' />
                </Stack>

                <Typography variant='h6' sx={{my: 2}}>
                    Adresse de livraison
                </Typography>
                <Stack>
                    <TextField  sx={inputStyle} value={order.deliveryAddress || ''} type={'text'} onChange={handleChange} name='deliveryAddress' label='Adresse du client' />
                    <Stack sx={spaceAroundStyle}>
                        <TextField  sx={inputStyle} type={'text'} value={order.deliveryCity || ''} onChange={handleChange} name='deliveryCity' label='Ville du client' />
                        <TextField sx={inputStyle} type={'number'} value={order.deliveryZipCode || 0} onChange={handleChange} name='deliveryZipCode' label='Code postal du client' />
                        <TextField  sx={inputStyle} type={'text'} value={order.deliveryCountry || ''} name='deliveryCountry' onChange={handleChange} label='Pays du client'/>
                    </Stack>
                    <TextField  sx={inputStyle} type={'text'} value={order.deliveryComment || ''} name={'deliveryComment'} onChange={handleChange}  multiline rows={4}  label='Commentaire de livraison requis par le client'/>
                </Stack>
                <Stack>
                    <Typography variant='h6' sx={{my: 2}}>
                        Modalité de livraison
                    </Typography>
                    <Stack sx={spaceAroundStyle}>
                        <TextField sx={inputStyle} type={"number"} value={order.deliveryPrice || 0} name='deliveryPrice' onChange={handleChange} label='Prix de livraison'/>
                        
                        <TextField sx={inputStyle} type={'date'} value={order.deliveryDate || ''} name='deliveryDate' onChange={handleChange} label='Date de livraison'/>

                        <TextField  sx={inputStyle} type={'text'} value={order.deliveryToken || ''} name='deliveryToken' onChange={handleChange} label='Numéro de suivis'/>
                    </Stack>
                </Stack>
                <Stack>
                    <Typography variant='h6' sx={{my: 2}}>
                        Type de livraison
                    </Typography>
                    <Stack sx={spaceAroundStyle}>
                        <Select defaultValue={0} name='isDelivered' value={order.isDelivered ? 1 : 0} onChange={handleChange} sx={inputStyle}>
                            <MenuItem value={1}>Livraison</MenuItem>
                            <MenuItem value={0}>Retrait</MenuItem>
                        </Select>
                    </Stack>
                </Stack>
                <Stack sx={{my: 2}}>
                    <LoadingButton variant='contained' loading={isLoading} onClick={() => mutate()}>
                        Enregistrer les modifications
                    </LoadingButton>
                </Stack>
            </Stack>
        </Stack>
    )
}