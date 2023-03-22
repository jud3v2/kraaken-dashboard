import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState } from 'react';
import {api} from '../api';
import { ClimbingBoxLoader  } from 'react-spinners';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Modal,
  Box,
  TextField,
  Select
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock

import { useNavigate } from 'react-router-dom';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {toast} from 'react-hot-toast'
import {LoadingButton} from '@mui/lab'
import { CreateProduct } from '../types/product'
import { Category } from '../types/category'
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nom', alignRight: false },
  { id: 'forename', label: 'Prénom', alignRight: false },
  { id: 'uuid', label: 'Identifiant', alignRight: false },
  { id: 'isDeleted', label: 'Actif', alignRight: false },
  { id: 'isDelivered', label: 'Livraison', alignRight: false },
  { id: 'price', label: 'Prix', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: any, orderBy: any) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array: any, comparator: any, query: any) {
  const stabilizedThis: any = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user: any) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el: any) => el[0]);
}

export default function CategoryPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);


  const [currentUUID, setCurrentUUID] = useState('');

  const [openCreateModal, setOpenCreateModal] = useState(false);
  
  const queryClient = useQueryClient();

  const [product, setProduct] = useState<CreateProduct>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category_uuid: '',
    big_description: '',
  })

  // API CALL --------------------------

  const queryKey = ['orders'];
  const {isLoading, data} = useQuery(queryKey, () => api.orderGetAll(), {
    staleTime: 60_000,
    cacheTime: 1000 * 60 * 2,
  })

  const {data: categories} = useQuery(["categories"], async () => await api.categoryAll(), {
    staleTime: 60_000,
    cacheTime: 1000 * 60 * 2,
  })

  const {isSuccess, error, mutate} = useMutation([[queryKey, currentUUID]], async () => {
    await api.deleteProduct(currentUUID)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey)
    },
    onError: () => {
      toast.error('Une erreur est survenue')
    }
  })

  const {isLoading: isLoadingCreate, 
    mutate: mutateCreate, reset} = useMutation(queryKey, async () => {
    
    const data = {
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category_uuid: product.category_uuid,
      big_description: product.big_description,
    }
    
    await api.createProduct(data)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey)
      setOpenCreateModal(false)
      reset()
      toast.success('Produit créé avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la création du produit')
    }
  })

  // ------------------------------

  const orders: any = data || []
  const categoriesData = categories || [];

  const handleOpenMenu = (event: any, uuid: string) => {
    setCurrentUUID(uuid)
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleChangePage = (event: any, newPage: number) => {
    event.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    event.preventDefault();
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event: any) => {
    event.preventDefault();
    setPage(0);
    setFilterName(event.target.value);
  };

  const toggleCreateModal = (event: any) => {
    event.preventDefault();
    setOpenCreateModal(!openCreateModal)
  }

  const moveToUpdatePage = async (event: any, uuid: string) => {
    event.preventDefault();
    navigate(`/dashboard/order/${uuid}`)
  }

  const handleDelete = async (event: any, uuid: string) => {
    event.preventDefault();
    mutate();
    if(isSuccess) {
      toast.success('Produit Actif/Inactif')
    }

    if(error) {
      toast.error('Erreur lors de la désactivation du produit')
    }
  }

  const handleChangeInput = (e: any) => {
    e.preventDefault();
    setProduct((product: CreateProduct) => ({...product, [e.target.name]: e.target.value}))
  }

  const handleCreateProduct = (e: any) => {
    e.preventDefault();
    if(product.name === ''){
      toast.error('Le nom du produit est obligatoire')
      return
    }
    
    if(product.description === ''){
      toast.error('La description du produit est obligatoire')
      return
    }
    
    if(product.price === 0){
      toast.error('Le prix du produit doit être supérieur à 0 par exemples 1.99')
      return
    }

    if(product.quantity === 0){
      toast.error('La quantité du produit doit être supérieur à 0')
      return
    }

    if(product.category_uuid === ''){
      toast.error('La catégorie du produit est obligatoire')
      return
    }

    if(product.big_description === ''){
      toast.error('La description longue du produit est obligatoire')
      return
    }

    mutateCreate();
  }


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders?.length) : 0;

  const filteredUsers = applySortFilter(orders, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const parseStatus = (status: string) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'paid': return 'Payé';
      case 'preparation': return 'Préparation';
      case 'delivered': return 'Livré';
      case 'canceled': return 'Annuler';
      default: return '';
    }
  }

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
            Gestion des commandes
          </Typography>
          <Button variant="contained" onClick={toggleCreateModal} startIcon={<Iconify icon="eva:plus-fill" />}>
            Ajouter une commande
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar sx={{}}>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orders.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  hasCheckbox={false}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
                    type rowProps = {
                      uuid: string,
                      name: never,
                      forename: never,
                      isDeleted: boolean,
                      isDelivered: number,
                      status: string,
                      price: number
                    }
                    const { uuid, name, isDeleted, isDelivered, forename, price, status }: rowProps = row;

                    return (
                      <TableRow hover key={uuid} tabIndex={-1} >
                        <TableCell padding="checkbox">
                        </TableCell>
                        <TableCell component="th" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        
                        <TableCell component="th" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {forename}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell component="th" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {uuid.substring(0, 8)}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          {isDeleted ? <Label color="error">Inactif</Label> : <Label color="success">Actif</Label>}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {isDelivered ? 'Livraison' : 'Retrait'}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell component="th" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {price}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell component="th" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {parseStatus(status)}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={e => {
                            handleOpenMenu(e, uuid)
                          }}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Non trouvé
                          </Typography>

                          <Typography variant="body2">
                            Aucun résultat trouvé pour &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Utiliser des mots complet.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>}

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={e => moveToUpdatePage(e, currentUUID)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Editer
        </MenuItem>

        <MenuItem onClick={e => handleDelete(e, currentUUID)} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Popover>
      {/* CREATE MODAL */}
      <Modal
        open={openCreateModal}
        onClose={toggleCreateModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           bgcolor: 'background.paper',
           boxShadow: 12,
           p: 4,
           borderRadius: 2,
           width: '80%',
        }}>
          <Stack spacing={2}>
            <Typography variant='h4'>Création d'un nouveau produit</Typography>
          </Stack>
          <Stack spacing={2} sx={{
            my: 2,
          }}>
            <Typography variant='h6'>Caractèristiques du produit</Typography>
          </Stack>
          <Stack spacing={2}  direction='row' justifyContent={'space-between'}>
            <TextField name='name' value={product.name} type='text' required onChange={handleChangeInput} label="Nom de l'option" />
            <TextField name='quantity' value={product.quantity} type='number' onChange={handleChangeInput} required label='Choisissez la quantité' />
            <TextField name='price' value={product.price} type='number' onChange={handleChangeInput} required label='Choisissez le prix' />
          </Stack>
          <Stack spacing={2} sx={{
            my: 2,
          }}>
            <Typography variant='h6'>Description du produit</Typography>
          </Stack>
          <Stack spacing={2}>
            <TextField name='description' value={product.description} multiline onChange={handleChangeInput} rows={2} required label="Petite description" />
            <TextField name='big_description' value={product.big_description} onChange={handleChangeInput} multiline rows={4} required label='Grande description' />
          </Stack>
          <Stack spacing={2} sx={{
            my: 2,
          }}>
            <Typography variant='h6'>Catégorie affilié</Typography>
          </Stack>
          <Stack>
            <Select
              label="Séléctionner une catégorie"
              name="category_uuid"
              value={product.category_uuid}
              onChange={handleChangeInput}
            >
              {categoriesData.map((category: Category) => {
                return  <MenuItem key={category.uuid} value={category.uuid}>{category.name}</MenuItem>
              })}
            </Select>
          </Stack>
          <Stack spacing={2} sx={{
            width: '100%',
            my: 2
          }}
          >
            <LoadingButton variant={'contained'} loading={isLoadingCreate} onClick={handleCreateProduct}>
              Créé l'option
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
      {/* CREATE MODAL */}
    </>
  );
}
