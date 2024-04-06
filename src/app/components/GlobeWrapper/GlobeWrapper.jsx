'use client'

import GlobeComponent from '../GlobeComponent';
import { useEffect, useState } from "react";
import SunObscuration from '../SunObscuration';
import Times from '../Times';
import Citations from '../Citations/Citations';
import EclipseLoader from '../EclipseLoader/EclipseLoader';
import SidePanel from '../SidePanel/SidePanel';
import { TitleInfo, BackToCurrentLocationButton, ClickMapTip, GetDirectionsButton, HeaderBar, SelectedLocation, FunFactContainer } from './styles';
import Drawer from '../Drawer/Drawer';
import { IoMdLocate } from "react-icons/io";
import { FaDirections } from "react-icons/fa";
import { AI_FACTS } from '../../constants';

const ECLIPSE_DATA_PATH = '/api/eclipse_data';

export default function GlobeWrapper({ randomFacts }) {
  const [currentCoords, setCurrentCoords] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [selectedLocationData, setSelectedLocationData] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [selectedEclipseData, setSelectedEclipseData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [hasClickedMap, setHasClickedMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
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
    if (!address) return 'Unknown Location';
    const parts = ['city', 'state', 'country'];
    return parts.map(part => address[part]).filter(Boolean).join(', ');
  };

  const selectCurrentLocation = () => {
    setSelectedCoords(null);
    fetchData(currentCoords.latitude, currentCoords.longitude);
  };

  const dataContent = () => (
    <>
      {loading ? <EclipseLoader /> : (
        <>
          {selectedEclipseData?.properties ? (
            <>
              <p style={{ color: "#bababa" }}>
                Obscuration
              </p>
              <p style={{ fontSize: "30px" }}>
                {selectedEclipseData.properties?.obscuration === "100.0%" ? "100%" : selectedEclipseData.properties?.obscuration}
              </p>
              <p style={{ fontSize: "12px" }}>
                {selectedEclipseData.properties?.obscuration === "100.0%" && "Totally Obscured! 🤘"}
              </p>
              {selectedEclipseData.properties && <SunObscuration data={selectedEclipseData.properties} />}
              {selectedEclipseData.properties && <Times data={selectedEclipseData.properties} />}
              <p style={{ color: "#bababa", marginTop: "20px" }}>
                Eclipse Facts
              </p>
              {randomFacts.map((fact, index) => {
                return <FunFactContainer key={index}><p style={{ textAlign: "left", fontSize: "12px" }}>{fact}</p></FunFactContainer>;
              })}
              <p style={{ color: "#3b3b3b", opacity: "40%", marginTop: "10px" }}>____</p>
              <Citations />
            </>
          ) : (
            <>
                {locationPermissionDenied || selectedCoords ? <><p>No data available</p><p style={{ fontSize: "12px" }}>Tip: Select a location on the path of totality.</p></> : <EclipseLoader />}
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
      {windowWidth && windowWidth > 1000 ? (
        <SidePanel>
          {dataContent()}
        </SidePanel>
      ) : (
        <Drawer isOpen={drawerOpen} toggleDrawer={toggleDrawer}>
          {dataContent()}
        </Drawer>
      )}

      {selectedLocationData && selectedCoords && currentCoords && (
        <GetDirectionsButton onClick={getDirections} title="get directions">
          <FaDirections />
        </GetDirectionsButton>
      )}
      {selectedCoords && currentCoords && (
        <BackToCurrentLocationButton onClick={selectCurrentLocation} title="jump to current location">
          <IoMdLocate />
        </BackToCurrentLocationButton>
      )}
    </div>
  );
}
