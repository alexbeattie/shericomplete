import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import { convertToTitleCase, insertLineBreaks, truncateString } from '../../utils';
import MapComponent from '../../components/MapComponent';

const ListingDetailPage = () => {
  const router = useRouter();
  const { id, endpoint } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`/api/listings-api?id=${id}&statuses=Active,Pending,Closed`);
        if (res.data && res.data.Items && res.data.Items.length > 0) {
          const item = res.data.Items.find(listing => listing.ListingKey === id);
          if (item) {
            setListing(item);
          } else {
            setError('Listing not found');
          }
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        setError('Error fetching listing');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchListing();
    }
  }, [id]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

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

  const mediaUrls = listing.Media ? listing.Media.split(',').map(url => url.trim()) : [];
  const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`;
  const truncatedAddress = truncateString(listing.UnparsedAddress, 60);
  const truncatedRemarks = truncateString(listing.PublicRemarks, 160);

  return (
    <>
      <Head>
        <title>{truncatedAddress} - Listing Details</title>
        <meta name="description" content={`View details about the property located at ${truncatedRemarks}`} />
        <meta name="keywords" content="real estate, property, listing" />
        <meta property="og:title" content={truncatedAddress} />
        <meta property="og:description" content={`View details about the property located at ${truncatedRemarks}`} />
        <meta property="og:image" content={mediaUrls[0] || 'default-image-url'} />
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={truncatedAddress} />
        <meta name="twitter:description" content={`View details about the property located at ${truncatedRemarks}`} />
        <meta name="twitter:image" content={mediaUrls[0] || 'default-image-url'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {mediaUrls.length > 0 ? (
              <div className="slider-container relative">
                <AwesomeSlider bullets={false} infinite={true} transitionDelay={500}>
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="slider-item">
                      <div className="slider-image">
                        <Image
                          src={url}
                          alt={`Image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          onLoadingComplete={handleImageLoad}
                        />
                      </div>
                    </div>
                  ))}
                </AwesomeSlider>
                {imageLoading && <Skeleton height={300} />}
              </div>
            ) : (
              <Skeleton height={300} />
            )}
            <div className="p-4">
              <div className="text-center mb-6">
                <h1 className="text-3xl text-slate-500 font-bold font-fourth">
                  {convertToTitleCase(listing.UnparsedAddress)}
                </h1>
                <p className="text-lg text-slate-500 mt-2 font-fourth">
                  ${listing.MlsStatus === 'Closed' ? listing.ClosePrice.toLocaleString() : listing.ListPrice.toLocaleString()}
                </p>
                <p className="text-lg text-slate-500 mt-2 font-fourth">
                  {listing.MlsStatus}
                </p>
                <p className="text-lg text-slate-500 mt-2 font-fourth">
                  {listing.ListAgentFullName} & {listing.CoListAgentFullName}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="font-fourth text-gray-700 lg:overflow-y-auto lg:max-h-96">
                  <p>{insertLineBreaks(listing.PublicRemarks, 3, 'text-gray-600 mb-4')}</p>
                </div>
                <div className="aspect-h-16">
                  <MapComponent
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
