import React from 'react';
import { Order } from '../../types/order'
import { Box, Stack, Typography, Divider, Grid, Card } from '@mui/material'
import { ProductOrder } from '../../types/productOrdered.js';
import Label from '../../components/label';
import dayjs from 'dayjs';

export default function Recap({ data }: { data: any }) {
    console.log(data)
    const style = {
        p: 3,
        m: 1
    }
    return (
        <Box>
            <Stack>
                <Card sx={style}>
                    <Typography variant='h4'>
                        Récapitulatif {data.order.uuid.substring(0, 8)} - {dayjs(data.order.createdAt).format('DD/MM/YYYY')}
                        - {data.order.productOrder?.length} {data.order.productOrder?.length > 1 ? 'produits' : 'produit'}
                    </Typography>
                    <Divider sx={{my: 2}} />
                    <Stack sx={{ my: 2 }}>
                        <Typography variant='h6'>
                            Aperçu rapide de la commande
                        </Typography>
                    </Stack>
                    <Card sx={style}>
                        <Stack sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}>
                            <Typography variant='subtitle1'>
                                {data.order.isDelivered ? <Label color='success'>Commande En livraison</Label> : <Label color='warning'>Commande en retrait</Label>}
                            </Typography>
                            <Typography variant='subtitle1' sx={{ mt: 1 }}>
                                {data.order.status === 'new' ? <Label color='primary'>Nouvelle commande</Label> : <></>}
                                {data.order.status === 'paid' ? <Label color='warning'>Commande payer</Label> : <></>}
                                {data.order.status === 'canceled' ? <Label color='error'>Commande annuler</Label> : <></>}
                                {data.order.status === 'preparation' ? <Label color='success'>Commande en préparation</Label> : <></>}
                                {data.order.status === 'delivered' ? <Label color='success'>Commande livré</Label> : <></>}
                            </Typography>
                            <Typography variant='subtitle1' sx={{ mt: 1 }}>
                                {data.order.isDeleted ? <Label color='error'>Inactif</Label> : <Label color="success">Actif</Label>}
                            </Typography>
                        </Stack>
                    </Card>
                </Card>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card sx={style}>
                        <div>
                            <Stack sx={{ mt: 1 }}>
                                <Typography variant='h6'>
                                    Identité du client
                                </Typography>
                            </Stack>
                            <Divider sx={{my: 2}}/>
                            <Stack sx={{ mt: 2 }}>
                                <Typography variant='subtitle1'>
                                    Nom: 
                                    <strong>
                                        {' '} {data.order.name}
                                    </strong>
                                </Typography>

                                <Typography variant='subtitle1'>
                                    Prénom: 
                                    <strong>
                                        {' '} {data.order.forename}
                                    </strong>
                                </Typography>
                            </Stack>
                        </div>
                    </Card>

                    <Card sx={style}>
                        <div>
                            <Stack sx={{ mt: 3 }}>
                                <Typography variant='h6'>
                                    Information de contact
                                </Typography>
                            </Stack>
                            <Divider sx={{my: 2}}/>
                            <Stack sx={{ mt: 2 }}>
                                <Typography variant='subtitle1'>
                                    Email: 
                                    <strong>
                                        {' '} {data.order.email}
                                    </strong>
                                </Typography>
                            </Stack>
                            <Stack sx={{ mt: 2 }}>
                                <Typography variant='subtitle1'>
                                    Tél: 
                                    <strong>
                                        {' '} {data.order.phoneNumber}
                                    </strong>
                                </Typography>
                            </Stack>
                        </div>
                    </Card>
                    <Card sx={style}>
                        <div>
                            <Stack sx={{ mt: 3 }}>
                                <Typography variant='h6'>
                                    Information de l'adresse de livraison
                                </Typography>
                            </Stack>
                            <Divider sx={{my: 2}}/>
                            <Stack sx={{ mt: 2 }}>
                                <Typography variant='subtitle1'>
                                    Adresse: {' '} {data.order.deliveryAdress ? data.order.deliveryAdress : 'N/C'}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Ville: {' '} {data.order.deliveryCity ? data.order.deliveryCity : 'N/C'}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Code Postale: {' '} {data.order.deliveryZipCode ? data.order.deliveryZipCode : 'N/C'}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Pays: {' '} {data.order.deliveryCountry ? data.order.deliveryCountry : 'N/C'}
                                </Typography>
                            </Stack>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={6}>


                    <Stack sx={{ mt: 2 }}>
                        <Card sx={style}>
                            <div>
                                <Stack>
                                    <Typography variant='h5'>
                                        Information de la commande
                                    </Typography>
                                </Stack>
                            <Divider sx={{my: 2}}/>
                                <Typography variant='subtitle1'>
                                    Identifiant: {' '}
                                    <Label color='primary'>
                                        {data.order.uuid.substring(0, 8)}
                                    </Label>
                                </Typography>

                                <Typography variant='subtitle1'>
                                    Date de création: {' '} {dayjs(data.order.createdAt).format('ddd, MMM D, YYYY h:mm A')}
                                </Typography>
                            </div>
                        </Card>
                    </Stack>

                    <Card sx={style}>
                        <div>

                            <Stack sx={{ mt: 3 }}>
                                <Typography variant='h6'>
                                    Information de livraison
                                </Typography>
                            </Stack>
                            <Divider sx={{my: 2}}/>
                            <Stack sx={{ mt: 1 }}>
                                <Typography variant='subtitle1'>
                                    Numéro de suivi: {' '} {data.order.deliveryToken ? data.order.deliveryToken : 'N/C'}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Commentaire de livraison: {' '} {data.order.deliveryComment ? data.order.deliveryComment : 'N/C'}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Prix de livraison: {' '} {data.order.deliveryPrice ? data.order.deliveryPrice : 'N/C'}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Date de livraison: {' '} {data.order.deliveryDate ? data.order.deliveryDate : 'N/C'}
                                </Typography>
                            </Stack>
                        </div>
                    </Card>

                    <Card sx={style}>
                        <div>
                            <Stack sx={{ mt: 3 }}>
                                <Typography variant='h6'>
                                    Information de paiement
                                </Typography>
                            </Stack>
                            <Divider sx={{my: 2}}/>
                            <Stack sx={{ mt: 2 }}>
                                <Typography variant='subtitle1'>
                                    Prix:{' '}
                                    <Label color='success'>
                                        {data.order.price} €
                                    </Label>
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Date de paiement: {' '} {data.order.paymentDate ? data.order.paymentDate : 'N/C'}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Méthode de paiement: {' '} {data.order.paymentMethod ? data.order.paymentMethod : 'N/C'}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Identifiant de transaction: {' '} {data.order.paymentToken ? data.order.paymentToken : 'N/C'}
                                </Typography>
                            </Stack>
                        </div>
                    </Card>
                </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            {/* TODO : Make a component that recap all product ordered and if option ordered show them */}
            <Stack>
                <Typography variant='h4'>
                    Récapitulatif de
                    {' '} {data.order.productOrder?.length} {data.order.productOrder?.length > 1 ? 'produits' : 'produit'}
                </Typography>
            </Stack>
            <Stack sx={{ my: 2 }}>
                <Typography variant='subtitle1'>
                    Product
                </Typography>
                {data.product_ordered.products?.map((product: any, index: number) => (
                    console.log(product)
                ))}
            </Stack>
        </Box>
    )
} 