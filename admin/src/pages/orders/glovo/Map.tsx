/*global google*/
import React, { Component, useEffect, useState } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from "react-google-maps";
function Map ({location}) {
  
  
  const [directions, setDirections] = useState(null)

  useEffect(() => {

    const directionsService = new google.maps.DirectionsService();

    
    directionsService.route(
      {
        origin: location.from,
        destination: location.to,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
    
  }, []) 
  
  const GoogleMapExample = withGoogleMap(props => (
    <GoogleMap
      defaultCenter={{ lat: 38.736946, lng: -9.142685 }}
      defaultZoom={13}
    >
      <DirectionsRenderer
        directions={directions}
      />
       <Marker position={{ lat: location?.courier?.lat, lng:	location?.courier?.lng }} />
    </GoogleMap>
  ));

    return (
      <div>
        <GoogleMapExample
          containerElement={<div style={{ height: `420px`, width: "100%" }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  
}

export default Map;
