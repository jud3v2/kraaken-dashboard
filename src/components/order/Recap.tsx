import React from 'react';
import { Box, Stack, Typography, Divider, Grid, Card } from '@mui/material'
import Label from '../../components/label';
import dayjs from 'dayjs';
import ProductRecap from '../../components/product/ProductRecap'

export default function Recap({ data }: { data: any }) {

    const style = {
        p: 3,
        m: 1
    }

    return (
        <Box>
            <Stack>
                <Card sx={style}>
                    <Typography variant='h4'>
                        Récapitulatif - {dayjs(data.order.createdAt).format('DD/MM/YYYY')}{' '}
                        - {data.order.productOrder?.length} {data.order.productOrder?.length > 1 ? 'produits' : 'produit'}
                        <Divider sx={{my: 2 }}/>
                        <Stack sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Typography variant='subtitle1'>
                                {data.order.isDelivered ? <Label color='success'>Commande En livraison</Label> : <Label color='warning'>Commande en retrait</Label>}
                            </Typography>
                            <Typography variant='subtitle1' sx={{mx: 1}}>
                                {data.order.status === 'new' ? <Label color='primary'>En attente</Label> : <></>}
                                {data.order.status === 'isDelivery' ? <Label color='primary'>En cours de livraison</Label> : <></>}
                                {data.order.status === 'paid' ? <Label color='warning'>Commande à été payer</Label> : <></>}
                                {data.order.status === 'canceled' ? <Label color='error'>Commande annuler</Label> : <></>}
                                {data.order.status === 'preparation' ? <Label color='success'>Commande en préparation</Label> : <></>}
                                {data.order.status === 'delivered' ? <Label color='success'>Commande livré</Label> : <></>}
                            </Typography>
                            <Typography variant='subtitle1'>
                                {data.order.isDeleted ? <Label color='error'>Inactif</Label> : <Label color="success">Actif</Label>}
                            </Typography>
                        </Stack>
                    </Typography>
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
                                    Adresse: {' '} {data.order.deliveryAddress ? data.order.deliveryAddress : 'N/C'}
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
                                    Numéro de suivi: {' '} {data.order.deliveryToken ? <Label color='primary'>
                                        {data.order.deliveryToken}
                                    </Label> : 'N/C'}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Commentaire de livraison: {' '} {data.order.deliveryComment ? data.order.deliveryComment : 'N/C'}
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Prix de livraison: {' '} {data.order.deliveryPrice || data.order.deliveryPrice === 0 ? data.order.deliveryPrice : 'N/C'}{' '}€
                                </Typography>
                                <Typography variant='subtitle1'>
                                    Date de livraison: {' '} {data.order.deliveryDate ? <Label color='success'>
                                        {dayjs(data.order.deliveryDate).format("ddd, MMM D, YYYY")}
                                    </Label> : 'N/C'}
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
                    {' '} commandé(s)
                </Typography>
            </Stack>
            <Stack sx={{ my: 2 }}>
                {data.order.productOrder?.map((data: any, index: number) => <ProductRecap key={index} quantity={data.quantity} uuid={data.product_uuid || data.option_uuid} />)}
            </Stack>
        </Box>
    )
} 