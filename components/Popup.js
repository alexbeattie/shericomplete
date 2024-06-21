import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRulerCombined } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from 'react-query';

const fetchListing = async (listingKey) => {
  const response = await fetch(`/api/listings/${listingKey}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


const Popup = ({ firstImageUrl, listing }) => {
  const [loading, setLoading] = useState(true);

  const convertToTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const handleClick = () => {
    router.push(`/listings/${listing.ListingKey}?endpoint=active`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-xs text-center leading-tight">
      <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full">
            <Skeleton height="100%" width="100%" />
          </div>
        )}
        {firstImageUrl && (
          <Image
            src={firstImageUrl}
            alt={`Image of ${listing.UnparsedAddress}`}
            layout="fill"
            objectFit="cover"
            className={`rounded-t-lg transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoadingComplete={() => setLoading(false)}
          />
        )}
      </div>

      <div className="p-4 text-left">
        {/* <h2 className="text-base text-center  text-slate-500 font-third uppercase">
          ${listing.ListPrice.toLocaleString()}
        </h2> */}
        <p className="text-slate-500 text-center uppercase font-fourth text-base my-1 mb-2">
          <span>{convertToTitleCase(listing.UnparsedAddress)}</span> - ${listing.ListPrice.toLocaleString()}

        </p>
        <div className="flex justify-between justify-items-center whitespace-nowrap  mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faBed} className="font-fourth w-5 h-5" />
            <span className="text-slate-500 font-fourth">{listing.BedroomsTotal} bd</span>
          </div>
          <div className="flex items-center font-fourth">
            <FontAwesomeIcon icon={faBath} className="w-5 h-5 font-fourth" />
            <span className="text-slate-500 font-fourth">{listing.BathroomsFull} ba</span>
          </div>
          <div className="flex font-fourth items-center space-x-1">
            <FontAwesomeIcon icon={faRulerCombined} className="w-5 h-5" />
            <span className="text-slate-500 text-center">{listing.LivingArea} sqft</span>
          </div>
        </div>
        <Link href={`/listings/${listing.ListingKey}?endpoint=active`} passHref>
          <p className="text-slate-500 uppercase cursor-pointer mb-4 font-fourth text-center">Details</p>
        </Link>
      </div>
    </div>
  );
};

export default Popup;