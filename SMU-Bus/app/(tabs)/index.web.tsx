import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bus, Users, Clock, Video, RefreshCw, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface BusLocation {
  id: string;
  routeName: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  capacity: number;
  nextStop: string;
  eta: number;
}

interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  routes: string[];
}

export default function LiveTrackingScreen() {
  const [buses, setBuses] = useState<BusLocation[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  const [showCCTV, setShowCCTV] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const busStops: BusStop[] = [
    { id: '1', name: '정문', latitude: 37.5665, longitude: 126.9780, routes: ['A노선', 'B노선'] },
    { id: '2', name: '도서관', latitude: 37.5675, longitude: 126.9790, routes: ['A노선'] },
    { id: '3', name: '학생회관', latitude: 37.5685, longitude: 126.9800, routes: ['B노선'] },
    { id: '4', name: '공학관', latitude: 37.5695, longitude: 126.9810, routes: ['A노선', 'B노선'] },
  ];

  const mockBuses: BusLocation[] = [
    {
      id: 'bus1',
      routeName: 'A노선',
      latitude: 37.5670,
      longitude: 126.9785,
      heading: 45,
      speed: 25,
      capacity: 75,
      nextStop: '도서관',
      eta: 3
    },
    {
      id: 'bus2',
      routeName: 'B노선',
      latitude: 37.5680,
      longitude: 126.9795,
      heading: 180,
      speed: 30,
      capacity: 45,
      nextStop: '학생회관',
      eta: 5
    }
  ];

  useEffect(() => {
    setBuses(mockBuses);
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => ({
        ...bus,
        latitude: bus.latitude + (Math.random() - 0.5) * 0.001,
        longitude: bus.longitude + (Math.random() - 0.5) * 0.001,
        eta: Math.max(1, bus.eta + (Math.random() > 0.5 ? -1 : 1))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity < 30) return '#10b981';
    if (capacity < 70) return '#f59e0b';
    return '#ef4444';
  };

  const getCapacityText = (capacity: number) => {
    if (capacity < 30) return '여유';
    if (capacity < 70) return '보통';
    return '혼잡';
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={styles.webMapPlaceholder}>
          <MapPin size={48} color="#6b7280" />
          <Text style={styles.webMapText}>캠퍼스 지도</Text>
          <Text style={styles.webMapSubtext}>웹에서는 지도 기능이 제한됩니다</Text>
          
          {/* 정류장 목록 */}
          <View style={styles.stopsContainer}>
            <Text style={styles.stopsTitle}>버스 정류장</Text>
            {busStops.map(stop => (
              <View key={stop.id} style={styles.stopItem}>
                <View style={styles.stopMarker}>
                  <Bus size={16} color="#1f2937" />
                </View>
                <View style={styles.stopInfo}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.stopRoutes}>{stop.routes.join(', ')}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.mapRefreshButton}
          onPress={handleRefresh}>
          <RefreshCw 
            size={20} 
            color="#ffffff" 
            style={refreshing ? styles.spinning : {}} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cctvButton}
          onPress={() => setShowCCTV(!showCCTV)}>
          <Video size={20} color="#ffffff" />
          <Text style={styles.cctvButtonText}>CCTV</Text>
        </TouchableOpacity>
      </View>

      {showCCTV && (
        <View style={styles.cctvContainer}>
          <View style={styles.cctvHeader}>
            <Text style={styles.cctvTitle}>실시간 CCTV - 정문</Text>
            <TouchableOpacity onPress={() => setShowCCTV(false)}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cctvPlaceholder}>
            <Video size={48} color="#6b7280" />
            <Text style={styles.cctvPlaceholderText}>CCTV 피드</Text>
            <Text style={styles.cctvPlaceholderSubtext}>웹에서는 CCTV 기능이 제한됩니다</Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.busInfoContainer}>
        <Text style={styles.sectionTitle}>운행 중인 버스</Text>
        {buses.map(bus => (
          <TouchableOpacity 
            key={bus.id}
            style={[styles.busCard, selectedBus?.id === bus.id && styles.selectedBusCard]}
            onPress={() => setSelectedBus(bus)}>
            <View style={styles.busCardHeader}>
              <View style={[styles.routeBadge, { 
                backgroundColor: bus.routeName === 'A노선' ? '#3b82f6' : '#10b981' 
              }]}>
                <Text style={styles.routeText}>{bus.routeName}</Text>
              </View>
              <View style={[styles.capacityBadge, { 
                backgroundColor: getCapacityColor(bus.capacity) 
              }]}>
                <Users size={12} color="#ffffff" />
                <Text style={styles.capacityText}>{getCapacityText(bus.capacity)}</Text>
              </View>
            </View>
            
            <View style={styles.busCardContent}>
              <View style={styles.busInfoRow}>
                <Clock size={16} color="#6b7280" />
                <Text style={styles.busInfoText}>
                  다음 정류장: {bus.nextStop} ({bus.eta}분 후)
                </Text>
              </View>
              <View style={styles.busInfoRow}>
                <Bus size={16} color="#6b7280" />
                <Text style={styles.busInfoText}>
                  속도: {bus.speed}km/h • 혼잡도: {bus.capacity}%
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
  mapContainer: {
    height: height * 0.45,
    position: 'relative',
  },
  webMapPlaceholder: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  webMapText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginTop: 12,
  },
  webMapSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  stopsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 400,
  },
  stopsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  stopMarker: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1f2937',
    marginRight: 12,
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  stopRoutes: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  mapRefreshButton: {
    position: 'absolute',
    bottom: 5,
    right: 20,
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cctvButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cctvButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  cctvContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  cctvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cctvTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  cctvPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cctvPlaceholderText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginTop: 12,
  },
  cctvPlaceholderSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
  busInfoContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  busCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBusCard: {
    borderColor: '#3b82f6',
  },
  busCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  routeText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  capacityText: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    marginLeft: 4,
  },
  busCardContent: {
    gap: 8,
  },
  busInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  busInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});