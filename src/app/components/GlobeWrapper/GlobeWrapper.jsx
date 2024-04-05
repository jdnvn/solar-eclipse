'use client'

import GlobeComponent from '../GlobeComponent';
import { useEffect, useState } from "react";
import SunObscuration from '../SunObscuration';
import Times from '../Times';
import { CloseButton, PanelContainer, PanelContent } from './styles';

const ECLIPSE_DATA_PATH = '/api/eclipse_data';

export default function GlobeWrapper() {
  const [currentCoords, setCurrentCoords] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [eclipseData, setEclipseData] = useState(null);
  const [showPanel, setShowPanel] = useState(true);

  const fetchEclipseData = async (latitude, longitude) => {
    try {
      const response = await fetch(`${ECLIPSE_DATA_PATH}?latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();
      setEclipseData(data);
    } catch (error) {
      console.error(error)
    }
  };

  const fetchLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(`/api/location?latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();
      setCurrentLocation(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()  => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentCoords(position.coords);
        fetchLocation(position.coords.latitude, position.coords.longitude);
        fetchEclipseData(position.coords.latitude, position.coords.longitude);
      }, (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.log("User denied the request for Geolocation.")
          setLocationPermissionDenied(true);
        }
      });
    }
  }, []);

  const onGlobeClick = (event) => {
    const longitude = event.lngLat.lng;
    const latitude = event.lngLat.lat;
    setSelectedCoords({ latitude, longitude });
    fetchLocation(latitude, longitude);
    fetchEclipseData(latitude, longitude);
  };

  // TODO: make this open default map app
  const getDirections = () => {
    const url = `https://maps.google.com/maps/dir/${currentCoords.latitude},${currentCoords.longitude}/${selectedCoords.latitude},${selectedCoords.longitude}`;
    window.open(url, '_blank');
  };

  const closePanel = () => {
    setShowPanel(false);
  };

  const openPanel = () => {
    setShowPanel(true);
  };

  const formatAddress = (address) => {
    if (!address) return 'this location';
    const parts = ['road', 'suburb', 'city', 'state', 'country'];
    return parts.map(part => address[part]).filter(Boolean).join(', ');
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ width: '100vw', height: '100vh' }}>
        <GlobeComponent currentCoords={currentCoords} onClick={onGlobeClick} selectedCoords={selectedCoords} />
      </div>
      {showPanel ? (
        <PanelContainer>
          <PanelContent>
            <CloseButton>X</CloseButton>
            <h1 style={{ textAlign: 'center' }}>Total Solar Eclipse</h1>
            <h3 style={{ margin: '0 0 1em 0', textAlign: 'center' }}>April 8, 2024</h3>
            {currentLocation && eclipseData ? (
              <>
                <p style={{ margin: 0, textAlign: 'center' }}>
                  {`In ${formatAddress(currentLocation.address)}`}
                </p>
                <p style={{ margin: '0 0 1em 0', textAlign: 'center' }}>
                  the sun will be obscured by <b>{eclipseData.properties?.obscuration}</b>
                </p>
                {selectedCoords && <button onClick={getDirections}>Get Directions</button>}
                {eclipseData.properties && <SunObscuration data={eclipseData.properties} />}
                {eclipseData.properties && <Times data={eclipseData.properties} />}
              </>
            ) : (
              <>
                {locationPermissionDenied ? <p style={{ margin: 0, textAlign: 'center' }}>Select a point on the map to see eclipse data!</p> : <p style={{ margin: 0, textAlign: 'center' }}>Loading...</p>}
              </>
            )}
          </PanelContent>
        </PanelContainer>
      ) : <button style={{ position: 'fixed', top: '20px', right: '20px' }} onClick={openPanel}>Show Info</button>}
    </div>
  );
}
