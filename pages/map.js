import { useState, useEffect } from 'react';
import GMapComponent from '../components/GMapComponent';

const MapPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchListings = async () => {
    try {
      const response = await fetch('/api/listings');
      const data = await response.json();
      console.log('Fetched data:', data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setListings(data);
        console.log('Listings:', data);
      } else if (data && Array.isArray(data.listings)) {
        setListings(data.listings);
      } else {
        console.error('Unexpected data format:', data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  };

  fetchListings();
}, []);

  return (
    <div>
      <h1>Map Page</h1>
      {loading ? <p>Loading map...</p> : <GMapComponent listings={listings} />}
    </div>
  );
};

export default MapPage;
