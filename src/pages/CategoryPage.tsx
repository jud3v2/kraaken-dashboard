import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import {api} from '../api'
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
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { ClimbingBoxLoader } from 'react-spinners';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nom', alignRight: false },
  { id: 'uuid', label: 'Identifiant', alignRight: false },
  { id: 'isDeleted', label: 'Actif', alignRight: false },
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
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el: any) => el[0]);
}

export default function CategoryPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const  [categories, setCategories] = useState([]);

  const [currentUUID, setCurrentUUID] = useState('');

  const [currentCategorie, setCurrentCategorie] = useState({name: ''})

  const [openModal, setOpenModal] = useState(false);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [newCategorieName, setNewCategorieName] = useState('');

  const {isLoading} = useQuery('categories', api.categoryAll)
  
  // API CALL --------------------------

  async function fetchCategoryData() {
    await api.categoryAll()
    .then((data) => {
      setCategories(data)
    })
    .catch((err) => {
      toast.error('Erreur lors du chargement des categories')
    })
  }

  async function fetchDeleteData(uuid: string) {
    await api.categoryDelete(uuid)
  }

  // ------------------------------


  useEffect(() => {
    fetchCategoryData()
  }, [])

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

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const newSelecteds: any = categories.map((n: any) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: any, name: never) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: any = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
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


  const toggleModal = (event: any) => {
    setOpenModal(!openModal)
  }

  const toggleCreateModal = (event: any) => {
    setOpenCreateModal(!openCreateModal)
  }

  const handleUpdate = async (event: any, uuid: string) => {
    event.preventDefault();
    setCurrentCategorie(categories.filter((categorie: any) => categorie.uuid === uuid)[0])
    toggleModal(event);
  }

  const handleDelete = async (event: any, uuid: any) => {
    event.preventDefault();
    await fetchDeleteData(uuid).then(async () => {
      await fetchCategoryData();
      toast.success('Catégorie modifiée avec succès !')
    })
    .catch((error) => {
      toast.error(error.response.data.error)
    })
    
  }

  const handleChange = (e: any) => {
    e.preventDefault()
    setCurrentCategorie({name: e.target.value})
  }

  const fetchUpdateData = async (e: any) => {
    await api.categoryUpdate({uuid: currentUUID, name: currentCategorie.name})
  }

  const handleUpdateCategory = async (e: any) => {
    e.preventDefault()
    await fetchUpdateData(e);
    await fetchCategoryData();
    toggleModal(e);
    toast.success('Catégorie modifiée avec succès !')
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categories.length) : 0;

  const filteredUsers = applySortFilter(categories, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  
  const handleChangeNewCategorie = (e: any) => {
    setNewCategorieName(e.target.value)
  }
  
  const handleCreateCategory = async (e: any) => {
    e.preventDefault()
    await api.categoryCreate({name: newCategorieName})
    .then(async () => {
      toast.success('Catégorie créée avec succès !')
      await fetchCategoryData();
      toggleCreateModal(e);
      setNewCategorieName('')
    })
    .catch((err) => {
      toast.error(err.response.data.error)
    })
  }

  return (
    <>
      <Helmet>
        <title> Categories | Lizaora </title>
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
            Gestion des catégories
          </Typography>
          <Button variant="contained" onClick={toggleCreateModal} startIcon={<Iconify icon="eva:plus-fill" />}>
            Nouvelle catégorie
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
                  rowCount={categories.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
                    const { uuid, name, isDeleted }: {name: never, uuid: string, isDeleted: boolean} = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={uuid} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {uuid.substring(0, 8)}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">
                          {isDeleted ? <Label color="error">Inactif</Label> : <Label color="success">Actif</Label>}
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
                            <br /> Utiliser des mots complet ou changer le type.
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
            count={categories.length}
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
        <MenuItem onClick={e => handleUpdate(e, currentUUID)}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Editer
        </MenuItem>

        <MenuItem onClick={e => handleDelete(e, currentUUID)} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Popover>
      {/* UPDATE MODAL */}
      <Modal
        open={openModal}
        onClose={toggleModal}
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
          width: 600,
          borderRadius: 2,
        }}>
          <Typography padding={2} id="modal-modal-title" variant="h6" component="h2">
            Mise à jour de la catégorie
          </Typography>
          <Stack padding={2} spacing={3}>
            <TextField name="name" onChange={e => handleChange(e)} value={openModal ? currentCategorie.name : ''} label="Nom de la catégorie" />
          </Stack>
          <Stack padding={2} spacing={3}>
          <Button variant="contained" onClick={e => handleUpdateCategory(e)} startIcon={<Iconify icon="eva:plus-fill" />}>
            Mettre à jour la catégorie
          </Button>
          </Stack>
        </Box>
      </Modal>
      {/* UPDATE MODAL */}
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
          width: 600,
          borderRadius: 2,
        }}>
          <Typography padding={2} id="modal-modal-title" variant="h6" component="h2">
            Créer une nouvelle catégorie
          </Typography>
          <Stack padding={2} spacing={3}>
            <TextField name="name" onChange={e => handleChangeNewCategorie(e)} value={newCategorieName} label="Nom de la nouvelle catégorie" />
          </Stack>
          <Stack padding={2} spacing={3}>
          <Button variant="contained" onClick={e => handleCreateCategory(e)} startIcon={<Iconify icon="eva:plus-fill" />}>
            Créé la catégorie
          </Button>
          </Stack>
        </Box>
      </Modal>
      {/* CREATE MODAL */}
    </>
  );
}
