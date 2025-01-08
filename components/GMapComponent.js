import { useEffect, useRef } from 'react';

const GMapComponent = ({ listings }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      const google = window.google;
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 27.812098, lng: -82.809512 },
        zoom: 11,
      });

      if (Array.isArray(listings)) {
        listings.forEach((listing) => {
          const { Items } = listing;

          if (Array.isArray(Items)) {
            Items.forEach((item) => {
              if (item.Latitude && item.Longitude) {
                const marker = new google.maps.Marker({
                  position: { lat: item.Latitude, lng: item.Longitude },
                  map,
                  title: item.UnparsedAddress,
                });

                const infoWindow = new google.maps.InfoWindow({
                  content: `
                    <div>
                      <h3>${item.UnparsedAddress}</h3>
                      <p>Price: ${item.ListPrice}</p>
                      <p>Bedrooms: ${item.BedroomsTotal}</p>
                      <p>Bathrooms: ${item.BathroomsTotalInteger}</p>
                    </div>
                  `,
                });

                marker.addListener('click', () => {
                  infoWindow.open(map, marker);
                });
              }
            });
          }
        });
      }
    };

    if (window.google) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initializeMap`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = (error) => {
        console.error('Error loading Google Maps script:', error);
      };
      document.head.appendChild(script);
    }
  }, [listings]);

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }}>Loading map...</div>;
};

export default GMapComponent;