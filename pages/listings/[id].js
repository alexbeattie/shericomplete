// pages/listings/[id].js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Slider from 'react-slick';
import { convertToTitleCase, convertAllCapsToNormalCase, insertLineBreaks } from '../lib/utils';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';

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
          // console.log('API response:', res.data);
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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Skeleton height={300} />
          <div className="p-4">
            <h2 className="text-2xl font-semibold"><Skeleton width={200} /></h2>
            <p className="text-gray-600"><Skeleton width={300} /></p>
            <p className="text-gray-600"><Skeleton width={150} /></p>
            <p className="text-gray-600"><Skeleton width={250} /></p>
            <p className="text-gray-600"><Skeleton width={200} /></p>
            <p className="text-gray-600"><Skeleton width={350} /></p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!listing) {
    return <div>No listing found</div>;
  }

  console.log('Rendering listing:', listing);

  const mediaUrls = listing.Media ? listing.Media.split(',').map((url) => url.trim()) : [];
  // const settings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  // };
  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {mediaUrls.length > 0 && (
          <AwesomeSlider bullets={false} infinite={true} transitionDelay={500}>
            {mediaUrls.map((url, index) => (
              <div key={index} className="h-96"> {/* Adjusted height */}
                <div className="h-full">
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    // width={800}
                    // height={600}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            ))}
          </AwesomeSlider>
        )}
        <div className="flex flex-col items-center justify-center p-4">
          <p className="text-gray-600 font-primary italic text-3xl text-center">{convertToTitleCase(listing.UnparsedAddress)}</p>
          <p className="text-gray-600 font-primary text-lg text-center">${listing.ListPrice.toLocaleString()}</p>
          <p className="text-gray-600 font-primary text-lg text-center">{listing.MlsStatus}</p>
          <p className="text-gray-600 font-primary text-lg text-center">{listing.ListAgentFullName} & {listing.CoListAgentFullName}</p>
          <p className="text-gray-600 mb-1 font-primary text-lg text-left">
            {insertLineBreaks(listing.PublicRemarks, 3, 'text-gray-600 mb-4')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
