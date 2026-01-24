import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../index.css'; 
import '../styles/main.scss'; 
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
       <Head>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <title>Business Tools</title>
       </Head>
       
       <div className="d-flex flex-column min-vh-100">
          <AppNavbar />
          <div className="flex-grow-1" style={{ paddingTop: '70px' }}>
             <Component {...pageProps} />
          </div>
          <Footer />
       </div>
    </ThemeProvider>
  );
}

export default MyApp;
