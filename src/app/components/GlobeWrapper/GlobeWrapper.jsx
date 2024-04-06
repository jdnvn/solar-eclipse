'use client'

import GlobeComponent from '../GlobeComponent';
import { useEffect, useState } from "react";
import SunObscuration from '../SunObscuration';
import Times from '../Times';
import Citations from '../Citations/Citations';
import EclipseLoader from '../EclipseLoader/EclipseLoader';
import SidePanel from '../SidePanel/SidePanel';
import { BackToCurrentLocationButton, ClickMapTip, GetDirectionsButton, HeaderBar, SelectedLocation, ShowInfoPanelButton } from './styles';
import Drawer from '../Drawer/Drawer';
import { IoMdLocate } from "react-icons/io";
import { FaDirections } from "react-icons/fa";

const ECLIPSE_DATA_PATH = '/api/eclipse_data';

export default function GlobeWrapper() {
  const [currentCoords, setCurrentCoords] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [selectedLocationData, setSelectedLocationData] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [selectedEclipseData, setSelectedEclipseData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [hasClickedMap, setHasClickedMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  useEffect(() => {
    if (typeof window !== undefined) {
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      };

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const fetchEclipseData = async (latitude, longitude) => {
    try {
      const response = await fetch(`${ECLIPSE_DATA_PATH}?latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();
      setSelectedEclipseData(data);
    } catch (error) {
      console.error(error)
    }
  };

  const fetchLocationData = async (latitude, longitude) => {
    try {
      const response = await fetch(`/api/location?latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();
      setSelectedLocationData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = (latitude, longitude) => {
    setLoading(true);
    fetchLocationData(latitude, longitude);
    fetchEclipseData(latitude, longitude);
    setLoading(false);
  };

  useEffect(()  => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentCoords(position.coords);
        fetchData(position.coords.latitude, position.coords.longitude);
      }, (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.log("User denied the request for Geolocation.")
          setLocationPermissionDenied(true);
          setLoading(false);
        }
      });
    }
  }, []);

  const onGlobeClick = (event) => {
    const longitude = event.lngLat.lng;
    const latitude = event.lngLat.lat;
    setSelectedCoords({ latitude, longitude });
    fetchData(latitude, longitude);
    setHasClickedMap(true);
  };

  // TODO: make this open default map app
  const getDirections = () => {
    const url = `https://maps.google.com/maps/dir/${currentCoords.latitude},${currentCoords.longitude}/${selectedCoords.latitude},${selectedCoords.longitude}`;
    window.open(url, '_blank');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const formatAddress = (address) => {
    if (!address) return 'this location';
    const parts = ['city', 'state', 'country'];
    return parts.map(part => address[part]).filter(Boolean).join(', ');
  };

  const selectCurrentLocation = () => {
    setSelectedCoords(null);
    fetchData(currentCoords.latitude, currentCoords.longitude);
  };

  const dataContent = () => (
    <>
      <h2 style={{ textAlign: 'center' }}>Total Solar Eclipse</h2>
      <h4 style={{ margin: '5px 0 1em 0', textAlign: 'center' }}>April 8, 2024</h4>
      {loading ? <EclipseLoader /> : (
        <>
          {selectedLocationData && selectedEclipseData ? (
            <>
              <p style={{ margin: '0 0 1em 0', textAlign: 'center' }}>
                Obscurity: <b>{selectedEclipseData.properties?.obscuration}</b>
              </p>
              {selectedEclipseData.properties && <SunObscuration data={selectedEclipseData.properties} />}
              {selectedEclipseData.properties && <Times data={selectedEclipseData.properties} />}
              <Citations />
            </>
          ) : (
            <>
              {locationPermissionDenied ? <p style={{ margin: 0, textAlign: 'center' }}>Select a point on the map to see eclipse data!</p> : <EclipseLoader />}
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <div style={{ position: 'relative' }}>
      <HeaderBar>
        {selectedLocationData && <SelectedLocation>{formatAddress(selectedLocationData.address)}</SelectedLocation>}
        {!hasClickedMap && !loading && <ClickMapTip>Click the map to get eclipse data!</ClickMapTip>}
      </HeaderBar>
      <div style={{ width: '100vw', height: '100vh' }}>
        <GlobeComponent currentCoords={currentCoords} selectedCoords={selectedCoords} onClick={onGlobeClick} />
      </div>
      {windowWidth > 1000 ? (
        <SidePanel>
          {dataContent()}
        </SidePanel>
      ) : (
        <Drawer isOpen={drawerOpen} toggleDrawer={toggleDrawer}>
          {dataContent()}
        </Drawer>
      )}

      {selectedLocationData && selectedCoords && currentCoords && (
        <GetDirectionsButton onClick={getDirections}>
          <FaDirections />
        </GetDirectionsButton>
      )}
      {selectedCoords && currentCoords && (
        <BackToCurrentLocationButton onClick={selectCurrentLocation}>
          <IoMdLocate />
        </BackToCurrentLocationButton>
      )}
    </div>
  );
}
