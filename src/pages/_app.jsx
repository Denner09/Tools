import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../index.css'; 
import '../styles/main.scss'; 
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';
import AppNavbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isBpmnPage = router.pathname.startsWith('/bpmn');

  return (
    <ThemeProvider>
       <Head>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
         <title>Business Tools</title>
         <link rel="manifest" href="/manifest.json" />
         <meta name="theme-color" content="#f97316" />
         <meta name="apple-mobile-web-app-capable" content="yes" />
         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
         <meta name="apple-mobile-web-app-title" content="BusTools" />
         <link rel="apple-touch-icon" href="/icon-192x192.png" />
         <link rel="preconnect" href="https://fonts.googleapis.com" />
         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
         <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
       </Head>
       
       <div className="d-flex flex-column min-vh-100">
          {!isBpmnPage && <AppNavbar />}
          <div className="flex-grow-1" style={{ paddingTop: isBpmnPage ? '0' : '80px' }}>
             <Component {...pageProps} />
          </div>
          {!isBpmnPage && <Footer />}
       </div>
    </ThemeProvider>
  );
}

export default MyApp;
