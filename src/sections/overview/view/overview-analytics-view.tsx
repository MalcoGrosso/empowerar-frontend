import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { DashboardContent } from 'src/layouts/dashboard';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const navigate = useNavigate();
  const { firstName, lastName, role } = useAuth();
  // Estilos para las tarjetas
  const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    height: 150,
    cursor: 'pointer',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  };

  return (
    <DashboardContent maxWidth={false} sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage: 'url(/assets/images/home-cover-empowerar.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backgroundBlendMode: 'lighten',
          opacity: 1,
          transition: 'opacity 100ms ease-out',
          display: { xs: 'none', md: 'block' },
        }}
      />

      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, mt: 4 }}>
        Hola, {firstName} {lastName} 👋
      </Typography>

      <Grid container spacing={3}>
        {role === 'administrador' && (
          <>
            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/user')}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    marginBottom: 8,
                    backgroundColor: '#FF6B6B',
                    WebkitMaskImage: 'url(/assets/icons/glass/ic-glass-users.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(/assets/icons/glass/ic-glass-users.svg)',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    maskPosition: 'center',
                  }}
                  aria-label="icon"
                />
                <Typography variant="subtitle1">Usuarios</Typography>
              </Paper>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/proyectos')}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    marginBottom: 8,
                    backgroundColor: '#00D26A',
                    WebkitMaskImage: 'url(/assets/icons/glass/create_new_folder.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(/assets/icons/glass/create_new_folder.svg)',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    maskPosition: 'center',
                  }}
                  aria-label="icon"
                />
                <Typography variant="subtitle1">Proyectos</Typography>
              </Paper>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/reclamos')}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    marginBottom: 8,
                    backgroundColor: '#FFD600',
                    WebkitMaskImage: 'url(/assets/icons/navbar/ic-book.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(/assets/icons/navbar/ic-book.svg)',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    maskPosition: 'center',
                  }}
                  aria-label="icon"
                />
                <Typography variant="subtitle1">Reclamos</Typography>
              </Paper>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/mantenimientosAdmin')}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    marginBottom: 8,
                    backgroundColor: '#FF8A33',
                    WebkitMaskImage: 'url(/assets/icons/navbar/ic-note.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(/assets/icons/navbar/ic-note.svg)',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    maskPosition: 'center',
                  }}
                  aria-label="icon"
                />
                <Typography variant="subtitle1">Mantenimientos</Typography>
              </Paper>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/pagosAdmin')}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    marginBottom: 8,
                    backgroundColor: '#00C2FF',
                    WebkitMaskImage: 'url(/assets/icons/navbar/ic-payment.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(/assets/icons/navbar/ic-payment.svg)',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    maskPosition: 'center',
                  }}
                  aria-label="icon"
                />
                <Typography variant="subtitle1">Pagos</Typography>
              </Paper>
            </Grid>

          </>
        )}

        {role === 'electricista' && (
          <>
            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/mantenimientos')}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    marginBottom: 8,
                    backgroundColor: '#FF8A33',
                    WebkitMaskImage: 'url(/assets/icons/navbar/ic-note.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(/assets/icons/navbar/ic-note.svg)',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    maskPosition: 'center',
                  }}
                  aria-label="icon"
                />
                <Typography variant="subtitle1">Mantenimientos</Typography>
              </Paper>
            </Grid>
          </>
        )}

        {role === 'usuario' && (
          <>
            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/reclamos')}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    marginBottom: 8,
                    backgroundColor: '#FFD600',
                    WebkitMaskImage: 'url(/assets/icons/navbar/ic-book.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(/assets/icons/navbar/ic-book.svg)',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    maskPosition: 'center',
                  }}
                  aria-label="icon"
                />
                <Typography variant="subtitle1">Reclamos</Typography>
              </Paper>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/mantenimientos/usuarioLogueado')}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    marginBottom: 8,
                    backgroundColor: '#FF8A33',
                    WebkitMaskImage: 'url(/assets/icons/navbar/ic-note.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(/assets/icons/navbar/ic-note.svg)',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    maskPosition: 'center',
                  }}
                  aria-label="icon"
                />
                <Typography variant="subtitle1">Mantenimiento</Typography>
              </Paper>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/pagos')}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    marginBottom: 8,
                    backgroundColor: '#00C2FF',
                    WebkitMaskImage: 'url(/assets/icons/navbar/ic-payment.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskImage: 'url(/assets/icons/navbar/ic-payment.svg)',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    maskPosition: 'center',
                  }}
                  aria-label="icon"
                />
                <Typography variant="subtitle1">Pagos</Typography>
              </Paper>
            </Grid>
          </>
        )}

        
        
      </Grid>
    </DashboardContent>
  );
}
