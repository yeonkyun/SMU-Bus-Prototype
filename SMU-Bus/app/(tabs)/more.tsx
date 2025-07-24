import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, CircleHelp as HelpCircle, Shield, ChevronRight } from 'lucide-react-native';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  action: () => void;
  showChevron?: boolean;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const menuItems: MenuItem[] = useMemo(() => [
    {
      id: 'settings',
      title: '앱 설정',
      icon: <Settings size={20} color="#6b7280" />,
      action: () => console.log('설정'),
      showChevron: true,
    },
    {
      id: 'help',
      title: '도움말 및 지원',
      icon: <HelpCircle size={20} color="#6b7280" />,
      action: () => console.log('도움말'),
      showChevron: true,
    },
    {
      id: 'privacy',
      title: '개인정보 처리방침',
      icon: <Shield size={20} color="#6b7280" />,
      action: () => console.log('개인정보'),
      showChevron: true,
    },
  ], []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>더보기</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* 메뉴 항목 */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={item.action}>
              <View style={styles.menuItemContent}>
                {item.icon}
                <Text style={styles.menuItemText}>
                  {item.title}
                </Text>
              </View>
              {item.showChevron && (
                <ChevronRight size={20} color="#d1d5db" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 앱 정보 */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>선문대학교 셔틀버스 v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2025 Dev.정연균</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 6,
  },
  appInfoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
});