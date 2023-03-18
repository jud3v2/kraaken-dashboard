import { useState } from 'react';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import {useRecoilState} from "recoil";
import {user,userState} from "../../../hooks/atom/user";
import axios from 'axios';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // eslint-disable-next-line
  const [admin,setAdmin] = useRecoilState(user);
  const [adminState,setAdminState] = useRecoilState(userState);
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
      await axios.post('user/login', {identifiant: email, password: password})
      .then(({data}) => {
          setAdmin(data)
          setAdminState({
              ...adminState,
              isConnected: !adminState.isConnected,
          });
          localStorage.setItem('token', data.token)
          toast.success('Connexion réussie', {
            position: 'top-right',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            }
          })
          return data
      })
      .catch((err) => {
          toast.error('Vos identifiant sont incorrect', {
            position: 'top-right',
            style: {  
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            }
          })
          return err
      })
      setIsLoading(false);
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" onChange={e => setEmail(e.target.value)}/>

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth loading={isLoading} size="large" type="submit" variant="contained" onClick={e => handleClick(e)}>
        Login
      </LoadingButton>
    </>
  );
}
