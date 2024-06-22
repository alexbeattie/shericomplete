import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRuler } from '@fortawesome/free-solid-svg-icons';
import ListingSkeleton from '../components/ListingSkeleton'; // Import the skeleton component
import { convertToTitleCase } from '../utils'; // Import the utility function
import Head from 'next/head';
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
      <div>
        <Head>
          <title>FLC Team Listings</title>
          <meta name="description" content="Explore the exclusive listings offered by the FLC Team. Find your dream home today." />
          <meta name="keywords" content="real estate, property, listings, exclusive estates, FLC Team" />
          <meta property="og:title" content="FLC Team Listings" />
          <meta property="og:description" content="Explore the available listings offered by the FLC Team. Find your dream home today." />
          <meta property="og:image" content="/images/og-image.jpg" />
          <meta property="og:url" content="https://flcreteam.com/listings" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="FLC Team Listings" />
          <meta name="twitter:description" content="Explore the exclusive listings offered by the FLC Team. Find your dream home today." />
          <meta name="twitter:image" content="/images/og-image.jpg" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div key={listing.ListingKey} className="relative bg-white rounded-lg shadow-md overflow-hidden transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg">
          <Link href={`/listings/${listing.ListingKey}?endpoint=sold`} passHref>
            <Image
              src={mediaUrls.length > 0 ? mediaUrls[0] : 'https://via.placeholder.com/300'}
              alt={listing.ListingKey}
              width={300}
              height={200}
              className="w-full h-60 object-cover"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white font-fourth w-full">
              <div className="flex justify-between items-baseline font-fourth">
                <div>
                  <span className="text-lg font-semibold block leading-tight">
                    {listing.MlsStatus === 'Sold' ? (
                      `$${listing.ClosePrice.toLocaleString()}`
                    ) : (
                      <span className="text-red-500 font-thin italic">Pending</span>
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
