import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Bus, Users, Clock, Video, RefreshCw } from 'lucide-react-native';
import { WebView } from 'react-native-webview';

import { AppColors, Spacing, BorderRadius, FontFamily, FontSizes, Shadow } from '@/constants/Colors';
import { BusLocation, BusStop } from '@/types';
import { BUS_STOPS, MOCK_BUSES } from '@/constants/mockData';
import { getCapacityColor, getCapacityText, getRouteColor } from '@/utils/busUtils';
import { BottomSheet } from '@/components/BottomSheet';

const { width, height } = Dimensions.get('window');

export default function LiveTrackingScreen() {
  const [buses, setBuses] = useState<BusLocation[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  const [showCCTV, setShowCCTV] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);
  const insets = useSafeAreaInsets();

  // 바텀 시트 snap points (화면 높이 기준 상대값)
  const snapPoints = useMemo(() => [
    // 숫자가 높아질수록 차지 비율이 적음
    height * 0.84,  // 맨 밑에 위치
    height * 0.58,  // 중간 위치
    height * 0.34,  // 맨 위에 위치
  ], []);

  const updateBusPositions = useCallback(() => {
    setBuses(prev => prev.map(bus => ({
      ...bus,
      latitude: bus.latitude + (Math.random() - 0.5) * 0.001,
      longitude: bus.longitude + (Math.random() - 0.5) * 0.001,
      eta: Math.max(1, bus.eta + (Math.random() > 0.5 ? -1 : 1))
    })));
  }, []);

  useEffect(() => {
    setBuses(MOCK_BUSES);
    const interval = setInterval(updateBusPositions, 5000);
    return () => clearInterval(interval);
  }, [updateBusPositions]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // API 호출 시뮬레이션
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleBusSelect = useCallback((bus: BusLocation) => {
    setSelectedBus(bus);
  }, []);

  const toggleCCTV = useCallback(() => {
    setShowCCTV(prev => !prev);
  }, []);

  const stopsList = useMemo(() => BUS_STOPS, []);

  const handleSheetChange = useCallback((index: number) => {
    setCurrentSnapIndex(index);
  }, []);

  // 새로고침 버튼이 현재 바텀시트 위치를 따라 움직임
  const refreshButtonBottom = useMemo(() => {
    const currentSnapPoint = snapPoints[currentSnapIndex];
    return height - currentSnapPoint - 70;
  }, [currentSnapIndex, snapPoints]);

  return (
    <View style={styles.container}>
      <View style={[styles.mapContainer, { marginTop: -insets.top, height: height + insets.top }]}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.5665,
            longitude: 126.9780,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          
          {/* 버스 정류장 마커 */}
          {stopsList.map(stop => (
            <Marker
              key={stop.id}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              title={stop.name}
              description={`노선: ${stop.routes.join(', ')}`}>
              <View style={styles.stopMarker}>
                <Bus size={16} color={AppColors.text.primary} />
              </View>
            </Marker>
          ))}

          {/* 버스 마커 */}
          {buses.map(bus => (
            <Marker
              key={bus.id}
              coordinate={{ latitude: bus.latitude, longitude: bus.longitude }}
              title={bus.routeName}
              description={`다음 정류장: ${bus.nextStop} (${bus.eta}분)`}
              onPress={() => setSelectedBus(bus)}>
              <View style={[styles.busMarker, { 
                backgroundColor: bus.routeName === 'A노선' ? '#3b82f6' : '#10b981' 
              }]}>
                <Bus size={20} color="#ffffff" />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* 새로고침 버튼 */}
        <TouchableOpacity 
          style={[styles.mapRefreshButton, { bottom: refreshButtonBottom }]}
          onPress={handleRefresh}>
          <RefreshCw 
            size={20} 
            color="#ffffff" 
            style={refreshing ? styles.spinning : {}} />
        </TouchableOpacity>


        {/* CCTV 토글 버튼 */}
        <TouchableOpacity 
          style={[styles.cctvButton, { top: Spacing.xl * 2.5 + insets.top }]}
          onPress={toggleCCTV}>
          <Video size={20} color="#ffffff" />
          <Text style={styles.cctvButtonText}>CCTV</Text>
        </TouchableOpacity>
      </View>

      {/* CCTV 피드 */}
      {showCCTV && (
        <View style={[styles.cctvContainer, { top: Spacing.xl * 4 + insets.top }]}>
          <View style={styles.cctvHeader}>
            <Text style={styles.cctvTitle}>실시간 CCTV - 정문</Text>
            <TouchableOpacity onPress={() => setShowCCTV(false)}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>
          <WebView
            style={styles.cctvFeed}
            source={{ uri: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1' }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
      )}

      {/* 버스 정보 패널 */}
      <BottomSheet 
        snapPoints={snapPoints}
        initialSnapIndex={1}
        onSnapPointChange={handleSheetChange}>
        <ScrollView style={styles.busInfoContainer}>
          <Text style={styles.sectionTitle}>운행 중인 버스</Text>
          {buses.map(bus => (
            <TouchableOpacity 
              key={bus.id}
              style={[styles.busCard, selectedBus?.id === bus.id && styles.selectedBusCard]}
              onPress={() => handleBusSelect(bus)}>
              <View style={styles.busCardHeader}>
                <View style={[styles.routeBadge, { 
                  backgroundColor: getRouteColor(bus.routeName)
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
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
  mapContainer: {
    position: 'relative',
    flex: 1,
  },
  map: {
    flex: 1,
  },
  stopMarker: {
    backgroundColor: AppColors.surface,
    padding: Spacing.sm,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: AppColors.text.primary,
    ...Shadow.lg,
  },
  busMarker: {
    padding: 10,
    borderRadius: BorderRadius.full,
    ...Shadow.lg,
  },
  mapRefreshButton: {
    position: 'absolute',
    right: Spacing.xl,
    backgroundColor: AppColors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.full,
    ...Shadow.lg,
  },
  cctvButton: {
    position: 'absolute',
    right: Spacing.xl,
    backgroundColor: AppColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    ...Shadow.lg,
  },
  cctvButtonText: {
    color: AppColors.text.inverse,
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    marginLeft: Spacing.xs,
  },
  cctvContainer: {
    position: 'absolute',
    left: Spacing.xl,
    right: Spacing.xl,
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    ...Shadow.lg,
    zIndex: 1000,
  },
  cctvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  cctvTitle: {
    fontSize: FontSizes.lg,
    fontFamily: FontFamily.semiBold,
    color: AppColors.text.primary,
  },
  closeButton: {
    fontSize: 24,
    color: AppColors.text.secondary,
    fontWeight: 'bold',
  },
  cctvFeed: {
    height: 200,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  busInfoContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontFamily: FontFamily.bold,
    color: AppColors.text.primary,
    marginBottom: Spacing.lg,
  },
  busCard: {
    backgroundColor: AppColors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBusCard: {
    borderColor: AppColors.accent,
  },
  busCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  routeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.lg,
  },
  routeText: {
    color: AppColors.text.inverse,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.sm,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  capacityText: {
    color: AppColors.text.inverse,
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.xs,
    marginLeft: Spacing.xs,
  },
  busCardContent: {
    gap: Spacing.sm,
  },
  busInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  busInfoText: {
    fontSize: FontSizes.md,
    fontFamily: FontFamily.regular,
    color: AppColors.text.secondary,
  },
});