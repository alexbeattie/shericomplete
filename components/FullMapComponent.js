import React from 'react';
import { MapContainer, TileLayer, Marker, Popup as LeafletPopup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { convertToTitleCase, insertLineBreaks, truncateString } from '../utils';
import Popup from '../components/Popup';

// Custom marker icon for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const FullMapComponent = ({ listings, center }) => {
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const handlePopupClick = (listingKey) => {
    // Navigate to the listing detail page using the listingKey
    window.location.href = `/listings/${listingKey}?endpoint=active`;
  };

  return (
    <div className="flex justify-center items-center h-screen mt-16">
      <div className="w-full max-w-4xl h-[812px] mb-24">
        <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {listings.map((listing) => {
            const mediaUrls = listing.Media ? listing.Media.split(',').map(url => url.trim()) : [];
            const firstImageUrl = mediaUrls.length > 0 ? mediaUrls[0] : 'default-image-url';

            return (
              <Marker
                key={listing.ListingKey}
                position={[parseFloat(listing.Latitude), parseFloat(listing.Longitude)]}
              >
                <LeafletPopup>
                  <Popup key={listing.ListingKey}
                    firstImageUrl={firstImageUrl}
                    listing={listing} onClick={() => handlePopupClick(listing.ListingKey)}
 />
                </LeafletPopup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default FullMapComponent;