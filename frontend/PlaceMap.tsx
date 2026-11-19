import { useEffect, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';

type Coordinates = { latitude: number; longitude: number };
type Place = Coordinates & { placeId: string; name: string };
type Props = { center: Coordinates; places: Place[]; selected?: string; onSelect: (id: string) => void };

declare global {
  interface Window { L?: any }
}

let leafletReady: Promise<any> | undefined;
function loadLeaflet(): Promise<any> {
  if (window.L) return Promise.resolve(window.L);
  if (!leafletReady) {
    leafletReady = new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve(window.L);
      script.onerror = () => reject(new Error('지도 라이브러리를 불러오지 못했어요.'));
      document.head.appendChild(script);
    });
  }
  return leafletReady;
}

export default function PlaceMap({ center, places, selected, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any>(null);
  const selectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);
  selectRef.current = onSelect;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    let active = true;
    void loadLeaflet().then(L => {
      if (!active || !container.current || map.current) return;
      map.current = L.map(container.current).setView([center.latitude, center.longitude], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map.current);
      markers.current = L.layerGroup().addTo(map.current);
      setReady(true);
    }).catch(() => {});
    return () => { active = false; map.current?.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    if (!map.current || !window.L || !markers.current) return;
    const L = window.L;
    markers.current.clearLayers();
    const selectedPlace = places.find(place => place.placeId === selected);
    const focus = selectedPlace ?? center;
    map.current.setView([focus.latitude, focus.longitude], selectedPlace ? 15 : 13);
    L.circleMarker([center.latitude, center.longitude], { radius: 7, color: '#174fcb', fillColor: '#4b83ef', fillOpacity: 1 })
      .bindTooltip('검색 중심').addTo(markers.current);
    places.forEach(place => {
      L.circleMarker([place.latitude, place.longitude], {
        radius: place.placeId === selected ? 11 : 8,
        color: '#fff', weight: 2, fillColor: '#188465', fillOpacity: 1
      }).bindTooltip(place.name).on('click', () => selectRef.current(place.placeId)).addTo(markers.current);
    });
  }, [center, places, selected, ready]);

  if (Platform.OS !== 'web') return <View><Text>앱 지도는 이후 플랫폼에 맞게 연결합니다.</Text></View>;
  return <div ref={container} style={{ width: '100%', height: '100%' }} />;
}
