// pages/listings/[id].js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';

const ListingDetailPage = () => {
  const router = useRouter();
  const { id, endpoint } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && endpoint) {
      const fetchListing = async () => {
        try {
          const apiEndpoint = endpoint === 'sold' ? '/api/sold-route' : '/api/available-route';
          const res = await axios.get(`${apiEndpoint}?id=${id}`);
          console.log('API response:', res.data);
          if (res.data && res.data.Items && res.data.Items.length > 0) {
            const item = res.data.Items.find(listing => listing.ListingKey === id);
            if (item) {
              setListing(item);
              console.log('Listing data:', item);
            } else {
              setError('Listing not found');
            }
          } else {
            setError('Listing not found');
          }
        } catch (err) {
          setError('Error fetching listing');
          console.error('Fetch error:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchListing();
    }
  }, [id, endpoint]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!listing) {
    return <div>No listing found</div>;
  }

  console.log('Rendering listing:', listing);

  const mediaUrls = listing.Media ? listing.Media.split(',').map((url) => url.trim()) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {mediaUrls.length > 0 && (
          <Image
            src={mediaUrls[0]}
            alt={listing.ListingKey}
            width={1000}
            height={600}
            className="w-full h-64 object-cover"
            priority={true}
          />
        )}
        <div className="p-4">
          <h2 className="text-2xl font-semibold">{listing.ListingKey}</h2>
          <p className="text-gray-600">Address: {listing.UnparsedAddress}</p>
          <p className="text-gray-600">Status: {listing.StandardStatus}</p>
          <p className="text-gray-600">Agent: {listing.ListAgentFullName}</p>
          <p className="text-gray-600">Co-Agent: {listing.CoListAgentFullName}</p>
          <p className="text-gray-600">Remarks: {listing.PublicRemarks}</p>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
