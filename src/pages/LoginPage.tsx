import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Divider, Stack } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';

// sections
import { LoginForm } from '../sections/auth/login';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }: {theme: any}) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const Logo = '/assets/images/app/img-lizaora.png';

  return (
    <>
      <Helmet>
        <title> Login | Lizaora </title>
      </Helmet>

      <StyledRoot>

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Bienvenue ! 
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <Stack sx={{
            width: '100%',
            justifyContent: 'center',
            justifyItems: 'center',
            justifySelf: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            textAlign: 'center',
            transform: 'translateY(50%)',
          }}>
            <img id='logo-image' src={Logo} alt='lizaora-logo'/>
          </Stack>
          <StyledContent>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Se connecter à Lizaora

              </Typography>
            </Divider>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
