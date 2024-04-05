'use client'

import { useEffect, useRef, useState } from 'react';
import { NORTHERN_LIMIT_COORDS, SOUTHERN_LIMIT_COORDS, CENTRAL_LINE_COORDS } from '../constants';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function GlobeComponent({ currentCoords, onClick, selectedCoords }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const addPolygon = (id, coords) => {
    map.current.addSource(id, {
      'type': 'geojson',
      'data': {
          'type': 'Feature',
          'geometry': {
              'type': 'Polygon',
              'coordinates': coords
          }
      }
    });

    map.current.addLayer({
      'id': id,
      'type': 'fill',
      'source': id,
      'layout': {},
      'paint': {
        'fill-color': '#000000',
        'fill-opacity': 0.2
      }
    });
  }

  const onGlobeLoad = () => {
    addPolygon('zone_of_totality', [[...NORTHERN_LIMIT_COORDS, ...SOUTHERN_LIMIT_COORDS.reverse()]]);
    map.current.addSource('moon', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': CENTRAL_LINE_COORDS[0]
        }
      }
    });
    map.current.addLayer({
      'id': 'moon',
      'source': 'moon',
      'type': 'circle',
      'paint': {
        'circle-color': '#000000',
        'circle-radius': 8,
      }
    })
    let counter = 0;
    setInterval(() => {
      map.current.getSource('moon').setData({
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': CENTRAL_LINE_COORDS[counter]
        }
      });
      counter = (counter + 1) % CENTRAL_LINE_COORDS.length;
    }, 1000);
  };

  const onGlobeClick = (e) => {
    map.current.flyTo({
      center: [e.lngLat.lng, e.lngLat.lat],
      speed: 0.5
    });
    if (map.current.getSource('current_point')) {
      map.current.removeLayer('current_point');
      map.current.removeSource('current_point');
    }

    map.current.addSource('current_point', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [e.lngLat.lng, e.lngLat.lat]
        },
      }
    });
    // Add a circle layer
    map.current.addLayer({
      'id': 'current_point',
      'type': 'circle',
      'source': 'current_point',
      'paint': {
        'circle-color': '#4264fb',
        'circle-radius': 5,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });
    onClick(e);
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
      const size = 100;

      // This implements `StyleImageInterface`
      // to draw a pulsing dot icon on the map.
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function () {
          const canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext('2d');
        },

        // Call once before every frame where the icon will be used.
        render: function () {
          const duration = 1000;
          const t = (performance.now() % duration) / duration;

          const radius = (size / 2) * 0.3;
          const outerRadius = (size / 2) * 0.7 * t + radius;
          const context = this.context;

          // Draw the outer circle.
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          context.fillStyle = `rgba(255, 260, 342, ${1 - t})`;
          context.fill();

          // Draw the inner circle.
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            radius,
            0,
            Math.PI * 2
          );
          context.fillStyle = 'rgba(29, 160, 242, 1)';
          context.strokeStyle = 'white';
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          // Update this image's data with data from the canvas.
          this.data = context.getImageData(
            0,
            0,
            this.width,
            this.height
          ).data;

          // Continuously repaint the map, resulting
          // in the smooth animation of the dot.
          map.current.triggerRepaint();

          // Return `true` to let the map know that the image was updated.
          return true;
        }
      };
      map.current.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
      // add user location marker
      map.current.addSource('point', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [currentCoords.longitude, currentCoords.latitude]
              }
            }
          ]
        }
      });
      map.current.addLayer({
        'id': 'point',
        'type': 'symbol',
        'source': 'point',
        'layout': {
          'icon-image': 'pulsing-dot'
        }
      });
    }
  }, [currentCoords]);

  return <div ref={mapContainer} style={{ width: "100vw", height: "100vh" }} />;
}
