import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import api from '../../config/axiosClient';

interface TokenPayload {
  exp: number; // Timestamp de expiración del token
}

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  /*
  const [dni, setDni] = useState<string>('44589635');  // Cambiar 'email' por 'dni'
  const [password, setPassword] = useState<string>('123');
  */
  const [showPassword, setShowPassword] = useState(false);
  const [dni, setDni] = useState<string>('');  // Cambiar 'email' por 'dni'
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar si el usuario ya está autenticado y redirigirlo al dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Redirigir al dashboard directamente si hay un token
      router.push('/dashboard');
    }
  }, [router]);

  const handleSignIn = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/login', { dni, password });  // Cambiar 'email' por 'dni'
      const { token } = response.data;

      // Guardar el token en localStorage
      localStorage.setItem('token', token);

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (axiosError: any) {
      const errorMessage =
        axiosError?.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dni, password, router]);  // Cambiar 'email' por 'dni'

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="dni"
        label="DNI"  // Cambiar etiqueta de 'Email' a 'DNI'
        value={dni}  // Cambiar 'email' por 'dni'
        onChange={(e) => setDni(e.target.value)}  // Cambiar 'email' por 'dni'
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
        loading={loading}
      >
        Iniciar Sesion
      </LoadingButton>

      {error && <Typography color="error" variant="body2">{error}</Typography>}
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Iniciar Sesion</Typography>
      </Box>

      {renderForm}
    </>
  );
}
