import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { DashboardContent } from 'src/layouts/dashboard';

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
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
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
                <img
                  alt="icon"
                  src="/assets/icons/glass/ic-glass-users.svg"
                  style={{ width: 48, height: 48, marginBottom: 8 }}
                />
                <Typography variant="subtitle1">Usuarios</Typography>
              </Paper>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/Proyectos')}
              >
                <img
                  alt="icon"
                  src="/assets/icons/glass/create_new_folder.svg"
                  style={{ width: 48, height: 48, marginBottom: 8 }}
                />
                <Typography variant="subtitle1">Proyectos</Typography>
              </Paper>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/Reclamos')}
              >
                <img
                  alt="icon"
                  src="/assets/icons/navbar/ic-book.svg"
                  style={{ width: 48, height: 48, marginBottom: 8 }}
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
                <img
                  alt="icon"
                  src="/assets/icons/navbar/ic-note.svg"
                  style={{ width: 48, height: 48, marginBottom: 8 }}
                />
                <Typography variant="subtitle1">Mantenimientos</Typography>
              </Paper>
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={cardStyles}
                onClick={() => navigate('/dashboard/proyectos')}
              >
                <img
                  alt="icon"
                  src="/assets/icons/navbar/ic-payment.svg"
                  style={{ width: 48, height: 48, marginBottom: 8 }}
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
                onClick={() => navigate('/dashboard/Mantenimientos')}
              >
                <img
                  alt="icon"
                  src="/assets/icons/glass/report_problem.svg"
                  style={{ width: 48, height: 48, marginBottom: 8 }}
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
                <img
                  alt="icon"
                  src="/assets/icons/glass/report_problem.svg"
                  style={{ width: 48, height: 48, marginBottom: 8 }}
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
                <img
                  alt="icon"
                  src="/assets/icons/glass/report_problem.svg"
                  style={{ width: 48, height: 48, marginBottom: 8 }}
                />
                <Typography variant="subtitle1">Mantenimiento</Typography>
              </Paper>
            </Grid>
          </>
        )}

        
        
      </Grid>
    </DashboardContent>
  );
}
