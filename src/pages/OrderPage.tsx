import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState } from 'react';
import {api} from '../api';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
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
  Select,
  Divider
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
import PageLoader from '../components/loader'
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

  const [newOrder, setNewOrder] = useState({
    name: '',
    forename: '',
    email: '',
    phoneNumber: '',
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

  const {mutate} = useMutation([[queryKey, currentUUID]], async () => {
    if(window.confirm('Voulez-vous vraiment supprimer cette commande ?')){
      await api.orderDelete(currentUUID)
      .then(() => {
        queryClient.invalidateQueries(queryKey)
        toast.success('Commande supprimée avec succès')
      })
      .catch(() => {
        toast.error('Une erreur est survenue / Supprimé les produits commandés avant de supprimer la commande')
      })
    }
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
  }

  const {isLoading: orderCreateLoading, mutate: mutateCreateOrder} = useMutation( async () => {
    const data = {
      name: newOrder.name,
      forename: newOrder.forename,
      email: newOrder.email,
      phoneNumber: newOrder.phoneNumber,
      price: 0
    }
    await api.orderCreate(data)
    .then(() => {
      queryClient.invalidateQueries(queryKey)
      toast.success('Commande créée avec succès')
    })
    .catch(() => {
      toast.error('Une erreur est survenue')
    })
  })

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
      case 'isDelivery': return 'En livraison';
      default: return '';
    }
  }

  const handleChange = (e: any) => {
    setNewOrder((newOrder: any) => ({...newOrder, [e.target.name]: e.target.value}))
  }

  return (
    <>
      <Helmet>
        <title> Commande | Lizaora </title>
      </Helmet>

      {isLoading ? <PageLoader /> : <Container>
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
            <Typography variant='h4'>Création d'une nouvelle commande</Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack>
            <TextField sx={{my: 1}} name='name' type='text' required onChange={handleChange} label='Nom du client' value={newOrder.name} />
            <TextField sx={{my: 1}} name='forename' type='text' required onChange={handleChange} label='Prénom du client' value={newOrder.forename} />
            <TextField sx={{my: 1}} name='email' type='text' required onChange={handleChange} label='Email du client' value={newOrder.email} />
            <TextField sx={{my: 1}} name='phoneNumber' type='text' required onChange={handleChange} label='Numéro de téléphone du client' value={newOrder.phoneNumber} />
          </Stack>
          <Stack>
            <LoadingButton loading={orderCreateLoading} variant='contained' onClick={() => mutateCreateOrder()}>
              Créer la commande
            </LoadingButton>
          </Stack>
        </Box>
      </Modal>
      {/* CREATE MODAL */}
    </>
  );
}
