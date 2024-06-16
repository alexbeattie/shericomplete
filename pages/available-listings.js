import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRuler } from '@fortawesome/free-solid-svg-icons';
import ListingSkeleton from '../components/ListingSkeleton'; // Import the skeleton component

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [listingstwo, setListingstwo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/available-route');
        const restwo = await axios.get('/api/fetch-listings');
        let fetchedListings = res.data.Items || [];
        let fetchedListingstwo = restwo.data.Items || [];

        fetchedListings = fetchedListings.sort((a, b) => b.ListPrice - a.ListPrice);
        fetchedListingstwo = fetchedListingstwo.sort((a, b) => b.ListPrice - a.ListPrice);

        setListings(fetchedListings);
        setListingstwo(fetchedListingstwo);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const convertToTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return `${date.toLocaleDateString()}`;
  };

  const renderListing = (listing) => {
    const mediaUrls = listing.Media ? listing.Media.split(',').map((url) => url.trim()) : [];
    const formattedDate = formatDate(listing.ModificationTimestamp);

    return (
      <div key={listing.ListingKey} className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <Link href={`/listings/${listing.ListingKey}?endpoint=active`} passHref>
            <Image
              src={mediaUrls.length > 0 ? mediaUrls[0] : 'https://via.placeholder.com/300'}
              alt={listing.ListingKey}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white font-secondary w-full">
              <div className="flex justify-between items-baseline font-secondary">
                <div>
                  <span className="text-lg font-semibold block leading-tight">
                    {listing.MlsStatus === 'Active' ? (
                      `$${listing.ListPrice.toLocaleString()}`
                    ) : (
                      <span className="text-red-500 font-extrabold italic">Pending</span>
                    )}
                  </span>
                  <span className="block leading-tight">{convertToTitleCase(listing.UnparsedAddress)}</span>
                  <span className="block leading-tight">{convertToTitleCase(listing.City)}, {convertToTitleCase(listing.StateOrProvince)} {listing.PostalCode}</span>
                </div>
                <div className="text-right leading-tight">
                  <div className="flex items-center justify-end">
                    <FontAwesomeIcon icon={faBed} className="text-gray-400 mr-1" />
                    <span>{listing.BedroomsTotal} Bed</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <FontAwesomeIcon icon={faBath} className="text-gray-400 mr-1" />
                    <span>{listing.BathroomsFull} Bath</span>
                  </div>
                  {listing.BathroomsHalf > 0 && (
                    <div className="flex items-center justify-end">
                      <FontAwesomeIcon icon={faBath} className="text-gray-400 mr-1" />
                      <span>{listing.BathroomsHalf} Half Bath</span>
                    </div>
                  )}
                  {listing.LivingArea && (
                    <div className="flex items-center justify-end">
                      <FontAwesomeIcon icon={faRuler} className="text-gray-400 mr-1" />
                      <span>{listing.LivingArea.toLocaleString()} sqft</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
         
        </Link>
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
          {listingstwo.map(renderListing)}
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
