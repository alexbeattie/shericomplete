import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Define a Marker component with Font Awesome icon
const Marker = ({ lat, lng, onClick }) => (
  <div
    onClick={onClick}
    style={{
      color: 'red',
      transform: 'translate(-50%, -100%)',
      cursor: 'pointer',
      fontSize: '2rem'
    }}
  >
    <FontAwesomeIcon icon={faMapMarkerAlt} />
  </div>
);



const MapComponent = ({ latitude, longitude }) => {
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (latitude && longitude) {
      setCenter({
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      });
    }
  }, [latitude, longitude]);
  const handleMarkerClick = () => {
    const destination = `${latitude},${longitude}`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(directionsUrl, '_blank');
  };
  // Custom map style
  const mapStyle = [
    {
      
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#523735"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#c9b2a6"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#dcd2be"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ae9e90"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#93817c"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#a5b076"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#447530"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f1e6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fdfcf8"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f8c967"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#e9bc62"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e98d58"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#db8555"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#806b63"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8f7d77"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#ebe3cd"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dfd2ae"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#b9d3c2"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#92998d"
        }
      ]
    }
  ];

  const createMapOptions = (maps) => {
    return {
      styles: mapStyle,
    };
  };
  if (!center) {
    return <div>Loading map...</div>;
  }
  return (
    <div className="map-container">
      <div className="map-wrapper aspect-video">
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }}
          center={center}
          defaultZoom={13}
          options={createMapOptions}
          style={{ height: '100%', width: '100%' }}

        >
          <Marker
            lat={center.lat}
            lng={center.lng}
            onClick={handleMarkerClick}
          />
        </GoogleMapReact>
      </div>
      <style jsx>{`
        .map-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 400px;
        }

        .map-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        @media (max-width: 768px) {
          .map-container {
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
