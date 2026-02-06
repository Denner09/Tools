import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../index.css'; 
import '../styles/main.scss'; 
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';
import AppNavbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import { MediaProvider, useMedia } from '../context/MediaContext';
import { useRouter } from 'next/router';

// Toggle Component for Navbar
const MediaNavbarControls = () => {
    const { activeTab, setActiveTab } = useMedia();
    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeTab === 'audio'
                  ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <i className="fas fa-music mr-2"></i>
              Áudio
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeTab === 'video'
                  ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <i className="fas fa-video mr-2"></i>
              Vídeo
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeTab === 'image'
                  ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <i className="fas fa-image mr-2"></i>
              Imagem
            </button>
        </div>
    );
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isBpmnPage = router.pathname.startsWith('/bpmn');
  const isMediaPage = router.pathname === '/media-editor';

  return (
    <ThemeProvider>
       <MediaProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Business Tools</title>
          <link rel="manifest" href="/Tools/manifest.json" />
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
            {!isBpmnPage && (
                <AppNavbar 
                    centerContent={isMediaPage ? <MediaNavbarControls /> : null}
                />
            )}
            <div className="flex-grow-1" style={{ paddingTop: isBpmnPage ? '0' : '80px' }}>
              <Component {...pageProps} />
            </div>
            {!isBpmnPage && !isMediaPage && <Footer />}
        </div>
       </MediaProvider>
    </ThemeProvider>
  );
}

export default MyApp;
