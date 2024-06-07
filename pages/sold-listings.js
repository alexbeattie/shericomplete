// pages/sold-listings.js
import React from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

const ListingsPage = ({ listings }) => {
  const convertToTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => {
          const mediaUrls = listing.Media ? listing.Media.split(",").map((url) => url.trim()) : [];

          return (
            <div key={listing.ListingKey} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link href={`/listings/${listing.ListingKey}?endpoint=sold`}>
                <Image
                  src={mediaUrls.length > 0 ? mediaUrls[0] : 'https://via.placeholder.com/300'}
                  alt={listing.ListingKey}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <span className="text-lg font-semibold cursor-pointer">{listing.ListingKey}</span>
                <p className="text-gray-600">ListPrice: ${listing.ListPrice.toLocaleString()}</p>
                <p className="text-gray-600">ListingKey: {listing.ListingKey}</p>
                <p className="text-gray-600">Address: {convertToTitleCase(listing.UnparsedAddress)}</p>
                <p className="text-gray-600">Status: {listing.StandardStatus}</p>
                <p className="text-gray-600">Agent: {listing.ListAgentFullName}</p>
                <p className="text-gray-600">Co-Agent: {listing.CoListAgentFullName}</p>
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
