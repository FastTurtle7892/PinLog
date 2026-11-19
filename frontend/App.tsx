import { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import PlaceMap from './PlaceMap';

type Coordinates = { latitude: number; longitude: number };
type Place = Coordinates & { placeId: string; name: string; address: string; distanceMeters: number; placeUrl: string };
const fallback: Coordinates = { latitude: 37.4979, longitude: 127.0276 };
const apiBase = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export default function App() {
  const [center, setCenter] = useState<Coordinates>(fallback);
  const [places, setPlaces] = useState<Place[]>([]);
  const [radius, setRadius] = useState(3000);
  const [selected, setSelected] = useState<string>();
  const [status, setStatus] = useState('현재 위치를 확인하는 중이에요.');

  async function search(position: Coordinates, distance: number) {
    setStatus('주변 볼링장을 찾는 중이에요.');
    try {
      const query = new URLSearchParams({ latitude: String(position.latitude), longitude: String(position.longitude), radius: String(distance) });
      const response = await fetch(`${apiBase}/api/bowling-alleys/nearby?${query}`);
      if (!response.ok) throw new Error(`서버 응답 ${response.status}`);
      const result: Place[] = await response.json();
      setPlaces(result);
      setStatus(result.length ? `${result.length}곳을 찾았어요.` : '검색 결과가 없어요. 반경을 넓혀 보세요.');
    } catch (error) {
      setStatus(`검색에 실패했어요: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  function locate() {
    if (Platform.OS !== 'web' || !navigator.geolocation) {
      setStatus('위치를 사용할 수 없어 강남역 부근을 표시해요.');
      void search(fallback, radius);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { const position = { latitude: coords.latitude, longitude: coords.longitude }; setCenter(position); void search(position, radius); },
      () => { setStatus('위치 권한이 없어 강남역 부근을 표시해요.'); void search(fallback, radius); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  useEffect(() => { locate(); }, []);

  return <View style={styles.root}>
    <View style={styles.header}><Text style={styles.brand}>PinLog</Text><Text style={styles.tagline}>내 주변 볼링장</Text></View>
    <View style={styles.content}>
      <View style={styles.sidebar}>
        <Text style={styles.title}>어디에서 볼링칠까?</Text>
        <Text style={styles.subtitle}>현재 위치에서 가까운 볼링장을 찾아보세요.</Text>
        <View style={styles.controls}>
          <Pressable style={styles.locate} onPress={locate}><Text style={styles.locateText}>⌖ 현재 위치</Text></Pressable>
          {[3000, 5000, 10000].map(value => <Pressable key={value} style={[styles.chip, radius === value && styles.activeChip]} onPress={() => { setRadius(value); void search(center, value); }}><Text style={styles.chipText}>{value / 1000}km</Text></Pressable>)}
        </View>
        <Text style={styles.status}>{status}</Text>
        <ScrollView>{places.map(place => <Pressable key={place.placeId} style={[styles.card, selected === place.placeId && styles.selected]} onPress={() => setSelected(place.placeId)}>
          <Text style={styles.placeName}>{place.name}</Text><Text style={styles.address}>{place.address}</Text>
          <View style={styles.cardBottom}><Text style={styles.distance}>{place.distanceMeters}m</Text><Text style={styles.link} onPress={() => Linking.openURL(place.placeUrl)}>카카오맵에서 보기 ↗</Text></View>
        </Pressable>)}</ScrollView>
      </View>
      <View style={styles.map}><PlaceMap center={center} places={places} selected={selected} onSelect={setSelected} /></View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6f8f5' }, header: { height: 74, backgroundColor: '#163c34', justifyContent: 'center', paddingHorizontal: 28 },
  brand: { color: '#fff', fontSize: 24, fontWeight: '800' }, tagline: { color: '#c5ddd3', fontSize: 12 },
  content: { flex: 1, flexDirection: 'row' }, sidebar: { width: 400, padding: 24 }, title: { fontSize: 25, fontWeight: '800', color: '#1c4036' },
  subtitle: { marginTop: 8, color: '#61766b' }, controls: { flexDirection: 'row', gap: 7, marginTop: 22 },
  locate: { backgroundColor: '#208266', padding: 10, borderRadius: 8 }, locateText: { color: '#fff', fontWeight: '700' },
  chip: { backgroundColor: '#e7eee8', padding: 10, borderRadius: 8 }, activeChip: { backgroundColor: '#bde6cf' }, chipText: { color: '#245341', fontWeight: '700' },
  status: { marginTop: 20, marginBottom: 12, color: '#527062' }, card: { backgroundColor: '#fff', padding: 17, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e2e9e3' },
  selected: { borderColor: '#218767' }, placeName: { fontSize: 17, fontWeight: '800', color: '#1d4135' }, address: { color: '#65776e', marginTop: 6 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }, distance: { color: '#18835e', fontWeight: '700' }, link: { color: '#396a59' },
  map: { flex: 1, backgroundColor: '#e7eee8', justifyContent: 'center', alignItems: 'center' }
});
