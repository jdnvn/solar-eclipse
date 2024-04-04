'use client'

import { useEffect, useRef, useState } from 'react';
import { NORTHERN_LIMIT_COORDS, SOUTHERN_LIMIT_COORDS } from '../constants';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function GlobeComponent({ currentCoords, onGlobeClick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const addPath = (id, coords) => {
    map.current.addSource(id, {
      'type': 'geojson',
      'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
              'type': 'LineString',
              'coordinates': coords
          }
      }
    });

    map.current.addLayer({
      'id': id,
      'type': 'line',
      'source': id,
      'layout': {
          'line-join': 'round',
          'line-cap': 'round'
      },
      'paint': {
          'line-color': '#888',
          'line-width': 1
      }
  });
  };

  const onGlobeLoad = () => {
    addPath('northern_limit', NORTHERN_LIMIT_COORDS);
    addPath('southern_limit', SOUTHERN_LIMIT_COORDS);
  };

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-94.68833333, 32.72333333],
      zoom: 2,
      antialias: true
    });
    map.current.on('click', onGlobeClick);
    map.current.on('load', onGlobeLoad);
  }, []);

  useEffect(() => {
    if (map.current && currentCoords?.latitude && currentCoords?.longitude) {
      // add user location marker
      map.current.addSource('point', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [currentCoords.longitude, currentCoords.latitude]
          }
        }
      });
      map.current.addLayer({
        'id': 'point',
        'type': 'circle',
        'source': 'point',
        'paint': {
          'circle-radius': 5,
          'circle-color': '#1da1f2',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });
    }
  }, [currentCoords]);

  return <div ref={mapContainer} style={{ width: "100vw", height: "100vh" }} />;
}