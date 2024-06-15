import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRuler } from '@fortawesome/free-solid-svg-icons';
import ListingSkeleton from '../components/ListingSkeleton'; // Import the skeleton component
import { convertToTitleCase } from '../utils'; // Import the utility function

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/sold-route');
        const fetchedListings = res.data.Items || [];
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return `${date.toLocaleDateString()}`;
  };

  const renderListing = (listing) => {
    const mediaUrls = listing.Media ? listing.Media.split(',').map((url) => url.trim()) : [];
    const formattedDate = formatDate(listing.ModificationTimestamp);

    return (
      <div key={listing.ListingKey} className="bg-white rounded-lg shadow-md overflow-hidden">
        <Link href={`/listings/${listing.ListingKey}?endpoint=sold`} passHref>
          <Image
            src={mediaUrls.length > 0 ? mediaUrls[0] : 'https://via.placeholder.com/300'}
            alt={listing.ListingKey}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
            priority={true}
          />
        </Link>
        <div className="p-4 text-left">
          <p className="text-slate-500 font-secondary text-balance mt-2 py-2 uppercase text-center">
            {convertToTitleCase(listing.UnparsedAddress)}
          </p>
     
          <div className="text-gray-600 font-secondary flex justify-center items-center space-x-2 whitespace-nowrap px-2">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faBed} className="text-gray-400 mr-1" />
              <span>{listing.BedroomsTotal} Bed</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faBath} className="text-gray-400 mr-1" />
              <span>{listing.BathroomsFull} Bath</span>
            </div>
            {listing.BathroomsHalf > 0 && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faBath} className="text-gray-400 mr-1" />
                <span>{listing.BathroomsHalf} Half Bath</span>
              </div>
            )}
            {listing.LivingArea && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faRuler} className="text-gray-400 mr-1" />
                <span>{listing.LivingArea.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 font-secondary text-center pb-2">
            ${listing.ListPrice.toLocaleString()}
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
          {listings.map(renderListing)}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/sold-route');
    const listings = res.data.Items || [];
    return {
      props: {
        listings,
      },
    };
  } catch (error) {
    console.error('Error fetching listings:', error);
    return {
      props: {
        listings: [],
      },
    };
  }
};

export default ListingsPage;
