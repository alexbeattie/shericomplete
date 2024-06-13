// pages/closed-listings.js

import { useEffect, useState } from 'react';

export default function ClosedListings() {
  const [data, setData] = useState([]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (startKey = null) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/fetch-closed-listings${startKey ? `?startKey=${encodeURIComponent(JSON.stringify(startKey))}` : ''}`);
      const result = await response.json();
      if (Array.isArray(result.items)) {
        setData(prevData => [...prevData, ...result.items]);
      }
      setLastEvaluatedKey(result.lastEvaluatedKey);
      console.log('Fetched data, lastEvaluatedKey:', result.lastEvaluatedKey);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Closed Listings</h1>
      {data.map((item, index) => (
        <p key={index}>{JSON.stringify(item, null, 2)}</p>
      ))}
      {lastEvaluatedKey && (
        <button onClick={() => fetchData(lastEvaluatedKey)} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
