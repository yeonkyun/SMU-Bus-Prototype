import { AppColors } from '@/constants/Colors';
import { CapacityLevel, BusStatus, NotificationType, RouteName } from '@/types';

export const getCapacityLevel = (capacity: number): CapacityLevel => {
  if (capacity < 30) return 'low';
  if (capacity < 70) return 'medium';
  return 'high';
};

export const getCapacityColor = (capacity: number): string => {
  const level = getCapacityLevel(capacity);
  return AppColors.capacity[level];
};

export const getCapacityText = (capacity: number): string => {
  const level = getCapacityLevel(capacity);
  switch (level) {
    case 'low': return '여유';
    case 'medium': return '보통';
    case 'high': return '혼잡';
  }
};

export const getStatusColor = (status: BusStatus): string => {
  return AppColors.status[status] || AppColors.status.unknown;
};

export const getStatusText = (status: BusStatus): string => {
  switch (status) {
    case 'active': return '정시 운행';
    case 'delayed': return '지연';
    case 'cancelled': return '운행 중단';
    default: return '알 수 없음';
  }
};

export const getRouteColor = (routeName: string): string => {
  const routeKey = routeName.replace('노선', '') as keyof typeof AppColors.route;
  return AppColors.route[routeKey] || AppColors.secondary;
};

export const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case 'arrival': return AppColors.success;
    case 'delay': return AppColors.warning;
    case 'cancellation': return AppColors.error;
    case 'general': return AppColors.accent;
    default: return AppColors.secondary;
  }
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? '오후' : '오전';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${ampm} ${displayHour}:${minutes}`;
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};