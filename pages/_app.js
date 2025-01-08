// pages/_app.js

import '../styles/globals.css';
import '../lib/fontawesome';  // Adjust the path according to your file structure
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Layout from '../components/Layout';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import '../styles/leaflet-popup-custom.css'; // Add your custom CSS here
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRulerCombined } from '@fortawesome/free-solid-svg-icons';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's already imported
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import ReactGA from 'react-ga4'





function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GA_ID)
  }, [])

  useEffect(() => {
    const handleRouteChange = (url) => {
      ReactGA.send({ hitType: "pageview", page: url });
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    

    <Layout>
      <Component {...pageProps} />
      </Layout>
      
  );
}

export default MyApp;