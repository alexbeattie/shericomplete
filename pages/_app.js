// pages/_app.js
import '../styles/globals.css';
import '../lib/fontawesome';  // Adjust the path according to your file structure
import '@fortawesome/fontawesome-svg-core/styles.css';
import Layout from '../components/Layout';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/cube-animation.css';
import '../styles/leaflet-popup-custom.css'; // Add your custom CSS here
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRulerCombined } from '@fortawesome/free-solid-svg-icons';

// import { config } from '@fortawesome/fontawesome-svg-core';


function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;