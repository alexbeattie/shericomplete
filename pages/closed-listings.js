import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRuler } from '@fortawesome/free-solid-svg-icons';
import ListingSkeleton from '../components/ListingSkeleton'; // Import the skeleton component
import { convertToTitleCase } from '../utils'; // Import the utility function

const ClosedListingsPage = () => {
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

  const renderListing = (listing) => {
    const unparsedAddress = listing.UnparsedAddress ? listing.UnparsedAddress.S : '';
    const mediaUrls = listing.Media && listing.Media.S ? listing.Media.S.split(',').map((url) => url.trim()) : [];

    return (
      <div key={listing.ListingKey.S} className="bg-white rounded-lg shadow-md overflow-hidden">
        <Link href={`/listings/${listing.ListingKey.S}?endpoint=sold`} passHref>
          <Image
            src={mediaUrls.length > 0 ? mediaUrls[0] : 'https://via.placeholder.com/300'}
            alt={listing.ListingKey.S}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
            priority={true}
          />
        </Link>
        <div className="p-4 text-left">
          <p className="text-slate-500 font-primary text-balance mt-2 py-2 uppercase text-center">
            {convertToTitleCase(unparsedAddress)}
          </p>
          <div className="text-gray-600 font-primary flex justify-center items-center space-x-2 whitespace-nowrap px-2">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faBed} className="text-gray-400 mr-1" />
              <span>{listing.BedroomsTotal.N} Bed</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faBath} className="text-gray-400 mr-1" />
              <span>{listing.BathroomsFull.N} Bath</span>
            </div>
            {listing.BathroomsHalf && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faBath} className="text-gray-400 mr-1" />
                <span>{listing.BathroomsHalf.N} Half Bath</span>
              </div>
            )}
            {listing.LivingArea && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faRuler} className="text-gray-400 mr-1" />
                <span>{Number(listing.LivingArea.N).toLocaleString()} sqft</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 font-primary text-center pb-2">
            ${Number(listing.ListPrice.N).toLocaleString()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <ListingSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {data.map(renderListing)}
        </div>
      )}
      {lastEvaluatedKey && (
        <button onClick={() => fetchData(lastEvaluatedKey)} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};
// export const getServerSideProps = async () => {
//   try {
//     const res = await axios.get('http://localhost:3000/api/sold-route');
//     const listings = res.data.Items || [];
//     return {
//       props: {
//         listings,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching listings:', error);
//     return {
//       props: {
//         listings: [],
//       },
//     };
//   }
// };

export default ClosedListingsPage;

//   return (
//     <div>
//       <h1>Closed Listings</h1>
//       {data.map((item, index) => (
//         <p key={index}>{JSON.stringify(item, null, 2)}</p>
//       ))}
//       {lastEvaluatedKey && (
//         <button onClick={() => fetchData(lastEvaluatedKey)} disabled={loading}>
//           {loading ? 'Loading...' : 'Load More'}
//         </button>
//       )}
//     </div>
//   );
// }
