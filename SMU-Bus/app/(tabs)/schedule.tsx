import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, MapPin, Bus, ChevronRight } from 'lucide-react-native';

import { AppColors, Spacing, BorderRadius, FontFamily, FontSizes, Shadow } from '@/constants/Colors';
import { Schedule, RouteInfo } from '@/types';
import { ROUTE_INFO, MOCK_SCHEDULES } from '@/constants/mockData';
import { getStatusColor, getStatusText, getRouteColor } from '@/utils/busUtils';


export default function ScheduleScreen() {
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const insets = useSafeAreaInsets();

  const routes: RouteInfo[] = useMemo(() => [
    { name: 'A노선', color: '#3b82f6', description: '메인 캠퍼스 순환' },
    { name: 'B노선', color: '#10b981', description: '기숙사 직행' },
    { name: 'C노선', color: '#f59e0b', description: '체육관 연결' },
  ], []);

  const schedules: Schedule[] = useMemo(() => [
    {
      id: '1',
      route: 'A노선',
      departure: '08:00',
      arrival: '08:25',
      stops: ['정문', '도서관', '공학관', '학생회관'],
      frequency: '15분마다',
      status: 'active'
    },
    {
      id: '2',
      route: 'A노선',
      departure: '08:15',
      arrival: '08:40',
      stops: ['정문', '도서관', '공학관', '학생회관'],
      frequency: '15분마다',
      status: 'active'
    },
    {
      id: '3',
      route: 'B노선',
      departure: '08:10',
      arrival: '08:30',
      stops: ['정문', '기숙사A', '기숙사B', '학생회관'],
      frequency: '20분마다',
      status: 'delayed'
    },
    {
      id: '4',
      route: 'B노선',
      departure: '08:30',
      arrival: '08:50',
      stops: ['정문', '기숙사A', '기숙사B', '학생회관'],
      frequency: '20분마다',
      status: 'active'
    },
    {
      id: '5',
      route: 'C노선',
      departure: '09:00',
      arrival: '09:15',
      stops: ['정문', '체육관', '헬스장'],
      frequency: '30분마다',
      status: 'cancelled'
    },
  ], []);

  const filteredSchedules = useMemo(() => 
    selectedRoute === 'all' 
      ? schedules 
      : schedules.filter(schedule => schedule.route === selectedRoute),
    [selectedRoute, schedules]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 노선 필터 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.routeFilter}
        contentContainerStyle={styles.routeFilterContent}>
        <TouchableOpacity
          style={[styles.routeButton, selectedRoute === 'all' && styles.selectedRouteButton]}
          onPress={() => setSelectedRoute('all')}>
          <Text style={[styles.routeButtonText, selectedRoute === 'all' && styles.selectedRouteButtonText]}>
            전체 노선
          </Text>
        </TouchableOpacity>
        {routes.map(route => (
          <TouchableOpacity
            key={route.name}
            style={[
              styles.routeButton,
              selectedRoute === route.name && styles.selectedRouteButton,
              { borderColor: route.color }
            ]}
            onPress={() => setSelectedRoute(route.name)}>
            <View style={[styles.routeIndicator, { backgroundColor: route.color }]} />
            <Text style={[styles.routeButtonText, selectedRoute === route.name && styles.selectedRouteButtonText]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 노선 정보 */}
      {selectedRoute !== 'all' && (
        <View style={styles.routeInfo}>
          <View style={styles.routeInfoHeader}>
            <View style={[styles.routeInfoIndicator, { backgroundColor: getRouteColor(selectedRoute) }]} />
            <View>
              <Text style={styles.routeInfoTitle}>{selectedRoute}</Text>
              <Text style={styles.routeInfoDescription}>
                {routes.find(r => r.name === selectedRoute)?.description}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 시간표 목록 */}
      <ScrollView style={styles.scheduleContainer}>
        <Text style={styles.sectionTitle}>오늘의 시간표</Text>
        {filteredSchedules.map(schedule => (
          <View key={schedule.id} style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <View style={styles.scheduleRoute}>
                <View style={[styles.routeDot, { backgroundColor: getRouteColor(schedule.route) }]} />
                <Text style={styles.scheduleRouteText}>{schedule.route}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(schedule.status) }]}>
                <Text style={styles.statusText}>{getStatusText(schedule.status)}</Text>
              </View>
            </View>

            <View style={styles.scheduleContent}>
              <View style={styles.timeInfo}>
                <View style={styles.timeRow}>
                  <Clock size={16} color="#6b7280" />
                  <Text style={styles.timeText}>
                    {schedule.departure} - {schedule.arrival}
                  </Text>
                </View>
                <Text style={styles.frequencyText}>{schedule.frequency}</Text>
              </View>

              <View style={styles.stopsInfo}>
                <View style={styles.stopsHeader}>
                  <MapPin size={16} color="#6b7280" />
                  <Text style={styles.stopsTitle}>정류장 ({schedule.stops.length}개)</Text>
                </View>
                <View style={styles.stopsList}>
                  {schedule.stops.map((stop, index) => (
                    <View key={index} style={styles.stopItem}>
                      <View style={styles.stopDot} />
                      <Text style={styles.stopText}>{stop}</Text>
                      {index < schedule.stops.length - 1 && (
                        <ChevronRight size={12} color="#d1d5db" />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        ))}

        {filteredSchedules.length === 0 && (
          <View style={styles.emptyState}>
            <Bus size={48} color="#d1d5db" />
            <Text style={styles.emptyStateText}>시간표가 없습니다</Text>
            <Text style={styles.emptyStateSubtext}>
              다른 노선을 선택하거나 나중에 다시 확인해주세요
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  routeFilter: {
    maxHeight: 60,
    marginTop: 16,
    marginBottom: 16,
  },
  routeFilterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  selectedRouteButton: {
    backgroundColor: '#1f2937',
    borderColor: '#1f2937',
  },
  routeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  routeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  selectedRouteButtonText: {
    color: '#ffffff',
  },
  routeInfo: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeInfoIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  routeInfoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  routeInfoDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  scheduleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  scheduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleRoute: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  scheduleRouteText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  scheduleContent: {
    gap: 16,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  frequencyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  stopsInfo: {
    gap: 8,
  },
  stopsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  stopsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginLeft: 24,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
  },
  stopText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
});