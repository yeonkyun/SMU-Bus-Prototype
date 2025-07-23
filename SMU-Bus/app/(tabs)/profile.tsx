import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Settings, CircleHelp as HelpCircle, Shield, LogOut, ChevronRight, CreditCard as Edit } from 'lucide-react-native';

interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  department: string;
  avatar?: string;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  action: () => void;
  showChevron?: boolean;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [userProfile] = useState<UserProfile>({
    name: '정연균',
    email: 'student@sunmoon.ac.kr',
    studentId: '2020243000',
    department: '컴퓨터공학부',
  });

  const menuItems: MenuItem[] = useMemo(() => [
    {
      id: 'edit-profile',
      title: '프로필 편집',
      icon: <Edit size={20} color="#6b7280" />,
      action: () => console.log('프로필 편집'),
      showChevron: true,
    },
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
      title: '개인정보 및 보안',
      icon: <Shield size={20} color="#6b7280" />,
      action: () => console.log('개인정보'),
      showChevron: true,
    },
  ], []);

  const handleLogout = () => {
    // 로그아웃 로직 처리
    console.log('로그아웃');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content}>
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {userProfile.avatar ? (
                <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <User size={40} color="#ffffff" />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileEmail}>{userProfile.email}</Text>
            </View>
          </View>
          
          <View style={styles.profileDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>학번</Text>
              <Text style={styles.detailValue}>{userProfile.studentId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>학과</Text>
              <Text style={styles.detailValue}>{userProfile.department}</Text>
            </View>
          </View>
        </View>

        {/* 메뉴 항목 */}
        <View style={styles.menuSection}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
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

        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  profileDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
  },
  menuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1f2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#fecaca',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  appInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
});