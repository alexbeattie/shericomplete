import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';

const MapWithNoSSR = dynamic(() => import('./FullMapComponent'), { ssr: false });

const FullPageMap = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState([37.7749, -122.4194]); // Default center

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get('/api/all-listings');
        console.log('API Response:', res.data); // Debugging log
        if (res.data && res.data.Items && res.data.Items.length > 0) {
          const items = res.data.Items;
          setListings(items);

          // Set the center to the first listing's coordinates
          const firstListing = items[0];
          const lat = parseFloat(firstListing.Latitude);
          const lng = parseFloat(firstListing.Longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            setCenter([lat, lng]);
          } else {
            console.error('Invalid coordinates:', firstListing.Latitude, firstListing.Longitude);
            setError('Invalid coordinates for the first listing');
          }
        } else {
          setError('No listings found');
        }
      } catch (err) {
        setError('Error fetching listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Head>
        <title>Listings Map</title>
        <meta name="description" content="View all listings on a map" />
      </Head>
      <div style={{ height: '100vh', width: '100%' }}>
        <MapWithNoSSR listings={listings} center={center} />
      </div>
    </>
  );
};

export default FullPageMap;