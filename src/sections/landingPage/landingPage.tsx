import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { RouterLink } from 'src/routes/components';

import { SimpleLandingLayout } from 'src/layouts/simpleLanding/layout';
import { Carousel } from 'react-responsive-carousel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Grid, MenuItem, Select, SelectChangeEvent, TextField, Link } from '@mui/material';
import { useLanguage } from 'src/context/LanguageProvider'; // Importa el hook para acceder al idioma
import { lightBlue, lightGreen } from '@mui/material/colors';
import { useForm, ValidationError } from '@formspree/react';

// Define el tipo LanguageContent
type LanguageContent = {
  mission: string;
  missionContent1: JSX.Element;
  missionContent2: string;
  missionContent3: JSX.Element;
  stats: string[];
  buttonText: string;
  familyNeed: string;
  crowdfunding: string;
  implementation: string;
  tokenization: JSX.Element;
  aboutUs: JSX.Element;
  aboutUs1: string;
};

// ----------------------------------------------------------------------

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export function LandingPage() {
  // Usa el hook useLanguage para acceder al idioma y la función para cambiarlo
  const { language, setLanguage } = useLanguage(); 

  const [state, handleSubmit] = useForm("meoqqnjd");

  // Textos en español e inglés con tipado
  const textContent: { es: LanguageContent; en: LanguageContent } = {
    es: {
      mission: "Nuestra Misión",
      missionContent1: (
        <>
          <strong>empowerar</strong> es el resultado de la integración de la tecnología a la sociedad de una manera sustentable y con acceso universal que respete y promueva el bienestar humano y el progreso social.
        </>
      ),
      missionContent2: "Este producto es un MVP (Producto Mínimo Viable) del LabTA quien viene desarrollando modelos de negocios en comunidades rurales de la Argentina.",
      missionContent3: (
        <>
          Sentimos un profundo orgullo del equipo que formamos, cumpliendo un rol más que importante a través de políticas de responsabilidad social.
        </>
      ),
      stats: [
        "+ 3000 estudiantes capacitados",
        "+ 50 familias electrificadas",
        "10 desarrollos productivos",
        "1 escuela rural electrificada",
        "1 centro de salud electrificado",
        "1 centro comunitario electrificado"
      ],
      buttonText: "Comenzar",
      familyNeed: "Las familias o comunidades plantean la necesidad de acceso a energía eléctrica y bombeo de agua. Una organización (ONG, cooperativa, Asociación Civil) debe validar a la familia y ser la responsable del sistema instalado.",
      crowdfunding: "A través de donaciones e inversiones, la plataforma se encarga de recaudar fondos para adquirir el equipamiento necesario para los sistemas fotovoltaicos. Dependiendo de las necesidades y la capacidad de pago, las familias pueden elegir entre 4 kits fotovoltaicos de diferente potencia.",
      implementation: "Los fondos se utilizan para compra e instalación del equipamiento, además de crear un fondo de reserva para reparaciones.",
      tokenization: (
        <>
          La plataforma <strong>empowerar</strong> permite gestionar los pagos mensuales de las familias y el sistema de visitas mensuales de mantenimiento.
        </>
      ),
      aboutUs: (<>De la Academia al Emprendimiento. Somos un equipo que lleva casi 10 años trabajando en electrificación rural desde LabTA, para escalar nuestros proyectos nos dimos cuenta que teníamos que dar el siguiente paso. <strong>empowerar</strong> es nuestra forma de hacerlo.</>),
      aboutUs1: "El laboratorio de tecnologías Apropiadas (LabTA) trabaja en la búsqueda de nuevas alternativas tecnológicas que resuelvan problemas reales de nuestras comunidades en el territorio. En este sentido, estamos convencidos que la comunidad universitaria puede cumplir un rol más que importante a través de políticas de responsabilidad social asumiendo un liderazgo comprometido, plasmándolo en acciones educativas, de investigación, extensión y transferencia, por medio de la formación de personas que actúan como agentes multiplicadores y desarrollo de tecnologías apropiadas que se puedan difundir entre las comunidades y sus territorios.",
    },
    en: {
      mission: "Our Mission",
      missionContent1: (
        <>
          <strong>empowerar</strong> is the result of integrating technology into society in a sustainable way with universal access that respects and promotes human well-being and social progress.
        </>
      ),
      missionContent2: "This product is an MVP (Minimum Viable Product) of LabTA, which has been developing business models in rural communities in Argentina.",
      missionContent3: (
        <>
          We are deeply proud of the team we have formed, playing an important role through social responsibility policies.
        </>
      ),
      stats: [
        "+ 3000 trained students",
        "+ 50 electrified families",
        "10 productive developments",
        "1 rural school electrified",
        "1 health center electrified",
        "1 community center electrified"
      ],
      buttonText: "Get Started",
      familyNeed: "Families or communities raise the need for access to electricity and water pumping. An organization (NGO, cooperative, Civil Association) must validate the family and be responsible for the installed system.",
      crowdfunding: "Through donations and investments, the platform is responsible for raising funds to acquire the necessary equipment for photovoltaic systems. Depending on needs and payment capacity, families can choose between 4 photovoltaic kits of different power.",
      implementation: "The funds are used for the purchase and installation of equipment, in addition to creating a reserve fund for repairs.",
      tokenization: (
        <>
          The <strong>empowerar</strong> platform allows you to manage families monthly payments and the monthly maintenance visit system.
        </>
      ),
      aboutUs: (<>From the Academy to Entrepreneurship. We are a team that has been working on rural electrification for almost 10 years from LabTA. To scale up our projects, we realized that we had to take the next step. <strong>empowerar</strong> is our way of doing it.</>),
      aboutUs1: "The Appropriate Technologies Laboratory (LabTA) works on the search for new technological alternatives that solve real problems of our communities in the territory. In this sense, we are convinced that the university community can play a more than important role through social responsibility policies, assuming a committed leadership, embodying it in educational, research, extension and transfer actions, through the training of people who act as multiplying agents and the development of appropriate technologies that can be disseminated among communities and their territories.",
    }
  };

  // Selecciona el contenido según el idioma actual
  const content = textContent[language];

  return (
    <SimpleLandingLayout>
      {/* Selector de idioma */}
      <section id="home">
        <Box sx={{ position: 'absolute', top: '100px', right: '20px', zIndex: 3 }}>
          <Select
            value={language}
            onChange={(event: SelectChangeEvent<'es' | 'en'>) => {
              setLanguage(event.target.value as 'es' | 'en'); // Cambia el idioma usando setLanguage
            }}
            variant="outlined"
            sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <MenuItem value="es">
              <img
                src="/assets/landing/flag/espana.png"
                alt="Español"
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              Español
            </MenuItem>
            <MenuItem value="en">
              <img
                src="/assets/landing/flag/reinoUnido.png"
                alt="English"
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              English
            </MenuItem>
          </Select>
        </Box>

      {/* Contenedor del video de fondo */}
      <Box
        sx={{
          position: 'relative',
          height: '400px',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          textAlign: 'center',
          marginBottom: 5,
        }}
      >
        {/* Video de fondo */}
        <video
          autoPlay
          loop
          muted
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
          }}
        >
          <source src="/assets/landing/video/vid01.mp4" type="video/mp4" />
        </video>

        {/* Overlay oscuro */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />

        {/* Contenido sobre el video */}
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            <strong>empowerar 1.0</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {language === 'es'
              ? 'Una plataforma de código abierto para el financiamiento regenerativo de comunidades vulnerables'
              : 'An open-source platform for the regenerative financing of vulnerable communities'}
          </Typography>
          <Button href="/sign-in" variant="contained" color="primary">
            {content.buttonText}
          </Button>
        </Box>
      </Box>
    </section>

    <section id="ourMission">
      <Container sx={{ mb: 5 }}>
        <Typography variant="h1" align="center" sx={{ mb: 2 }}>
          {content.mission}
        </Typography>

        <Typography sx={{ color: 'text.secondary' }}>{content.missionContent1}</Typography>
        <br />
        <Typography sx={{ color: 'text.secondary' }}>{content.missionContent2}</Typography>
        <br />
        <Typography sx={{ color: 'text.secondary' }}>{content.missionContent3}</Typography>
        <br />

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <List
              sx={{
                listStyleType: 'disc',
                pl: 2,
                '& .MuiListItem-root': {
                  display: 'list-item',
                },
              }}
            >
              {content.stats.map((stat, index) => (
                <ListItem key={index}>{stat}</ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={8}>
          <Container sx={{ maxWidth: '100%', overflow: 'hidden', mb: 5 }}>
      <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={2000}>
        <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
          <img
            src="/assets/landing/carousel/2.jpg"
            alt="Imagen 1"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
        <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
          <img
            src="/assets/landing/carousel/4.jpg"
            alt="Imagen 2"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
        <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
          <img
            src="/assets/landing/carousel/5.jpg"
            alt="Imagen 3"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
        <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
          <img
            src="/assets/landing/nMision.png"
            alt="Imagen 3"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      </Carousel>
    </Container>
          </Grid>
        </Grid>
      </Container>
    </section>

    {/* Carrusel de imágenes */}
    

    <section id="howItWorks" style={{ backgroundColor: lightGreen[50] }}>
      <Container sx={{ mb: 2, mt: 5}}>
        <Typography variant="h1" align="center" sx={{ mb: 2 }}>
          {language === 'es' ? 'Como Funciona' : 'How it Works'}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          <Item style={{ backgroundColor: lightGreen[200], color: 'rgba(0, 0, 0, 0.8)' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: lightGreen[600],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                mb: -2,
                mt: 2,
              }}
            >
              <Typography variant="h4" align="center" sx={{ color: 'rgba(0, 0, 0, 0.9)' }}>
                1
              </Typography>
            </Box>
            <br /> <br /> {language === 'es' ? 'Necesidad Familiar' : 'Family Need'}
            <br />
            <br />
            {content.familyNeed}
          </Item>

          <Item style={{ backgroundColor: lightGreen[200], color: 'rgba(0, 0, 0, 0.8)' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: lightGreen[600],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                mb: -2,
                mt: 2,
              }}
            >
              <Typography variant="h4" align="center" sx={{ color: 'rgba(0, 0, 0, 0.9)' }}>
                2
              </Typography>
            </Box>
            <br /> <br /> {language === 'es' ? 'Financiamiento' : 'Crowdfunding'}
            <br />
            <br />
            {content.crowdfunding}
          </Item>

          <Item style={{ backgroundColor: lightGreen[200], color: 'rgba(0, 0, 0, 0.8)' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: lightGreen[600], // Círculo más oscuro que el ítem
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                mb: -2,
                mt: 2,
              }}
            >
              <Typography variant="h4" align="center" sx={{ color: 'rgba(0, 0, 0, 0.9)' }}>
                3
              </Typography>
            </Box>
            <br /> <br /> {language === 'es' ? 'Implementacion' : 'Implementation'}
            <br />
            <br />
            {content.implementation}
          </Item>

          <Item style={{ backgroundColor: lightGreen[200], color: 'rgba(0, 0, 0, 0.8)' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: lightGreen[600],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
                mb: -2,
                mt: 2,
              }}
            >
              <Typography variant="h4" align="center" sx={{ color: 'rgba(0, 0, 0, 0.9)' }}>
                4
              </Typography>{' '}
            </Box>
            <br /> <br /> {language === 'es' ? 'Sostenibilidad' : 'Sustainability'}
            <br />
            <br />
            {content.tokenization}
          </Item>
        </Box>
        <br />
      </Container>
    </section>

    <section id="aboutUs">
  <Container sx={{ mb: 5 }}>
    <Typography variant="h1" align="center" sx={{ mb: 2 }}>
      {language === 'es' ? 'Sobre Nosotros' : 'About Us'}
    </Typography>

    <Typography sx={{ color: 'text.secondary' }}>{content.aboutUs}</Typography>
    <br />
    <Typography sx={{ color: 'text.secondary' }}>{content.aboutUs1}</Typography>
    <Typography>
      <Button 
        variant="contained" 
        color="primary" 
        href="https://labta.site"  // Para enlaces externos
        target="_blank"  // Opcional: abre el enlace en una nueva pestaña
        rel="noopener noreferrer"
        sx={{
          width: 200,
          height: 30,
          backgroundColor: lightGreen[600],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
          mb: -2,
          mt: 2,
        }}>
        Pagina Web: LabTA
      </Button>
    </Typography>
    <br />

    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12}>
        <Box
          component="img"
          src="/assets/landing/aboutUs/aboutUs.JPG"
          sx={{
            width: '100%',
            borderRadius: '8px',
          }}
        />
      </Grid>
    </Grid>
  </Container>
</section>


    <section id="testimonials" style={{ backgroundColor: lightBlue[50] }}>
      <Container sx={{ mb: 5 }}>
        <Typography variant="h1" align="center" sx={{ mb: -5 }}>
          <br /> {language === 'es' ? 'Testimonios' : 'Testimonials'} <br />
          <br />
        </Typography>

        {/* Primer Testimonio */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            backgroundColor: lightBlue[300],
            borderRadius: '50px',
          }}
        >
          <Item style={{ backgroundColor: lightBlue[300] }}>
            <img
              src="/assets/landing/testimonials/test1.jpg"
              alt=""
              style={{ borderRadius: '5px' }}
              width= 'auto'
              height='300px'
            />
          </Item>
          <Item style={{ backgroundColor: lightBlue[300] }}>
            <Typography align="center" sx={{ mt: { xs: 5, md: 15 }, color: 'white' }}>
              {language === 'es'
                ? '“Con luz, ahora mis hijos pueden estudiar de noche”'
                : '“With light, now my children can study at night”'}
            </Typography>
            <br />
            <Typography align="center" sx={{ color: 'white' }}>
              <a href="https://www.lanacion.com.ar/comunidad/hambre-de-futuro/con-luz-mis-hijos-pueden-estudiar-un-proyecto-de-electrificacion-rural-brinda-energia-solar-a-nid26122023/?utm_medium=Echobox&utm_source=Facebook&fbclid=IwAR1fKvv8NDUonh-bpo6-F-jjC-yei5N2-_86gqA8-5NzAjD1MCbXsX76Xw4#Echobox=1703604333">
                {language === 'es'
                  ? 'Tila, madre de 9 hijos en paraje La Medialuna, Chaco'
                  : 'Tila, mother of 9 children in La Medialuna, Chaco'}
              </a>
            </Typography>
          </Item>
        </Box>

        <br />
        <br />

        {/* Segundo Testimonio */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            backgroundColor: lightBlue[300],
            borderRadius: '50px',
          }}
        >
          <Item style={{ backgroundColor: lightBlue[300] }}>
            <Typography align="center" sx={{ mt: { xs: 5, md: 5 }, color: 'white' }}>
              {language === 'es'
                ? '“El principal beneficio y más importante de todos es disponer de energía las 24 horas sin necesidad de prender el generador, eso ha beneficiado a la escuela como a la comunidad.”'
                : '“The main and most important benefit of all is having power 24 hours a day without having to turn on the generator, that has benefited the school as well as the community.”'}
            </Typography>
            <br />
            <Typography align="center" sx={{ color: 'white' }}>
              {language === 'es'
                ? 'Johana Muñoz, Maestra de la Escuela Florentino Carreño.'
                : 'Johana Muñoz, Teacher at the Florentino Carreño School.'}
            </Typography>
          </Item>
          <Item style={{ backgroundColor: lightBlue[300] }}>
            <img
              src="/assets/landing/testimonials/test3.jpg"
              alt=""
              style={{ borderRadius: '5px' }}
            />
          </Item>
        </Box>

        <br />
        <br />

        {/* Tercer Testimonio */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            backgroundColor: lightBlue[300],
            borderRadius: '50px',
          }}
        >
          <Item style={{ backgroundColor: lightBlue[300] }}>
            <img
              src="/assets/landing/testimonials/test2.jpg"
              alt=""
              style={{ borderRadius: '5px' }}
              width= 'auto'
              height='300px'
            />
          </Item>
          <Item style={{ backgroundColor: lightBlue[300] }}>
            <Typography align="center" sx={{ mt: { xs: 5, md: 15 }, color: 'white' }}>
              {language === 'es'
                ? '“Esta oportunidad me ha permitido capacitarme en sistemas fotovoltaicos y tener nuevos ingresos para mi familia.”'
                : '“This opportunity has allowed me to train in photovoltaic systems and have new income for my family.”'}
            </Typography>
            <br />
            <Typography align="center" sx={{ color: 'white' }}>
              {language === 'es'
                ? 'Nelson, electricista local en El Impenetrable, Chaco'
                : 'Nelson, local electrician in El Impenetrable, Chaco'}
            </Typography>
          </Item>
        </Box>
      </Container>
    </section>

    <section id="contact">
        <Container sx={{ py: 5 }}>
          <Typography variant="h2" align="center" sx={{ mb: 3 }}>
            {language === 'es' ? 'Contáctanos' : 'Contact Us'}
          </Typography>

          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            {language === 'es'
              ? 'Déjanos un mensaje y nos pondremos en contacto contigo.'
              : 'Leave us a message and we will get in touch with you.'}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit} // Manejar envío de formulario con Formspree
            sx={{
              display: 'grid',
              gap: 3,
              maxWidth: '600px',
              margin: '0 auto',
            }}
            noValidate
            autoComplete="off"
          >
            {/* Nombre */}
            <TextField 
              label={language === 'es' ? 'Nombre' : 'Name'} 
              id="name" 
              name="name" 
              variant="outlined" 
              fullWidth 
              required
            />

            {/* Email */}
            <TextField 
              label="Email" 
              id="email" 
              type="email" 
              name="email" 
              variant="outlined" 
              fullWidth 
              required
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />

            {/* Mensaje */}
            <TextField
              label={language === 'es' ? 'Mensaje' : 'Message'}
              id="message"
              name="message"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              required
            />
            <ValidationError prefix="Message" field="message" errors={state.errors} />

            {/* Botón de Enviar */}
            <Button type="submit" variant="contained" color="primary" size="large" disabled={state.submitting}>
              {language === 'es' ? 'Enviar' : 'Send'}
            </Button>

            {/* Mensaje de éxito */}
            {state.succeeded && (
              <Typography variant="body1" align="center" sx={{ color: 'green', mt: 3 }}>
                {language === 'es' ? 'Formulario enviado con éxito!' : 'Form successfully submitted!'}
              </Typography>
            )}
          </Box>
        </Container>
      </section>
    <Box
      component="footer"
      sx={{
        backgroundColor: '#555',
        color: 'white',
        py: 4,
        textAlign: 'center',
        mt: 5,
      }}
    >
      <Typography variant="body2" sx={{ mb: 2 }}>
      
      <a href="https://www.instagram.com/labta_unsl" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-instagram" viewBox="0 0 16 16">
      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
      </svg>
      </a>

      &nbsp;

      <a href="mailto:contacto@empowerar.org" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-envelope" viewBox="0 0 16 16">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
      </svg>
      </a>
              
      
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {language === 'es'
          ? '© 2024 empowerar. Todos los derechos reservados.'
          : '© 2024 empowerar. All rights reserved.'}
      </Typography>
      <Link href="#" sx={{ color: 'white', mx: 2 }}>
        {language === 'es' ? 'Política de privacidad' : 'Privacy Policy'}
      </Link>
      <Link href="#" sx={{ color: 'white', mx: 2 }}>
        {language === 'es' ? 'Términos de servicio' : 'Terms of Service'}
      </Link>
    </Box>
  </SimpleLandingLayout>
);
}
