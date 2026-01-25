import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../index.css'; 
import '../styles/main.scss'; 
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isBpmnPage = router.pathname.startsWith('/bpmn');

  return (
    <ThemeProvider>
       <Head>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <title>Business Tools</title>
       </Head>
       
       <div className="d-flex flex-column min-vh-100">
          {!isBpmnPage && <AppNavbar />}
          <div className="flex-grow-1" style={{ paddingTop: isBpmnPage ? '0' : '70px' }}>
             <Component {...pageProps} />
          </div>
          {!isBpmnPage && <Footer />}
       </div>
    </ThemeProvider>
  );
}

export default MyApp;
