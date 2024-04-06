'use client'

import { useEffect, useRef } from 'react';
import { NORTHERN_LIMIT_COORDS, SOUTHERN_LIMIT_COORDS, CENTRAL_LINE_COORDS, TIMES } from '../constants';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Times from './Times';

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
    });

    // real time moon tracker babay
    let currentTime = new Date();
    let startTime = new Date(`2024-04-08T${TIMES[0]}Z`);
    let endTime = new Date(`2024-04-08T${TIMES[TIMES.length - 1]}Z`);

    if (currentTime >= startTime && currentTime <= endTime) {
      const timeDiffs = TIMES.map((time) => Math.abs(currentTime - new Date(`2024-04-08T${time}Z`)));
      let currentIndex = timeDiffs.indexOf(Math.min(...timeDiffs));
      let counter = currentIndex;
      setInterval(() => {
        if (counter < TIMES.length) {
          map.current.getSource('moon').setData({
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': CENTRAL_LINE_COORDS[counter]
            }
          });

          if (counter + 1 < TIMES.length && new Date() >= new Date(`2024-04-08T${TIMES[counter + 1]}`))
            counter = counter + 1
        }
      }, 1000);
    }
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

  const addUserLocationMarker = () => {
    const size = 100;

    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      render: function () {
        const duration = 2000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.5 * t + radius;
        const context = this.context;

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

        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;

        map.current.triggerRepaint();

        return true;
      }
    };
    map.current.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
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
  };

  useEffect(() => {
    if (map.current && currentCoords?.latitude && currentCoords?.longitude) {
      const waiting = () => {
        if (!map.current.isStyleLoaded()) {
          setTimeout(waiting, 200);
        } else {
          addUserLocationMarker();
        }
      };
      waiting();
    }
  }, [currentCoords]);

  useEffect(() => {
    if (selectedCoords === null && map?.current?.getSource('current_point')) {
      map.current.removeLayer('current_point');
      map.current.removeSource('current_point');
      if (currentCoords) {
        map.current.flyTo({
          center: [currentCoords.longitude, currentCoords.latitude],
          speed: 0.5
        });
      }
    }
  }, [selectedCoords]);

  return (
    <div ref={mapContainer} style={{ width: "100vw", height: "100vh" }} />
  );
}
