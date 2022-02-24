import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

export default function Map({ location, zoomLevel }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GMAP_API_KEY,
  });

  const containerStyle = {
    width: "100%",
    height: "200px",
  };
  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          clickableIcons={false}
          streetViewControl={false}
          center={location}
          zoom={zoomLevel}
        >
          <Marker position={location} />
        </GoogleMap>
      ) : null}
    </div>
  );
}
