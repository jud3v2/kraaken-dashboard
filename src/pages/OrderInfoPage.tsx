import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {api} from '../api';
import { ClimbingBoxLoader  } from 'react-spinners';

// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Tab,
  Box
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

export default function CategoryPage() {
  const queryClient = useQueryClient();
  const { uuid } = useParams();

  // API CALL --------------------------

  const queryKey = ['orders', uuid];

  const {isLoading, data} = useQuery(queryKey, () => api.orderGetOne(uuid), {
    staleTime: 60_000,
    cacheTime: 1000 * 60 * 2,
  })

  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title> Commande | Lizaora </title>
      </Helmet>

      {isLoading ? <Stack sx={{width: '100%'}} justifyContent='center' justifyItems='center'>
        <ClimbingBoxLoader  cssOverride={{
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          width: '100%',
          marginTop: '20%',
      }} />
      </Stack> : <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Gestion de la commande
          </Typography>
          <Button variant="contained" onClick={() => console.log('')} startIcon={<Iconify icon="eva:plus-fill" />}>
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
                      <Tab label="Modifier la livraison" value="3" />
                      <Tab label="Modifier le statut" value="4" />
                      <Tab label="Modifier les produits" value="5" />
                      <Tab label="Autres" value="6" />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <Recap data={data} />
                  </TabPanel>
                  <TabPanel value="2">
                    <UpdateOrder />
                  </TabPanel>
                  <TabPanel value="3">
                    <UpdateShipping />
                  </TabPanel>
                  <TabPanel value="4">
                    <UpdateStatus />
                  </TabPanel>
                  <TabPanel value="5">
                    <UpdateProduct />
                  </TabPanel>
                  <TabPanel value="6">
                    <Other />
                  </TabPanel>
                </TabContext>
            </Box>
         </Card>
         </Container>
         }
    </>
  );
}
