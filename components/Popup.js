import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRulerCombined } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-xs text-center leading-tight">
      {firstImageUrl && (
        <div className="relative w-full h-0 pb-[56.25%]"> {/* 16:9 Aspect Ratio */}
          {loading && <Skeleton height="100%" />}
          <Image
            src={firstImageUrl}
            alt={`Image of ${listing.UnparsedAddress}`}
            layout="fill"
            objectFit="cover"
            className={`rounded-t-lg transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoadingComplete={() => setLoading(false)}
          />
        </div>
      )}

      <div className="p-2 text-left">
        {/* <h2 className="text-base text-center  text-slate-500 font-third uppercase">
          ${listing.ListPrice.toLocaleString()}
        </h2> */}
        <p className="text-slate-500 text-center uppercase font-third text-base my-1 mb-2">
          <span>{convertToTitleCase(listing.UnparsedAddress)}</span> - ${listing.ListPrice.toLocaleString()}

        </p>
        <div className="flex justify-between items-center whitespace-nowrap space-x-4 mb-2">
          <div className="flex items-center space-x-1 space">
            <FontAwesomeIcon icon={faBed} className="w-5 h-5" />
            <span className="text-slate-500">{listing.BedroomsTotal} bd</span>
          </div>
          <div className="flex items-center space-x-1">
            <FontAwesomeIcon icon={faBath} className="w-5 h-5" />
            <span className="text-slate-500">{listing.BathroomsFull} ba</span>
          </div>
          <div className="flex items-center space-x-1">
            <FontAwesomeIcon icon={faRulerCombined} className="w-5 h-5" />
            <span className="text-slate-500 text-center">{listing.LivingArea} sqft</span>
          </div>
        </div>
        <Link href={`/listings/${listing.ListingKey}?endpoint=active`} passHref>
          <p className="text-slate-500 uppercase cursor-pointer mb-4 text-center">Details</p>
        </Link>
      </div>
    </div>
  );
};

export default Popup;