import React, {useState, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query';
import {api} from '../../api'
import {toast} from 'react-hot-toast'
import {LoadingButton} from '@mui/lab'
import {Stack, Select, MenuItem, Typography, Divider} from '@mui/material'

export default function UpdateStatus(props: any) {
    const [status, setStatus] = useState('new')
    const queryClient = useQueryClient();

    useEffect(() => {
        if(props.data.order){
            setStatus(props.data.order.status)
        }
    }, [props.data.order])
    
    const handleChange = (e: any) => {
        setStatus(e.target.value)
    }

    const {isLoading, mutate} = useMutation(async () => {
        return await api.orderUpdateStatus({status: status}, props.data.order.uuid)
        .then((data) => {
            toast.success('Statut de la commande mis à jour')
            queryClient.invalidateQueries('orders', props.data.order.uuid)
        })
        .catch((error) => {
            toast.error('Une erreur est survenue')
        })
    })
    
    return (
        <Stack spacing={2}>
            <Typography variant="h6" gutterBottom>
                Statut de la commande
            </Typography>
            <Divider sx={{my: 2}} />
            <Stack>
                <Select value={status} onChange={handleChange}>
                    <MenuItem value="new">En attente</MenuItem>
                    <MenuItem value="preparation">En cours de préparation</MenuItem>
                    <MenuItem value="delivered">Livré</MenuItem>
                    <MenuItem value="canceled">Annulé</MenuItem>
                    <MenuItem value="paid">A été payé</MenuItem>
                    <MenuItem value="isDelivery">En cours de livraison</MenuItem>
                </Select>
            </Stack>
            <Stack>
                <LoadingButton variant='contained' loading={isLoading} onClick={() => mutate()}>
                    Mettre à jour le statut de la commande
                </LoadingButton>
            </Stack>
        </Stack>
    )
}