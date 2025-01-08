import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';
import { convertToTitleCase, insertLineBreaks, truncateString } from '../../utils';
import dynamic from 'next/dynamic';
import SimpleSlider from '@/components/SimpleSlider';

const MapWithNoSSR = dynamic(
  () => import('../../components/SimpleMapComponent'),
  { ssr: false }
);

const ListingDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`/api/listings-api?id=${id}&statuses=Active,Pending,Closed`);
        if (res.data?.Items?.length) {
          const item = res.data.Items.find((listing) => listing.ListingKey === id);
          setListing(item || null);
          setError(item ? null : 'Listing not found');
        } else {
          setError('Listing not found');
        }
      } catch {
        setError('Error fetching listing');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton height={300} />
        <div className="p-4">
          <h2 className="text-2xl font-semibold"><Skeleton width={200} /></h2>
          <Skeleton width={300} count={3} />
        </div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;
  if (!listing) return <div>No listing found</div>;

  const mediaUrls = listing.Media?.split(',').map((url) => url.trim()) || [];
  const truncatedAddress = truncateString(listing.UnparsedAddress, 60);
  const truncatedRemarks = truncateString(listing.PublicRemarks, 160);

  return (
    <>
      <Head>
        <title>{truncatedAddress} - Listing Details</title>
        <meta name="description" content={`View details about the property located at ${truncatedRemarks}`} />
        <meta property="og:image" content={mediaUrls[0] || '/default-image.jpg'} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`} />
      </Head>

      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="slider-container relative w-full h-[400px] bg-gray-200 overflow-hidden">
              {mediaUrls.length > 0 ? (
                <SimpleSlider images={mediaUrls} />
              ) : (
                <Skeleton height={400} />
              )}
            </div>

            <div className="p-4">
              <div className="text-center mb-6">
                <h1 className="text-3xl text-slate-500 font-bold">
                  {convertToTitleCase(listing.UnparsedAddress)}
                </h1>
                <p className="text-lg text-slate-500 mt-2">
                  ${listing.MlsStatus === 'Closed'
                    ? listing.ClosePrice.toLocaleString()
                    : listing.ListPrice.toLocaleString()}
                </p>
                <p className="text-lg text-slate-500 mt-2">{listing.MlsStatus}</p>
                {listing.ListAgentFullName && (
                  <p className="text-lg text-slate-500 mt-2">
                    {listing.ListAgentFullName}
                    {listing.CoListAgentFullName && ` & ${listing.CoListAgentFullName}`}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="text-gray-700">
                  <p>{insertLineBreaks(listing.PublicRemarks, 3, 'mb-4')}</p>
                </div>
                <div>
                  <MapWithNoSSR
                    latitude={listing.Latitude}
                    longitude={listing.Longitude}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default ListingDetailPage;
