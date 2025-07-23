import { BusLocation, BusStop, Schedule, RouteInfo } from '@/types';

export const BUS_STOPS: BusStop[] = [
  { id: '1', name: '정문', latitude: 37.5665, longitude: 126.9780, routes: ['A노선', 'B노선'] },
  { id: '2', name: '도서관', latitude: 37.5675, longitude: 126.9790, routes: ['A노선'] },
  { id: '3', name: '학생회관', latitude: 37.5685, longitude: 126.9800, routes: ['B노선'] },
  { id: '4', name: '공학관', latitude: 37.5695, longitude: 126.9810, routes: ['A노선', 'B노선'] },
  { id: '5', name: '기숙사A', latitude: 37.5705, longitude: 126.9820, routes: ['B노선'] },
  { id: '6', name: '기숙사B', latitude: 37.5715, longitude: 126.9830, routes: ['B노선'] },
  { id: '7', name: '체육관', latitude: 37.5725, longitude: 126.9840, routes: ['C노선'] },
  { id: '8', name: '헬스장', latitude: 37.5735, longitude: 126.9850, routes: ['C노선'] },
];

export const MOCK_BUSES: BusLocation[] = [
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

export const ROUTE_INFO: RouteInfo[] = [
  { name: 'A노선', color: '#3b82f6', description: '메인 캠퍼스 순환' },
  { name: 'B노선', color: '#10b981', description: '기숙사 직행' },
  { name: 'C노선', color: '#f59e0b', description: '체육관 연결' },
];

export const MOCK_SCHEDULES: Schedule[] = [
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
];