import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SubscriptionState } from '../types';

interface HeaderProps {
  subscription: SubscriptionState;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
  onLogoutAdmin: () => void;
  onOpenUserActivation: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string; // 'all' | 'car_care' | 'household'
  onSelectCategory: (cat: string) => void;
  onlyWithVideo: boolean;
  onToggleOnlyWithVideo: () => void;
  recipesCount: number;
  carCareCount: number;
  householdCount: number;
  totalWithVideoCount: number;
  isSupabaseConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  subscription,
  isAdmin,
  onOpenAdminLogin,
  onOpenAdminPanel,
  onLogoutAdmin,
  onOpenUserActivation,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onlyWithVideo,
  onToggleOnlyWithVideo,
  recipesCount,
  carCareCount,
  householdCount,
  totalWithVideoCount,
  isSupabaseConnected = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Row: Subscription Pill, Brand Title, Admin Button */}
      <View style={styles.topRow}>
        {/* Subscription Status Badge */}
        <TouchableOpacity
          style={[
            styles.subBadge,
            subscription.isSubscribed ? styles.subBadgeActive : styles.subBadgeInactive,
          ]}
          onPress={onOpenUserActivation}
          activeOpacity={0.8}
        >
          <Ionicons
            name={subscription.isSubscribed ? 'checkmark-circle' : 'key-outline'}
            size={16}
            color={subscription.isSubscribed ? '#059669' : '#D97706'}
          />
          <Text
            style={[
              styles.subBadgeText,
              subscription.isSubscribed ? styles.subTextActive : styles.subTextInactive,
            ]}
          >
            {subscription.isSubscribed ? 'اشتراك مفعل' : 'إدخال كود التفعيل'}
          </Text>
        </TouchableOpacity>

        {/* Center Brand */}
        <View style={styles.brandContainer}>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandTitle}>ChemClean Pro</Text>
            {isSupabaseConnected && (
              <View style={styles.sbPill}>
                <Ionicons name="cloud-done" size={10} color="#0284C7" />
                <Text style={styles.sbPillText}>Supabase</Text>
              </View>
            )}
          </View>
          <Text style={styles.brandSubtitle}>تركيبات المنظفات الاحترافية</Text>
        </View>

        {/* Admin Secret / Active Button */}
        {isAdmin ? (
          <View style={styles.adminActiveGroup}>
            <TouchableOpacity
              style={styles.adminOpenBtn}
              onPress={onOpenAdminPanel}
              activeOpacity={0.8}
            >
              <Ionicons name="speedometer" size={16} color="#FFFFFF" />
              <Text style={styles.adminOpenBtnText}>لوحة الأدمن</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adminLogoutMiniBtn}
              onPress={onLogoutAdmin}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={15} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.adminSecretBtn}
            onPress={onOpenAdminLogin}
            activeOpacity={0.7}
          >
            <Ionicons name="lock-closed-outline" size={17} color="#64748B" />
            <Text style={styles.adminSecretBtnText}>الأدمن</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Two Big Section Cards: Car Care & Household Formulas */}
      <View style={styles.twoSectionsContainer}>
        {/* Car Care Card Button */}
        <TouchableOpacity
          style={[
            styles.sectionCardBtn,
            'car_care' === selectedCategory && styles.sectionCardBtnActiveCar,
          ]}
          onPress={() => onSelectCategory('car_care' === selectedCategory ? 'all' : 'car_care')}
          activeOpacity={0.85}
        >
          <View style={styles.sectionBtnContent}>
            <View
              style={[
                styles.sectionIconCircle,
                'car_care' === selectedCategory && styles.sectionIconCircleActiveCar,
              ]}
            >
              <Ionicons
                name="car-sport"
                size={18}
                color={'car_care' === selectedCategory ? '#FFFFFF' : '#0284C7'}
              />
            </View>
            <View style={styles.sectionTextCol}>
              <Text
                style={[
                  styles.sectionBtnTitle,
                  'car_care' === selectedCategory && styles.sectionBtnTitleActiveCar,
                ]}
              >
                وصفات العناية بالسيارات
              </Text>
              <Text
                style={[
                  styles.sectionBtnCount,
                  'car_care' === selectedCategory && styles.sectionBtnCountActiveCar,
                ]}
              >
                {carCareCount} تركيبة سيارات
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Household Formulas Card Button */}
        <TouchableOpacity
          style={[
            styles.sectionCardBtn,
            'household' === selectedCategory && styles.sectionCardBtnActiveHome,
          ]}
          onPress={() => onSelectCategory('household' === selectedCategory ? 'all' : 'household')}
          activeOpacity={0.85}
        >
          <View style={styles.sectionBtnContent}>
            <View
              style={[
                styles.sectionIconCircle,
                'household' === selectedCategory && styles.sectionIconCircleActiveHome,
              ]}
            >
              <Ionicons
                name="home"
                size={18}
                color={'household' === selectedCategory ? '#FFFFFF' : '#059669'}
              />
            </View>
            <View style={styles.sectionTextCol}>
              <Text
                style={[
                  styles.sectionBtnTitle,
                  'household' === selectedCategory && styles.sectionBtnTitleActiveHome,
                ]}
              >
                مواد التنظيف المنزلية
              </Text>
              <Text
                style={[
                  styles.sectionBtnCount,
                  'household' === selectedCategory && styles.sectionBtnCountActiveHome,
                ]}
              >
                {householdCount} تركيبة منزلية
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Row */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث باسم التركيبة أو المادة الكيميائية..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={onSearchChange}
          textAlign="right"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onSearchChange('')} style={{ padding: 4 }}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Row: Show All & YouTube Filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.allChip, 'all' === selectedCategory && styles.allChipActive]}
          onPress={() => onSelectCategory('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.allChipText, 'all' === selectedCategory && styles.allChipTextActive]}>
            عرض الكل ({recipesCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.videoFilterChip, onlyWithVideo && styles.videoFilterChipActive]}
          onPress={onToggleOnlyWithVideo}
          activeOpacity={0.8}
        >
          <Ionicons
            name="logo-youtube"
            size={13}
            color={onlyWithVideo ? '#FFFFFF' : '#EF4444'}
          />
          <Text
            style={[styles.videoFilterText, onlyWithVideo && styles.videoFilterTextActive]}
          >
            بفيديو يوتيوب ({totalWithVideoCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  subBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  subBadgeActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  subBadgeInactive: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  subBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subTextActive: {
    color: '#065F46',
  },
  subTextInactive: {
    color: '#B45309',
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  sbPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 3,
  },
  sbPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 1,
  },
  adminSecretBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adminSecretBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  adminActiveGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adminOpenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  adminOpenBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  adminLogoutMiniBtn: {
    padding: 6,
  },
  twoSectionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  sectionCardBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  sectionCardBtnActiveCar: {
    backgroundColor: '#F0F9FF',
    borderColor: '#0284C7',
  },
  sectionCardBtnActiveHome: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  sectionBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionIconCircleActiveCar: {
    backgroundColor: '#0284C7',
  },
  sectionIconCircleActiveHome: {
    backgroundColor: '#10B981',
  },
  sectionTextCol: {
    flex: 1,
  },
  sectionBtnTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'right',
  },
  sectionBtnTitleActiveCar: {
    color: '#0369A1',
  },
  sectionBtnTitleActiveHome: {
    color: '#065F46',
  },
  sectionBtnCount: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 2,
  },
  sectionBtnCountActiveCar: {
    color: '#0284C7',
    fontWeight: '700',
  },
  sectionBtnCountActiveHome: {
    color: '#059669',
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  searchIcon: {
    marginLeft: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingHorizontal: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  allChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  allChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  allChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  allChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  videoFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  videoFilterChipActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  videoFilterText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
  },
  videoFilterTextActive: {
    color: '#FFFFFF',
  },
});
