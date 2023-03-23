import React from 'react';
import { Stack, Card, Typography, CardMedia, Box, Divider } from '@mui/material'
import { api } from '../../api'
import { Image } from '../../types/image';
import LoadingButton from '@mui/lab/LoadingButton';
import Iconify from '../../components/iconify';
import { ProductOrder } from '../../types/productOrdered';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product, data }: { product: any, data: any }) {

    const [productOrder, setProductOrder] = React.useState<ProductOrder>()
    
    /* PURE FUNCTION */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getProductOrdered = (productOrder: ProductOrder[]) => {
        const productOrdered = [];

        for (let i = 0; i < productOrder.length; i++) {
            if ((productOrder[i]?.option_uuid || productOrder[i].product_uuid) === product.uuid) {
                productOrdered.push(productOrder[i]);
            }
        }

        return productOrdered[0];
    }

    const staticQuantity = getProductOrdered(data.order.productOrder).quantity
    
    React.useEffect(() => {
        setProductOrder(getProductOrdered(data.order.productOrder))
    }, [data.order.productOrder, getProductOrdered, staticQuantity])

    const productImage: Image[] = [];

    const queryClient = useQueryClient();

    product?.productImage?.map((image: Image) => {
        if ((image.option_uuid || image.product_uuid) === product.uuid) {
            productImage.push(image)
        }
        return image
    })


    /* PURE FUNCTION */
    const getFirstImage = (images: Image[]) => {
        const firstImage = [];

        for (let i = 0; i < images.length; i++) {
            if (images[i].isFirst) {
                firstImage.push(images[i]);
            }
        }

        if (firstImage.length === 0) {
            return images[0]
        }

        return firstImage[0];
    }



    const {
        isLoading: isLoadingDelete,
        mutate: deleteProductOrder,
    } = useMutation(async () => {
        await api.orderDeleteProduct(productOrder?.order_uuid, productOrder?.option_uuid || productOrder?.product_uuid)
            .then(() => {
                toast.success('Produit supprimé de la commande')
                queryClient.invalidateQueries(['orders', data.uuid])
                queryClient.invalidateQueries(['orders'])
            })
            .catch(() => {
                toast.error("Erreur lors de la suppression du produit la commande est peut-être déjà payé")
            })
    }, {})

    const {
        isLoading: isLoadingMinus,
        mutate: minusProductOrder,
    } = useMutation(async () => {
        const newQuantity = getProductOrdered(data.order.productOrder).quantity - 1;

        await api.orderUpdateProductQuantity({ quantity: newQuantity }, productOrder?.order_uuid, productOrder?.option_uuid || productOrder?.product_uuid)
            .then(() => {
                toast.success('Produit mis à jour')
                queryClient.invalidateQueries(['orders'])
            })
            .catch((error) => {
                toast.error(error.response.data.message)
            })
    }, {})

    const {
        isLoading: isLoadingPlus,
        mutate: plusProductOrder,
    } = useMutation(async () => {
        const newQuantity = getProductOrdered(data.order.productOrder).quantity + 1;

        await api.orderUpdateProductQuantity({ quantity: newQuantity }, productOrder?.order_uuid, productOrder?.option_uuid || productOrder?.product_uuid)
            .then(() => {
                toast.success('Produit mis à jour')
                queryClient.invalidateQueries(['orders'])
            })
            .catch((error) => {
                toast.error(error.response.data.message)
            })
    }, {})

    return (
        <>
            <Card sx={{ p: 2, m: 2, display: 'block' }}>
                <Stack>
                    <Box sx={{ width: '200px', height: '170px', top: '50%', left: '50%', transform: 'translateX(-50%, -50%)', margin: 'auto' }}>
                        <CardMedia sx={{ borderRadius: 2, maxHeight: '100%', maxWidth: '100%' }} component='img' src={api.imageGet(getFirstImage(productImage)?.path)} />
                    </Box>
                    <Box>
                        <Typography variant='h6'>{product.name}</Typography>
                        <Typography variant='inherit' color='gray'>Quantité: {productOrder?.quantity}</Typography>
                    </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack sx={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <LoadingButton loading={isLoadingMinus} onClick={() => minusProductOrder()} variant='contained' sx={{ m: 1 }} color='primary'>
                        <Iconify icon='ic:round-minus' />
                    </LoadingButton>
                    <LoadingButton loading={isLoadingDelete} onClick={() => deleteProductOrder()} variant='contained' sx={{ m: 1 }} color='error'>
                        <Iconify icon='mdi:delete' />
                    </LoadingButton>
                    <LoadingButton loading={isLoadingPlus} onClick={() => plusProductOrder()} variant='contained' sx={{ m: 1 }} color='primary'>
                        <Iconify icon='ic:round-plus' />
                    </LoadingButton>
                </Stack>
            </Card>

        </>
    )
}