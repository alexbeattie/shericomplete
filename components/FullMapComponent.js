import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup as LeafletPopup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'react-loading-skeleton/dist/skeleton.css';
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

const StatusFilterCheckbox = ({ status, isVisible, setVisibleStatuses }) => {
  const handleCheckboxChange = () => {
    setVisibleStatuses((prevVisibleStatuses) => {
      if (prevVisibleStatuses.includes(status)) {
        return prevVisibleStatuses.filter((s) => s !== status);
      } else {
        return [...prevVisibleStatuses, status];
      }
    });
    return (
      <label className="inline-flex items-center bg-white border rounded-full px-4 py-2 shadow-sm cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md mr-3 mb-3">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={handleCheckboxChange}
          className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out rounded-full"
        />
        <span className={`ml-2 text-sm font-medium ${isVisible ? 'text-blue-600' : 'text-gray-700'}`}>
          {status}
        </span>
      </label>
    );
  };

  return (
    <label className="inline-flex items-center bg-white border rounded-full px-3 py-1 shadow-sm cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md mr-2 mb-2">
      <input
        type="checkbox"
        checked={isVisible}
        onChange={handleCheckboxChange}
        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
      />
      <span className={`ml-2 text-sm font-medium ${isVisible ? 'text-slate-500' : 'text-gray-700'}`}>
        {status}
      </span>
    </label>
  );
};

const FullMapComponent = ({ listings, center }) => {
  const [visibleStatuses, setVisibleStatuses] = useState(['Active', 'Pending', 'Closed']);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    window.location.href = `/listings/${listing.ListingKey}?endpoint=${endpoint}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-16 px-4">
      <div className="w-full max-w-4xl mb-4">
        <button
          className="md:hidden w-full py-2 bg-slate-500 text-white rounded-md mb-2"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
        >
          {isFilterExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
        <div className={`${isFilterExpanded ? 'block' : 'hidden'} md:block`}>
          <div className="flex flex-wrap justify-center mb-4">
            <StatusFilterCheckbox
              status="Active"
              isVisible={visibleStatuses.includes('Active')}
              setVisibleStatuses={setVisibleStatuses}
            />
            <StatusFilterCheckbox
              status="Pending"
              isVisible={visibleStatuses.includes('Pending')}
              setVisibleStatuses={setVisibleStatuses}
            />
            <StatusFilterCheckbox
              status="Closed"
              isVisible={visibleStatuses.includes('Closed')}
              setVisibleStatuses={setVisibleStatuses}
            />
          </div>
        </div>
        <div className="map-wrapper rounded-lg shadow-lg overflow-hidden h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
          
          <MapContainer
            key={visibleStatuses.join(',')}
            center={center}
            zoom={isMobile ? 9 : 10}
            style={{ height: '100%', width: '100%' }}
            zoomAnimation={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {listings.map((listing) => {
              const mediaUrls = listing.Media ? listing.Media.split(',').map(url => url.trim()) : [];
              const firstImageUrl = mediaUrls.length > 0 ? mediaUrls[0] : 'default-image-url';
              if (visibleStatuses.includes(listing.StandardStatus)) {
                return (
                  <Marker
                    key={listing.ListingKey}
                    position={[parseFloat(listing.Latitude), parseFloat(listing.Longitude)]}
                    icon={customIcons[listing.StandardStatus] || customIcons.Active}
                  >
                    <LeafletPopup>
                      <Popup
                        key={listing.ListingKey}
                        firstImageUrl={firstImageUrl}
                        listing={listing}
                        onClick={() => handlePopupClick(listing)}
                      />
                    </LeafletPopup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default FullMapComponent;