// pages/sold-listings.js
import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faPhone, faBed, faBathtub, faBath } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const ListingsPage = ({ listings }) => {
  const convertToTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return `${date.toLocaleDateString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => {
          const mediaUrls = listing.Media ? listing.Media.split(",").map((url) => url.trim()) : [];
          // const formattedDate = moment(listing.ModificationTimestamp).format('MMMM Do, YYYY h:mm:ss A');
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
                  />
              
              </Link>
              <div className="p-4 text-left">
                <p className="text-gray-600 text-center">{formattedDate}</p>

                {/* <p className="text-gray-600 text-center">{listing.ModificationTimestamp}</p> */}
                <p className="text-gray-600 text-center">{convertToTitleCase(listing.UnparsedAddress)}</p>
                <div className="text-gray-600 flex flex-wrap justify-center items-center space-x-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faBed} className="text-gray-400 mr-1" />
                    <span>{listing.BedroomsTotal} Bed</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faBath} className="text-gray-400 mr-1" />
                    <span>{listing.BathroomsFull} Bath</span>
                  </div>
                  {listing.BathroomsHalf && (
                    <>
                      <span>•</span>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBath} className="text-gray-400 mr-1" />
                        <span>{listing.BathroomsHalf} Half Bath</span>
                      </div>
                    </>
                  )}
                  {listing.LivingArea && (
                    <>
                      <span>• {listing.LivingArea.toLocaleString()} sqft</span>
                    </>
                  )}
                </div>
                <p className="text-gray-600 text-center">{listing.MlsStatus}</p>
              </div>
            </div>
          );
        })}
      </div>
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
