'use client'

import GlobeComponent from './GlobeComponent';
import { useEffect, useState } from "react";
import SunEclipseChart from './SunObscuration';
import Countdown from './Countdown';

const ECLIPSE_DATA_PATH = '/api/eclipse_data';

export default function GlobeWrapper() {
  const [currentCoords, setCurrentCoords] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [eclipseData, setEclipseData] = useState(null);
  const [showPanel, setShowPanel] = useState(true);
  const [timeToEclipse, setTimeToEclipse] = useState(null);

  const calculateTimeToEclipse = (time) => {
    const currentTime = new Date();
    const eclipseTime = new Date(`2024-04-08T${time}Z`);
    const timeToEclipseInMs = eclipseTime - currentTime;
    setTimeToEclipse(timeToEclipseInMs);
  };

  const fetchEclipseData = async (latitude, longitude) => {
    try {
      const response = await fetch(`${ECLIPSE_DATA_PATH}?latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();
      setEclipseData(data);
      calculateTimeToEclipse(data.properties.local_data[1].time);
    } catch (error) {
      console.error(error)
    }
  };

  const fetchLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(`/api/location?latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();
      console.log(data)
      setCurrentLocation(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()  => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        setCurrentCoords(position.coords);
        fetchLocation(position.coords.latitude, position.coords.longitude);
        fetchEclipseData(position.coords.latitude, position.coords.longitude);
      });
    }
  }, []);

  const onGlobeClick = (event) => {
    console.log("onGlobeClick", event)
    const longitude = event.lngLat.lng;
    const latitude = event.lngLat.lat;
    setSelectedCoords({ latitude, longitude });
    fetchLocation(latitude, longitude);
    fetchEclipseData(latitude, longitude);
  };

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/${currentCoords.latitude},${currentCoords.longitude}/${selectedCoords.latitude},${selectedCoords.longitude}`;
    window.open(url, '_blank');
  };

  const closePanel = () => {
    setShowPanel(false);
  };

  const openPanel = () => {
    setShowPanel(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ width: '100vw', height: '100vh' }}>
        <GlobeComponent currentCoords={currentCoords} onGlobeClick={onGlobeClick} />
      </div>
      {showPanel ? (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          bottom: '20px',
          width: '20%',
          // height: '100%',
          overflow: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '2em',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
          borderRadius: '10px'
        }}>
          <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }} onClick={closePanel}>X</button>
          <h1 style={{ margin: '0 0 1em 0', textAlign: 'center' }}>Total Solar Eclipse of April 8, 2024</h1>
          {currentLocation && eclipseData ? (
            <>
              <p style={{ margin: 0, textAlign: 'center' }}>
                {`In ${currentLocation.display_name}`}
              </p>
              <p style={{ margin: 0, textAlign: 'center' }}>
                {`the sun will be obscured by ${eclipseData.properties.obscuration} at totality.`}
              </p>
              {selectedCoords && <button onClick={getDirections}>Get Directions</button>}
              {eclipseData && <SunEclipseChart data={eclipseData?.properties} />}
              {timeToEclipse && <Countdown timeToEclipse={timeToEclipse} />}
            </>
          ) : <p style={{ margin: 0, textAlign: 'center', color: 'black' }}>Loading...</p>}
        </div>
      ) : <button style={{ position: 'fixed', top: '20px', right: '20px' }} onClick={openPanel}>Show Info</button>}
    </div>
  );
}
