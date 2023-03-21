import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
//
import Header from './header';
import Nav from './nav';
import {useQuery} from "react-query"
import jwtDecode from 'jwt-decode';
import {api} from '../../api'
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }: {theme: any}) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout({children}: {children: any}) {
  const [open, setOpen] = useState(false);
  const decodedToken: any = jwtDecode(localStorage.getItem("token") || "");

  const { data } = useQuery(["user", decodedToken.uuid], () => {
    return api.getUser(decodedToken.uuid);
  });

  return (
    <StyledRoot>
      <Header user={data} onOpenNav={() => setOpen(true)} />

      <Nav user={data} openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>
        {children}
      </Main>
    </StyledRoot>
  );
}
