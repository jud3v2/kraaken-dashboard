import { filter } from 'lodash';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Button,
  CircularProgress,
  Modal,
  Box,
  TextField,
  Select,
} from '@mui/material';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import {useMutation, useQueryClient} from 'react-query';
import {api} from '../../api';
import {toast} from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import {Category} from '../../types/category';
import {Option} from '../../types/option';
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
    const stabilizedThis = array.map((el: any, index: number) => [el, index]);
    stabilizedThis.sort((a: any, b: any) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_option) => _option.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el: any) => el[0]);
  }
  

type Props = {
    data: Array<{
        name: string,
        uuid: string,
        descrition: string,
        big_description: string,
        isDeleted: boolean,
        isFirst: boolean,
        price: number,
        quantity: number,
        createdAt: string,
        updatedAt: string,
        category_uuid: string,
        product_uuid: string,
    }>;
    productUUID: string;
    categoryUUID: string;
    categories: Category[];
}

const TABLE_HEAD = [
    { id: 'name', label: 'Nom', alignRight: false },
    { id: 'uuid', label: 'Identifiant', alignRight: false },
    { id: 'description', label: 'Description', alignRight: false },
    { id: 'price', label: 'Quantité', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' },
  ];
  

export function ProductOption(props: Props) {
    const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const queryClient = useQueryClient();

  const [currentUUID, setCurrentUUID] = useState<string>('');

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  
  const [option, setOption] = useState({
    name: '',
    description: '',
    big_description: '',
    price: 0,
    quantity: 0,
    category: props.categoryUUID,
    product: props.productUUID,
  })

  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  
  const handleOpenMenu = (event: any, uuid: string) => {
    setOpen(event.currentTarget);
    setCurrentUUID(uuid);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const newSelecteds: any = props.data.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event: any) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;

  const filteredUsers = applySortFilter(props.data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  // DELETE SECTION

    const {isLoading, mutate, reset} = useMutation(["products", props.productUUID], async () => {
        await api.optionDelete(currentUUID)
        .then(() => {
            toast.success('Option marqué comme inactive');
        })
        .catch((err) => {
            toast.error(err.toString());
        })
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(["products", props.productUUID]);
            reset();
        }
    }) 

  // DELETE SECTION

  // UPDATE SECTION
  const toggleUpdateModal = () => {
    setOpenUpdateModal(!openUpdateModal)
  }

  const handleUpdate = () => {
    updateMutate();
  }

  const {isLoading: updateIsLoading, mutate: updateMutate, reset: updateReset} = useMutation(["products", props.productUUID], async () => {

    if (option.name === '') {
      toast.error('Le nom de l\'option est requis');
      return
    }
    if (option.description === '') {
      toast.error('La description de l\'option est requise');
      return;
    }
    if (option.big_description === '') {
      toast.error('La description longue de l\'option est requise');
      return;
    }
    if (option.price === 0) {
      toast.error('Le prix de l\'option doit être supérieur à 0 par exemple 1.99');
      return;
    }
    if (option.quantity === 0) {
      toast.error('La quantité de l\'option doit être supérieur à 0 par exemple 10');
      return;
    }
    
    await api.optionUpdate(option, currentUUID)
    .then(() => {
        toast.success('Option modifié');
        toggleUpdateModal();
        setOption({
          name: '',
          description: '',
          big_description: '',
          price: 0,
          quantity: 0,
          category: props.categoryUUID,
          product: props.productUUID,
        })
    })
    .catch((err) => {
        toast.error(err.toString());
    })
  }, {
    onSuccess: () => {
      updateReset();
      queryClient.invalidateQueries(["products", props.productUUID]);
    }
  })

  const handleUpdateClick = () => {
    props.data.map((option: any) => {
      console.log(option)
      if (option.uuid === currentUUID) {
        setOption({...option, category_uuid: props.categoryUUID});
        toggleUpdateModal();
      }

      return option;
    })
  }
  // UPDATE SECTION

  // CREATE SECTION
    const toggleCreateModal = () => {
        setOption({
          name: '',
          description: '',
          big_description: '',
          price: 0,
          quantity: 0,
          category: props.categoryUUID,
          product: props.productUUID,
        })
        setOpenCreateModal(!openCreateModal)
    }
    
    const cannotChangeOption = () => {
        toast.error('Vous ne pouvez pas utilisé d\'autres catégorie que celle définis par le produit');
    }

    const handleChange = (e: any) => {
        setOption((prevState: any) => ({...prevState, [e.target.name]: e.target.value}))
    }

    const handleCreate = () => {
        if (option.category !== props.categoryUUID) {
            cannotChangeOption();
        } else {
            createMutate();
        }
    }

    const {isLoading: createIsLoading, mutate: createMutate, reset: createReset} = useMutation(["products", props.productUUID], async () => {

      if (option.name === '') {
        toast.error('Le nom de l\'option est requis');
        return
      }
      if (option.description === '') {
        toast.error('La description de l\'option est requise');
        return;
      }
      if (option.big_description === '') {
        toast.error('La description longue de l\'option est requise');
        return;
      }
      if (option.price === 0) {
        toast.error('Le prix de l\'option doit être supérieur à 0 par exemple 1.99');
        return;
      }
      if (option.quantity === 0) {
        toast.error('La quantité de l\'option doit être supérieur à 0 par exemple 10');
        return;
      }
      
      await api.optionCreate(option)
      .then(() => {
          toast.success('Option créé');
          toggleCreateModal();
          setOption({
            name: '',
            description: '',
            big_description: '',
            price: 0,
            quantity: 0,
            category: props.categoryUUID,
            product: props.productUUID,
          })
      })
      .catch((err) => {
          toast.error(err.toString());
      })
    }, {
      onSuccess: () => {
        createReset();
        queryClient.invalidateQueries(["products", props.productUUID]);
      }
    })
  // CREATE SECTION
    

    return (<>
        <Card  sx={{width: '100%'}}>
          <Stack sx={{m: 2}} direction={'row'} justifyContent='space-between'>
            <Typography gutterBottom variant='h6'>
                Gestion des options
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={toggleCreateModal}>
                Ajouter une option
            </Button>
          </Stack>
          <UserListToolbar numSelected={0} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar sx={{}}>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={props.data.length}
                  numSelected={0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  hasCheckbox={false}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
                    
                    const name: any = row.name;
                    const uuid: string = row.uuid;
                    const isDeleted: boolean = row.isDeleted;
                    const description: string = row.description;
                    const quantity: number = row.quantity;


                    return (
                      <TableRow key={uuid} tabIndex={-1} role="checkbox">
                        <TableCell padding="checkbox">
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{uuid.substring(0, 8)}</TableCell>

                        <TableCell align="left">{description.substring(0, 20)}</TableCell>

                        <TableCell align="left">{quantity}</TableCell>

                        <TableCell align="left">
                          <Label color={(isDeleted === true && 'error') || 'success'}>{isDeleted ? 'Inactif' : 'Actif'}</Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e: any) => handleOpenMenu(e, uuid)}>
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
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
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
            count={props.data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
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
      <MenuItem onClick={handleUpdateClick}>
        <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }}  />
        Modifier
      </MenuItem>

      <MenuItem >
        <Iconify icon={'eva:image-outline'} sx={{ mr: 2 }} />
        Images
      </MenuItem>

      <MenuItem sx={{ color: 'error.main' }} onClick={() => mutate()}>
        {isLoading ? <CircularProgress color='inherit' size={24} sx={{mr: 2}} /> : <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />}
        Inactif
      </MenuItem>
    </Popover>
    {/** CREATE MODAL */}
    <Modal open={openCreateModal} onClose={toggleCreateModal} sx={{borderRadius: 2, overflow: 'auto'}}>
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
            <Typography variant='h4'>Ajouter une option</Typography>
          </Stack>
          <Stack spacing={2} sx={{
            my: 2,
          }}>
            <Typography variant='h6'>Caractèristiques de l'option</Typography>
          </Stack>
          <Stack spacing={2}  direction='row' justifyContent={'space-between'}>
            <TextField name='name' value={option.name} type='text' required onChange={handleChange} label="Nom de l'option" />
            <TextField name='quantity' value={option.quantity} type='number' onChange={handleChange} required label='Choisissez la quantité' />
            <TextField name='price' value={option.price} type='number' onChange={handleChange} required label='Choisissez le prix' />
          </Stack>
          <Stack spacing={2} sx={{
            my: 2,
          }}>
            <Typography variant='h6'>Description de l'option</Typography>
          </Stack>
          <Stack spacing={2}>
            <TextField name='description' value={option.description} multiline onChange={handleChange} rows={2} required label="Petite description" />
            <TextField name='big_description' value={option.big_description} onChange={handleChange} multiline rows={4} required label='Grande description' />
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
              value={props.categoryUUID}
              onChange={cannotChangeOption}
            >
              {props.categories.map((category: Category) => {
                return  <MenuItem key={category.uuid} value={category.uuid}>{category.name}</MenuItem>
              })}
            </Select>
          </Stack>
          <Stack spacing={2} sx={{
            width: '100%',
            my: 2
          }}
          >
            <LoadingButton variant={'contained'} loading={createIsLoading} onClick={handleCreate}>
              Créer l'option
            </LoadingButton>
          </Stack>
        </Box>
    </Modal>
    {/** END CREATE MODAL */}
    {/** UPDATE MODAL */}
    <Modal open={openUpdateModal} onClose={toggleUpdateModal} sx={{borderRadius: 2, overflow: 'auto'}}>
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
            <Typography variant='h4'>Modifié l'option</Typography>
          </Stack>
          <Stack spacing={2} sx={{
            my: 2,
          }}>
            <Typography variant='h6'>Caractèristiques de l'option</Typography>
          </Stack>
          <Stack spacing={2}  direction='row' justifyContent={'space-between'}>
            <TextField name='name' value={option.name} type='text' required onChange={handleChange} label="Nom de l'option" />
            <TextField name='quantity' value={option.quantity} type='number' onChange={handleChange} required label='Choisissez la quantité' />
            <TextField name='price' value={option.price} type='number' onChange={handleChange} required label='Choisissez le prix' />
          </Stack>
          <Stack spacing={2} sx={{
            my: 2,
          }}>
            <Typography variant='h6'>Description de l'option</Typography>
          </Stack>
          <Stack spacing={2}>
            <TextField name='description' value={option.description} multiline onChange={handleChange} rows={2} required label="Petite description" />
            <TextField name='big_description' value={option.big_description} onChange={handleChange} multiline rows={4} required label='Grande description' />
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
              value={props.categoryUUID}
              onChange={cannotChangeOption}
            >
              {props.categories.map((category: Category) => {
                return  <MenuItem key={category.uuid} value={category.uuid}>{category.name}</MenuItem>
              })}
            </Select>
          </Stack>
          <Stack spacing={2} sx={{
            width: '100%',
            my: 2
          }}
          >
            <LoadingButton variant={'contained'} loading={updateIsLoading} onClick={handleUpdate}>
              Modifié l'option
            </LoadingButton>
          </Stack>
        </Box>
    </Modal>
    {/** END UPDATE MODAL */}
    </>
    )
} 