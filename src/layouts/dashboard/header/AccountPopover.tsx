import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, SxProps } from '@mui/material';
// mocks_
import account from '../../../_mock/account';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Accueil',
    icon: 'eva:home-fill',
    url: '/',
    external: false
  },
  {
    label: 'Profil',
    icon: 'eva:person-fill',
    url: '/',
    external: false
  },
  {
    label: 'Paramètres',
    icon: 'eva:settings-2-fill',
    url: '/',
    external: false
  },
  {
    label: 'Documentation',
    icon: '',
    url: 'https://docs.lizaora.fr',
    external: true
  }
];

// ----------------------------------------------------------------------

export default function AccountPopover({user}: {user:any}) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event: any) => {
    setOpen(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
    setOpen(null);
    toast.success('Déconnexion réussie')
  };

  const handleClose = () => {
    setOpen(null);
  };

  const navigate = useNavigate()

  const styles: SxProps = {
    p: 0,
    '&:before': {
      zIndex: 1,
      content: "''",
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      position: 'absolute',
      bgcolor: (theme: any) => open ? alpha(theme.palette.grey[900], 0.8) : 'transparent',
    },
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={styles}>
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name.charAt(0).toUpperCase() + user?.name.slice(1) || account.displayName}
            {' '}
            {user?.forename.charAt(0).toUpperCase() + user?.forename.slice(1) || ''}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email || ''}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => {
              handleClose()
              if(option?.external) {
                window.open(option.url, '_blank')
              } else {
                navigate(option.url)
              }
              }}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Se déconnecter
        </MenuItem>
      </Popover>
    </>
  );
}
