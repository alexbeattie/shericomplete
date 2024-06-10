// pages/available-listings.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faPhone, faBed, faBathtub, faBath, faRuler } from '@fortawesome/free-solid-svg-icons';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {listings.map((listing) => {
          const mediaUrls = listing.Media ? listing.Media.split(",").map((url) => url.trim()) : [];
          // const formattedDate = moment(listing.ModificationTimestamp).format('MMMM Do, YYYY h:mm:ss A');
          const formattedDate = formatDate(listing.ModificationTimestamp);

          return (
            <div key={listing.ListingKey} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link href={`/listings/${listing.ListingKey}?endpoint=active`} passHref>
                <Image
                  src={mediaUrls.length > 0 ? mediaUrls[0] : 'https://via.placeholder.com/300'}
                  alt={listing.ListingKey}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                  priority={true}
                />
              </Link>
              <div className="text-left">
                <p className="text-slate-500 font-primary text-balance mt-2 py-2 uppercase text-center">{convertToTitleCase(listing.UnparsedAddress)}</p>
                <div className="text-gray-600 font-primary flex justify-center items-center space-x-2 whitespace-nowrap px-2">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faBed} className="text-slate-400 mr-1" />
                    <span>{listing.BedroomsTotal} Bed</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faBath} className="text-slate-400 mr-1" />
                    <span>{listing.BathroomsFull} Bath</span>
                  </div>
                  {listing.BathroomsHalf && (
                    <>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBath} className="text-gray-400 mr-1" />
                        <span>{listing.BathroomsHalf} Half Bath</span>
                      </div>
                    </>
                  )}
                  {listing.LivingArea && (
                    <>
                      <FontAwesomeIcon icon={faRuler} className="text-gray-400 mr-1" />
                      <span>{listing.LivingArea.toLocaleString()} sqft</span>
                    </>
                  )}
                </div>
                <p className="text-gray-600 font-primary text-center pb-2">
                  <>
                    {listing.MlsStatus === 'Active' ? (
                      <span>${listing.ListPrice.toLocaleString()}</span>
                    ) : (
                      <span className="text-red-500 font-thin italic">Pending</span>
                    )}
                  </>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  try {
    const { req } = context;
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api/available-route';

    const response = await fetch(apiUrl, {
      headers: {
        'Cookie': req.headers.cookie || ''
      }
    });
    const data = await response.json();

    const listings = data.Items || [];

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