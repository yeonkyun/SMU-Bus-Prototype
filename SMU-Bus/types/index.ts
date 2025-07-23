export interface BusLocation {
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

export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  routes: string[];
}

export interface Schedule {
  id: string;
  route: string;
  departure: string;
  arrival: string;
  stops: string[];
  frequency: string;
  status: 'active' | 'delayed' | 'cancelled';
}

export interface RouteInfo {
  name: string;
  color: string;
  description: string;
}

export type CapacityLevel = 'low' | 'medium' | 'high';
export type BusStatus = 'active' | 'delayed' | 'cancelled' | 'unknown';
export type NotificationType = 'arrival' | 'delay' | 'cancellation' | 'general';
export type RouteName = 'A노선' | 'B노선' | 'C노선';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  route?: string;
  read: boolean;
}

export interface NotificationSettings {
  arrivalAlerts: boolean;
  delayAlerts: boolean;
  cancellationAlerts: boolean;
  generalUpdates: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}