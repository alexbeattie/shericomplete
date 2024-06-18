import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import Image from 'next/image';


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

  return (
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
            <Popup>
              <div className="bg-white rounded-lg shadow-lg max-w-xs text-center leading-tight">
                {firstImageUrl && (
                  <div className="w-full h-48 relative">
                    <Image
                      src={firstImageUrl}
                      alt={`Image of ${listing.UnparsedAddress}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                      fetchpriority="high" // Change to lowercase to fix the warning
                    />
                  </div>
                )}
                <div className="p-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">{listing.UnparsedAddress}</h2>
                  <p className="text-gray-600 mb-1">Price: ${formatPrice(listing.ListPrice)}</p>
                  <p className="text-gray-600 mb-1">Status: {listing.MlsStatus}</p>
                  <Link href={`/listings/${listing.ListingKey}?endpoint=active`} passHref>
                    <span className="text-blue-500 cursor-pointer">View Details</span>
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default FullMapComponent;
