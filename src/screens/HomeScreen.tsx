import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Recipe, SubscriptionState, AdminSettings } from '../types';
import { RecipeCard } from '../components/RecipeCard';
import { extractYouTubeId } from '../utils/youtube';

interface HomeScreenProps {
  recipes: Recipe[];
  subscription: SubscriptionState;
  settings: AdminSettings;
  isAdmin: boolean;
  onSelectRecipe: (recipe: Recipe) => void;
  onOpenActivationModal: () => void;
  onOpenAdminLogin: () => void;
  onOpenAdminPanel: () => void;
  onEditRecipeAdmin?: (recipe: Recipe) => void;
  onRefresh: () => Promise<void>;
  searchQuery: string;
  selectedCategory: string; // 'all' | 'car_care' | 'household'
  onlyWithVideo: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  recipes,
  subscription,
  settings,
  isAdmin,
  onSelectRecipe,
  onOpenActivationModal,
  onOpenAdminLogin,
  onOpenAdminPanel,
  onEditRecipeAdmin,
  onRefresh,
  searchQuery,
  selectedCategory,
  onlyWithVideo,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  // Filter recipes based on query, section category, and video
  const filteredRecipes = recipes.filter((recipe) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = recipe.title.toLowerCase().includes(q);
      const inTitleEn = !!recipe.titleEn && recipe.titleEn.toLowerCase().includes(q);
      const inCat = recipe.categoryName.toLowerCase().includes(q);
      const inIng = recipe.ingredients.some(
        (ing) =>
          ing.name.toLowerCase().includes(q) ||
          (ing.chemicalName && ing.chemicalName.toLowerCase().includes(q))
      );
      if (!(inTitle || inTitleEn || inCat || inIng)) return false;
    }

    if ('all' !== selectedCategory && recipe.mainSection !== selectedCategory) {
      return false;
    }

    if (onlyWithVideo && !extractYouTubeId(recipe.youtubeUrl)) {
      return false;
    }

    return true;
  });

  const isRecipeLocked = (index: number): boolean => {
    if (isAdmin) return false;
    if (subscription.isSubscribed) return false;
    if (!settings.requireSubscription) return false;
    return index >= settings.freeRecipesCount;
  };

  const handlePullRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => {
          const locked = isRecipeLocked(index);
          return (
            <RecipeCard
              recipe={item}
              isLocked={locked}
              onPress={() => onSelectRecipe(item)}
              onLockedPress={onOpenActivationModal}
              onEditPress={isAdmin && onEditRecipeAdmin ? () => onEditRecipeAdmin(item) : undefined}
              isAdmin={isAdmin}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View>
            {/* Activation Banner for non-subscribed users */}
            {!subscription.isSubscribed && settings.requireSubscription && !isAdmin && (
              <View style={styles.activationBanner}>
                <View style={styles.bannerIconCircle}>
                  <Ionicons name="key" size={24} color="#0284C7" />
                </View>
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>المحتوى الكامل يتطلب تفعيل الاشتراك</Text>
                  <Text style={styles.bannerSubtitle}>
                    لديك {settings.freeRecipesCount} وصفات مجانية للمعاينة. أدخل كود الـ 8 خانات لفتح كافة الأسرار والفيديوهات
                  </Text>
                  <TouchableOpacity
                    style={styles.bannerBtn}
                    onPress={onOpenActivationModal}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                    <Text style={styles.bannerBtnText}>إدخال كود التفعيل (8 خانات)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Admin Active Banner when Admin is Logged In */}
            {isAdmin && (
              <View style={styles.adminActiveBanner}>
                <View style={styles.adminBannerRight}>
                  <Ionicons name="shield-checkmark" size={20} color="#0284C7" />
                  <Text style={styles.adminBannerText}>
                    وضع الأدمن مفعّل (الرقم السري: mounirath1977@)
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.adminBannerBtn}
                  onPress={onOpenAdminPanel}
                  activeOpacity={0.8}
                >
                  <Text style={styles.adminBannerBtnText}>فتح لوحة التحكم</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* List Header with Title and Subtitle */}
            <View style={styles.listHeaderRow}>
              <View style={styles.listHeaderRight}>
                <Text style={styles.listTitle}>
                  {selectedCategory === 'car_care'
                    ? '🚗 قسم وصفات العناية بالسيارات'
                    : selectedCategory === 'household'
                    ? '🏠 قسم وصفات مواد التنظيف المنزلية'
                    : '🌟 جميع وصفات السيارات والمنزل'}
                </Text>
                <Text style={styles.listSubtitle}>
                  {selectedCategory === 'car_care'
                    ? 'تركيبات شامبو الرغوة، واكس السيراميك، ملمع الكاوتش، تابلوه وجلد، ومزيل شحوم المحرك'
                    : selectedCategory === 'household'
                    ? 'تركيبات سوائل جلي الأطباق، منظفات ومطهرات الأرضيات، معطرات، شامبو الكنب والسجاد'
                    : `عرض ${filteredRecipes.length} من أصل ${recipes.length} تركيبة كيميائية معتمدة`}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>لا توجد نتائج مطابقة لبحثك</Text>
            <Text style={styles.emptySubtitle}>
              جرب البحث بكلمة مختلفة مثل: شامبو، زجاج، صابون، فلاش
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handlePullRefresh}
            colors={['#0284C7']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: 14,
    paddingBottom: 40,
  },
  activationBanner: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  bannerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0369A1',
    textAlign: 'right',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#0C4A6E',
    marginTop: 4,
    lineHeight: 18,
    textAlign: 'right',
  },
  bannerBtn: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  adminActiveBanner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  adminBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  adminBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  adminBannerBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  adminBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listHeaderRight: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
  },
  listSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
});
