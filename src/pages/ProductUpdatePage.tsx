import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import {api} from '../api'
// @mui
import {
  Card,
  Container,
  Typography,
  Stack,
  TextField,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
// components
import { LoadingButton} from '@mui/lab';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import { ClimbingBoxLoader  } from 'react-spinners';
import { toast } from 'react-hot-toast';
import Iconify from '../components/iconify';
// ----------------------------------------------------------------------

export default function CategoryPage() {
  const [product, setProduct] = useState({
    name: '',
    quantity: '',
    price: '',
    description: '',
    big_description: '',
    category_uuid: ''
  });
  const [categoriesList, setCategoriesList] = useState([])



  // API CALL --------------------------
  const { uuid } = useParams();
  const queryKey = ['products', uuid];
  const queryClient = useQueryClient();

  const {isLoading, data: productData} = useQuery(queryKey, async () => await api.getOneProduct(uuid), {
    staleTime: Infinity,
    cacheTime: 0,
    windowFocusRefresh: false
  })
  
  const {data: categoriesData} = useQuery('categories', async () => await api.categoryAll(), {
    staleTime: 0,
    cacheTime: 0,
    windowFocusRefresh: false
  })
  
  const {isLoading: updateProductLoading, isSuccess, error, reset, mutate} = useMutation(async (e) => {
    e.preventDefault()
    const data = {
      uuid: uuid,
      name: product.name,
      quantity: parseInt(product.quantity),
      price: parseFloat(product.price),
      description: product.description,
      big_description: product.big_description,
      category_uuid: product.category_uuid
    }

    await api.updateProduct(data)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries("products")
    }
  })

  if(error) {
    toast.error('Une erreur est survenue')
  }

  if(isSuccess) {
    toast.success('Le produit a bien été modifié')
    reset()
  }
  
  // ------------------------------
  useEffect(() => {
    if(productData) {
      setProduct(productData)
    }

    if(categoriesData){
      setCategoriesList(categoriesData)
    }
  }, [productData, categoriesData])

  const handleChange = event => {
    setProduct(prevState => ({...prevState, [event.target.name]: event.target.value}))
  }

  return (
    <>
      <Helmet>
        <title> Produits | Lizaora </title>
      </Helmet>

      {isLoading 
      ? <Stack sx={{width: '100%'}} justifyContent='center' justifyItems='center'>
        <ClimbingBoxLoader  cssOverride={{
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          width: '100%',
          marginTop: '20%',
      }} />
      </Stack> 
      : <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Modification du produit: {productData.name}
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Ajouter une option
          </Button>
        </Stack>

        <Card>
          <Stack sx={{m: 2}}>
            <Typography variant="h6" gutterBottom>
              Caractèristiques du produit
            </Typography>
          </Stack>
          <Stack direction={"row"} sx={{m: 2}} justifyContent={"space-between"} spacing={3}>
            <TextField name="name" label="Changer le nom" value={product.name} onChange={handleChange} />
            <TextField name="quantity" label="Changer la quantité" value={product.quantity} onChange={handleChange}/>
            <TextField name="price" label="Changer le prix" onChange={handleChange} value={product.price}/>
          </Stack>
          <Stack sx={{m: 2}}>
            <Typography variant="h6" gutterBottom>
              Description du produit
            </Typography>
          </Stack>
          <Stack sx={{m: 2}}>
            <TextField sx={{my:2}} name="description" onChange={handleChange} value={product.description} label="Changer la petite description" multiline rows={4} />
            <TextField name="big_description" onChange={handleChange} value={product.big_description} label="Changer la grosse description" multiline rows={4} />
          </Stack>
          <Stack sx={{m: 2}}>
            <Typography variant="h6" gutterBottom>
              Sélection de la catégorie du produit
            </Typography>
          </Stack>
          <Stack sx={{m: 2}}>
            <Select
              label="Séléctionner une catégorie"
              sx={{width: '100%'}}
              value={product.category_uuid}
              onChange={handleChange}
              name="category_uuid"
            >
              {categoriesList.map((category) => {
                return  <MenuItem key={category.uuid} value={category.uuid}>{category.name}</MenuItem>
              })}
            </Select>
          </Stack>
          <Stack sx={{m: 2}}>
            <LoadingButton loading={updateProductLoading} variant='contained' onClick={mutate}>
              Mettre à jour le produit {product.name}
            </LoadingButton>
          </Stack>
        </Card>
        <Card sx={{my: 2}}>
          <Stack sx={{m: 2}}>
            <Typography gutterBottom variant='h6'>
                Gestion des images
            </Typography>
          </Stack>
        </Card>
        <Card>
          <Stack sx={{m: 2}}>
            <Typography gutterBottom variant='h6'>
                Gestion des options
            </Typography>
          </Stack>
        </Card>
      </Container>}
    </>
  );
}
