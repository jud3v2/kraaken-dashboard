import React from 'react'
import { Stack, Grid, Typography } from '@mui/material'
import ProductCard from '../product/ProductCard'

export default function UpdateProduct(props: any) {
  return (
    <>
      <Stack>
        <Typography variant="h5" gutterBottom>
          Modifcation Des Produits Commandés
        </Typography>
      </Stack>
      <Stack>
        <Typography variant="h6" gutterBottom>
          Produits Commandés
        </Typography>
      </Stack>
      <Grid container mb={5}>
        {props.data.product_ordered.products.map((product: any, index: number) => <Grid xs={4} key={index}>
          <ProductCard data={props.data} key={index} product={product} />
        </Grid>)}
      </Grid>
      <Stack>
        <Typography variant="h6" gutterBottom>
          Options Commandés
        </Typography>
      </Stack>
      <Grid container mb={5}>
        {props.data.product_ordered.options.map((product: any, index: number) => <Grid xs={4} key={index}>
          <ProductCard data={props.data} key={index} product={product} />
        </Grid>)}
      </Grid>
    </>
  )
}
