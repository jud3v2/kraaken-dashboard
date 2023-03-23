import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {api} from '../api';
import PageLoader from '../components/loader'
// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Tab,
  Box,
  Modal,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// components
import Iconify from '../components/iconify';
import Other from '../components/order/Other';
import Recap from '../components/order/Recap';
import UpdateShipping from '../components/order/UpdateShipping';
import UpdateOrder from '../components/order/UpdateOrder';
import UpdateProduct from '../components/order/UpdateProduct';
import UpdateStatus from '../components/order/UpdateStatus';

import { useParams } from 'react-router-dom';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {toast} from 'react-hot-toast'
import {LoadingButton} from '@mui/lab'



export default function OrderInfoPage() {
  const queryClient = useQueryClient();
  const { uuid } = useParams();

  // API CALL --------------------------

  const queryKey = ['orders', uuid];

  const {isLoading, data} = useQuery(queryKey, () => api.orderGetOne(uuid))
  const {data: products} = useQuery(['products'], async () => await api.getProducts())
  
  const {isLoading: isLoadingPush, mutate: pushProduct} = useMutation(async () => {
      const productData = [];
      for (let i = 0; i < values.length; i++) {
        const data = {
          uuid: values[i],
          quantity: 1,
          price: getPriceOfProduct(values[i]),
        }
        productData.push(data)
      }

      if(productData.length > 0) {
        await api.orderPushProduct({products: productData}, uuid)
        .then(() => {
          toast.success('produit(s) ajouté avec succès')
          toggleModal()
          queryClient.invalidateQueries(queryKey)
        })
        .catch((err) => {
          console.log(err)
          err.response.data?.map((item: any) => {
            toast.error(item.message)
            return item
          })
        })
      }
  })

  const [value, setValue] = useState('1');
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState([])

  /* PURE FUNCTION */
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  /* PURE FUNCTION */
  const toggleModal = () => {
    setOpen(!open)
  }

  /* PURE FUNCTION */
  const handleAddInput = () => {
    const data: any = [...values];
    data.push('');
    setValues(data);
  }

  /* PURE FUNCTION */
  const handleValuesChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const data: any = [...values];
    data[index] = event.target.value;
    setValues(data);
  };

  /* PURE FUNCTION */
  const deleteInput = (index: number) => {
    const data: any = [...values];
    data.splice(index, 1);
    setValues(data);
  }

  /* PURE FUNCTION */
  const getPriceOfProduct = (uuid: string) => {
    const data = filterArray(products)
    const price = data.filter((item: any) => item.uuid === uuid)
    return price[0]?.price
  }

  /* PURE FUNCTION */
  const filterArray = (products: any) => {
    const data: any = [];

    if(products) {
      for (let i = 0; i < products?.length; i++) {
        data.push({name: products[i]?.name, uuid: products[i]?.uuid, price: products[i]?.price})

        for (let j = 0; j < products[i].productOption?.length; j++) {
          data.push({name: products[i]?.productOption[j]?.name, uuid: products[i]?.productOption[j]?.uuid , price: products[i]?.productOption[j]?.price})
        }
      }
    }

    return data
  }

  return (
    <>
      <Helmet>
        <title> Commande | Lizaora </title>
      </Helmet>

      {isLoading ? <PageLoader /> : <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Gestion de la commande
          </Typography>
          <Button variant="contained" onClick={toggleModal} startIcon={<Iconify icon="eva:plus-fill" />}>
            Ajouter un produit à la commande
          </Button>
        </Stack>

        <Card>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                      <Tab label="Récapitulatif" value="1" />
                      <Tab label="Modifier la commande" value="2" />
                      <Tab label="Modifier le statut" value="3" />
                      <Tab label="Modifier les produits" value="4" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <Recap data={data} />
                  </TabPanel>
                  <TabPanel value="2">
                    <UpdateOrder data={data}/>
                  </TabPanel>
                  <TabPanel value="3">
                    <UpdateStatus data={data} />
                  </TabPanel>
                  <TabPanel value="4">
                    <UpdateProduct data={data} />
                  </TabPanel>
                  <TabPanel value="5">
                    <Other data={data}/>
                  </TabPanel>
                  <TabPanel value="6">
                    <UpdateShipping data={data}/>
                  </TabPanel>
                </TabContext>
            </Box>
         </Card>
         </Container>
         }
         <Modal open={open} onClose={toggleModal} >
            <Card sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              height: '80vh',
              overflow: 'auto',
            }}>
              <Stack sx={{
                m: 2,
                p: 2
              }}> 
                <Typography variant="h4" gutterBottom>
                  Ajouter des produits à la commande
                </Typography>
                <Stack sx={{
                  m: 2,
                }}>
                  <Button variant='contained' onClick={handleAddInput}>
                    Ajouter un nouveau produit
                  </Button>
                  {values?.map((value: any, index: number) => (
                    <Stack key={index} sx={{
                      m:1,
                      p:1,
                      display: 'flex',
                      flexDirection: 'row',
                    }}>
                       <Select fullWidth onChange={(e: any) => handleValuesChange(e, index)}>
                          {filterArray(products)?.map((product: any) => (
                            <MenuItem key={product.uuid} value={product.uuid}>
                              {product.name} | {product.price} €
                            </MenuItem>
                          ))}
                       </Select>
                       <Button variant='contained' color='error' onClick={() => deleteInput(index)}>
                          <Iconify icon='material-symbols:delete-rounded' />
                       </Button>
                    </Stack>
                  ))}
                </Stack>
                <Stack sx={{
                  m: 2
                }}>
                    <LoadingButton loading={isLoadingPush} onClick={() => pushProduct()} variant='contained' fullWidth>
                      Ajouter les produits
                    </LoadingButton>
                </Stack>
              </Stack>
            </Card>
         </Modal>
    </>
  );
}
