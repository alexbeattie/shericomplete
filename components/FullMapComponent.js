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


const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="${color}"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
    </svg>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36]
  });
};

const customIcons = {
  Active: createCustomIcon('#4CAF50'),  // Green
  Pending: createCustomIcon('#FFC107'), // Yellow
  Closed: createCustomIcon('#F44336'),  // Red
};

function ZoomHandler({ setZoom }) {
  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoom(mapEvents.getZoom());
    },
  });
  return null;
}

// const customIcons = {
//   Active: new L.Icon({
//     iconUrl: '/images/letter_a.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//   }),
//   Pending: new L.Icon({
//     iconUrl: '/images/letter_p.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//   }),
//   Closed: new L.Icon({
//     iconUrl: '/images/letter_s.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//   }),
// };

const FullMapComponent = ({ listings, center }) => {
  
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const handlePopupClick = (listing) => {
    let endpoint;
    switch (listing.StandardStatus) {
      case 'Active':
        endpoint = 'active';
        break;
      case 'Pending':
        endpoint = 'pending';
        break;
      case 'Closed':
        endpoint = 'closed';
        break;
      default:
        endpoint = 'active';
    }

    // Navigate to the listing detail page using the listingKey and correct endpoint
    window.location.href = `/listings/${listing.ListingKey}?endpoint=${endpoint}`;
  };

  return (
    <div className="flex justify-center items-center h-screen mt-16">
      <div className="w-full max-w-4xl h-[812px] mb-24">
        <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }} zoomAnimation={true}>
          {/* <ZoomHandler setZoom={setZoom} /> */}
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
                icon={customIcons[listing.StandardStatus] || customIcons.Active}
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