import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import { convertToTitleCase, insertLineBreaks } from '../../utils'; // Adjust the path as needed
import MapComponent from '../../components/MapComponent'; // Adjust the path as needed
import { truncateString } from '../../utils';
const ListingDetailPage = () => {
  const router = useRouter();
  const { id, endpoint } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (id && endpoint) {
      const fetchListing = async () => {
        try {
          const apiEndpoint = endpoint === 'sold' ? '/api/sold-route' : '/api/available-route';
          const res = await axios.get(`${apiEndpoint}?id=${id}`);
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

  const extractTitleFromUrl = (url) => {
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    return fileName.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, ''); // Replace dashes and underscores, and remove file extension
  };

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

  console.log('Rendering listing:', listing);

  const mediaUrls = listing.Media ? listing.Media.split(',').map((url) => url.trim()) : [];
  const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`;
  const truncatedRemarks = truncateString(listing.PublicRemarks, 60); // Adjust the length as needed

  return (
    <>
      <Head>
        <title>{listing.UnparsedAddress} - Listing Details</title>
        <meta name="description" content={`View details about the property located at ${truncatedRemarks}`} />
        <meta name="keywords" content="real estate, property, listing" />
        <meta property="og:title" content={truncatedRemarks} />
        <meta property="og:description" content={`View details about the property located at ${truncatedRemarks}`} />
        <meta property="og:image" content={mediaUrls[0] || 'default-image-url'} />
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={listing.UnparsedAddress} />
        <meta name="twitter:description" content={`View details about the property located at ${truncatedRemarks}`} />
        <meta name="twitter:image" content={mediaUrls[0] || 'default-image-url'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {mediaUrls.length > 0 ? (
              <div className="slider-container relative">
                {imageLoading && <Skeleton height={300} />}
                <AwesomeSlider bullets={false} infinite={true} transitionDelay={500}>
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="slider-item">
                      <div className="slider-image">
                        <Image
                          src={url}
                          alt={extractTitleFromUrl(url)}
                          layout="fill"
                          objectFit="cover"
                          onLoadingComplete={handleImageLoad}
                        />
                      </div>
                      <div className="slider-caption p-2 text-center text-gray-700">
                        {extractTitleFromUrl(url)}
                      </div>
                    </div>
                  ))}
                </AwesomeSlider>
              </div>
            ) : (
              <Skeleton height={300} />
            )}
            <div className="p-4">
              <div className="text-center mb-6">
                <h1 className="text-3xl text-slate-500 font-bold font-secondary">
                  {convertToTitleCase(listing.UnparsedAddress)}
                </h1>
                <p className="text-lg text-slate-500 mt-2 font-secondary">
                  ${listing.ListPrice.toLocaleString()}
                </p>
                <p className="text-lg text-slate-500 mt-2 font-secondary">
                  {listing.MlsStatus}
                </p>
                <p className="text-lg text-slate-500 mt-2 font-secondary">
                  {listing.ListAgentFullName} & {listing.CoListAgentFullName}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="font-secondary text-gray-700 lg:overflow-y-auto lg:max-h-96">
                  <p>{insertLineBreaks(listing.PublicRemarks, 3, 'text-gray-600 mb-4')}</p>
                </div>
                <div className="aspect-h-16">
                  <MapComponent
                    latitude={listing.Latitude}
                    longitude={listing.Longitude}
                    setMapLoading={setMapLoading}
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
