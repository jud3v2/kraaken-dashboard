import React from 'react'
import {useQuery} from "react-query";
import {api} from '../../api'
import {Box, CardMedia, Typography, Card} from '@mui/material'

export default function ProductRecap(props: React.PropsWithChildren<any>) {

    const uuid = props.uuid || '';
    const {data, isLoading, error} = useQuery(['product', uuid], () => api.getOneProduct(uuid), {
        cacheTime: 0,
        staleTime: 0,
    })

    const productImage: any = []

    data?.productImage?.map((image: any) => {
        if((image.option_uuid || image.product_uuid) === data.uuid){
            productImage.push(image)
        }
        return image
    })

    if(isLoading) return <Typography>Loading...</Typography>
    if(error) return <Typography>Une erreur c'est produite</Typography>

    return (
        <>
            <Card sx={{p: 2, m: 2}}>
                <Typography variant='h6'>{data.name}</Typography>
                <Typography variant='subtitle1' color='gray'>Quantité: {props.quantity}</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p:2
                }}>
                    {productImage.map((image: any, index: number) => {
                        return <Box key={index} sx={{mx: 1, width: '140px', height: '140px'}}>
                            <CardMedia sx={{maxWidth: '100%', maxHeight: '100%', borderRadius: 2}} component='img' src={api.imageGet(image.path)}/>
                        </Box>
                    })}
                </Box>
            </Card>
        </>
    )
}