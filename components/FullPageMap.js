import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { ClipLoader } from "react-spinners";

const MapWithNoSSR = dynamic(() => import('./FullMapComponent'), { ssr: false });

const FullPageMap = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState([37.7749, -122.4194]); // Default center

  const isValidCoordinate = (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  };

  const calculateCenter = (items) => {
    const validCoordinates = items.filter(item =>
      isValidCoordinate(parseFloat(item.Latitude), parseFloat(item.Longitude))
    );

    if (validCoordinates.length === 0) return null;

    const sumLat = validCoordinates.reduce((sum, item) => sum + parseFloat(item.Latitude), 0);
    const sumLng = validCoordinates.reduce((sum, item) => sum + parseFloat(item.Longitude), 0);
    return [sumLat / validCoordinates.length, sumLng / validCoordinates.length];
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const timestamp = new Date().getTime();
        const res = await axios.get(`/api/listings-api?t=${timestamp}`);
        console.log('API Response:', res.data); // Debugging log

        if (res.data && res.data.Items && res.data.Items.length > 0) {
          const items = res.data.Items;
          setListings(items);

          const newCenter = calculateCenter(items);
          if (newCenter) {
            setCenter(newCenter);
          } else {
            console.warn('No valid coordinates found in listings');
          }
        } else {
          setError('No listings found');
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Error fetching listings: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    console.log('Listings:', listings);
    console.log('Center:', center);
  }, [listings, center]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color={"#123abc"} loading={loading} size={50} />
      </div>
    );
  }  if (error) return <div>{error}</div>;

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