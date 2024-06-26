//page/index.js
import React from 'react';
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
              <Link href={`/listings/${listing.ListingKey}`}>
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
                {/* <p className="text-gray-600">ListingKey: {listing.ListingKey}</p> */}
                <p className="text-gray-600">Address: {convertToTitleCase(listing.UnparsedAddress)}</p>
                <p className="text-gray-600">Address: {listing.BedFull}</p>

                <p className="text-gray-600">Status: {listing.StandardStatus}</p>
                {/* <p className="text-gray-600">Agent: {listing.ListAgentFullName}</p>
                <p className="text-gray-600">Co-Agent: {listing.CoListAgentFullName}</p> */}
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
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api/hello';

    // Make an HTTP request to the API route
    const response = await fetch(apiUrl, {
      headers: {
        'Cookie': req.headers.cookie || ''
      }
    });
    const data = await response.json();

    // Get the listings data from the response
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
        listings: [], // Return an empty array or an appropriate fallback value
      },
    };
  }
};

export default ListingsPage;