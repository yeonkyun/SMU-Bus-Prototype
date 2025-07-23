import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Settings } from 'lucide-react-native';

interface Notification {
  id: string;
  type: 'arrival' | 'delay' | 'cancellation' | 'general';
  title: string;
  message: string;
  timestamp: string;
  route?: string;
  read: boolean;
}

interface NotificationSettings {
  arrivalAlerts: boolean;
  delayAlerts: boolean;
  cancellationAlerts: boolean;
  generalUpdates: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'arrival',
      title: '버스 도착 예정',
      message: 'A노선 버스가 도서관 정류장에 2분 후 도착합니다',
      timestamp: '2분 전',
      route: 'A노선',
      read: false
    },
    {
      id: '2',
      type: 'delay',
      title: '운행 지연',
      message: 'B노선이 교통 체증으로 인해 5분 지연되고 있습니다',
      timestamp: '15분 전',
      route: 'B노선',
      read: false
    },
    {
      id: '3',
      type: 'cancellation',
      title: '운행 중단',
      message: 'C노선 오전 9시 운행이 정비로 인해 중단되었습니다',
      timestamp: '1시간 전',
      route: 'C노선',
      read: true
    },
    {
      id: '4',
      type: 'general',
      title: '시간표 업데이트',
      message: '새로운 주말 시간표가 업데이트되었습니다. 시간표 탭에서 확인하세요.',
      timestamp: '2시간 전',
      read: true
    },
    {
      id: '5',
      type: 'arrival',
      title: '버스 출발',
      message: 'A노선 버스가 정문에서 출발했습니다. 다음 정류장: 도서관',
      timestamp: '3시간 전',
      route: 'A노선',
      read: true
    }
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    arrivalAlerts: true,
    delayAlerts: true,
    cancellationAlerts: true,
    generalUpdates: false,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const getNotificationIcon = useCallback((type: string) => {
    switch (type) {
      case 'arrival': return <Clock size={20} color="#10b981" />;
      case 'delay': return <AlertTriangle size={20} color="#f59e0b" />;
      case 'cancellation': return <AlertTriangle size={20} color="#ef4444" />;
      case 'general': return <Bell size={20} color="#3b82f6" />;
      default: return <Bell size={20} color="#6b7280" />;
    }
  }, []);

  const getNotificationColor = useCallback((type: string) => {
    switch (type) {
      case 'arrival': return '#10b981';
      case 'delay': return '#f59e0b';
      case 'cancellation': return '#ef4444';
      case 'general': return '#3b82f6';
      default: return '#6b7280';
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const updateSetting = useCallback((key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 탭 네비게이션 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}>
          <Bell size={20} color={activeTab === 'notifications' ? '#ffffff' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
            알림
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}>
          <Settings size={20} color={activeTab === 'settings' ? '#ffffff' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            설정
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'notifications' ? (
        <ScrollView style={styles.content}>
          {unreadCount > 0 && (
            <View style={styles.actionBar}>
              <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
                <CheckCircle size={16} color="#10b981" />
                <Text style={styles.markAllText}>모두 읽음으로 표시</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.notificationsList}>
            {notifications.map(notification => (
              <TouchableOpacity
                key={notification.id}
                style={[styles.notificationCard, !notification.read && styles.unreadCard]}
                onPress={() => markAsRead(notification.id)}>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationTitleRow}>
                      <Text style={[styles.notificationTitle, !notification.read && styles.unreadTitle]}>
                        {notification.title}
                      </Text>
                      {!notification.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <View style={styles.notificationFooter}>
                      <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                      {notification.route && (
                        <View style={[styles.routeTag, { backgroundColor: getNotificationColor(notification.type) }]}>
                          <Text style={styles.routeTagText}>{notification.route}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {notifications.length === 0 && (
            <View style={styles.emptyState}>
              <Bell size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>알림이 없습니다</Text>
              <Text style={styles.emptyStateSubtext}>
                버스 도착, 지연, 서비스 업데이트에 대한 알림을 여기서 받을 수 있습니다
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>알림 유형</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Clock size={20} color="#10b981" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>도착 알림</Text>
                  <Text style={styles.settingDescription}>버스 도착 시 알림을 받습니다</Text>
                </View>
              </View>
              <Switch
                value={settings.arrivalAlerts}
                onValueChange={(value) => updateSetting('arrivalAlerts', value)}
                trackColor={{ false: '#d1d5db', true: '#10b981' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <AlertTriangle size={20} color="#f59e0b" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>지연 알림</Text>
                  <Text style={styles.settingDescription}>운행 지연에 대한 업데이트를 받습니다</Text>
                </View>
              </View>
              <Switch
                value={settings.delayAlerts}
                onValueChange={(value) => updateSetting('delayAlerts', value)}
                trackColor={{ false: '#d1d5db', true: '#10b981' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <AlertTriangle size={20} color="#ef4444" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>운행 중단 알림</Text>
                  <Text style={styles.settingDescription}>서비스 중단 시 알림을 받습니다</Text>
                </View>
              </View>
              <Switch
                value={settings.cancellationAlerts}
                onValueChange={(value) => updateSetting('cancellationAlerts', value)}
                trackColor={{ false: '#d1d5db', true: '#10b981' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Bell size={20} color="#3b82f6" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>일반 업데이트</Text>
                  <Text style={styles.settingDescription}>시간표 변경 및 공지사항</Text>
                </View>
              </View>
              <Switch
                value={settings.generalUpdates}
                onValueChange={(value) => updateSetting('generalUpdates', value)}
                trackColor={{ false: '#d1d5db', true: '#10b981' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>알림 설정</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>소리</Text>
                  <Text style={styles.settingDescription}>알림 소리 재생</Text>
                </View>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => updateSetting('soundEnabled', value)}
                trackColor={{ false: '#d1d5db', true: '#10b981' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>진동</Text>
                  <Text style={styles.settingDescription}>알림 시 진동</Text>
                </View>
              </View>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={(value) => updateSetting('vibrationEnabled', value)}
                trackColor={{ false: '#d1d5db', true: '#10b981' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#1f2937',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  markAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10b981',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  notificationHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationIcon: {
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  unreadTitle: {
    color: '#1f2937',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  routeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  routeTagText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
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
    paddingHorizontal: 40,
  },
  settingsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
});