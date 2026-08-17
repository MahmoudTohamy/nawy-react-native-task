import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useFilteredSortedHabitats } from '../hooks/useFilteredSortedHabitats';
import { useControlStore } from '../stores/controlStore';
import { useHabitatStore } from '../stores/habitatStore';
import { brand, neutral, spacing } from '../theme';
import { Habitat } from '../types/habitat';
import { hasActiveFilters } from '../utils/filterHabitats';
import HabitatCard from './HabitatCard';
import HabitatFilterBar from './HabitatFilterBar';
import IncidentBanner from './IncidentBanner';
import { EmptyState } from './ui';

const SCROLL_HIDE_THRESHOLD = 6;
const SCROLL_HIDE_OFFSET = 20;
const HEADER_ANIM_DURATION = 280;

export default function HabitatListingsContent() {
  const router = useRouter();
  const loading = useHabitatStore((s) => s.loading);
  const filters = useHabitatStore((s) => s.filters);
  const fetchHabitats = useHabitatStore((s) => s.fetchHabitats);
  const resetFilters = useHabitatStore((s) => s.resetFilters);

  const fetchControlData = useControlStore((s) => s.fetchControlData);

  const displayedHabitats = useFilteredSortedHabitats();
  const isFiltered = hasActiveFilters(filters);

  const lastScrollY = useRef(0);
  const headerVisible = useRef(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerInteractive, setHeaderInteractive] = useState(true);
  const headerAnim = useRef(new Animated.Value(1)).current;

  const animatedTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-headerHeight, 0],
  });

  const animatedPaddingTop = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, headerHeight],
  });

  const handleHeaderLayout = (e: { nativeEvent: { layout: { height: number } } }) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && h !== headerHeight) {
      setHeaderHeight(h);
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (diff > SCROLL_HIDE_THRESHOLD && headerVisible.current && currentY > SCROLL_HIDE_OFFSET) {
      headerVisible.current = false;
      setHeaderInteractive(false);
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: HEADER_ANIM_DURATION,
        useNativeDriver: false,
      }).start();
    } else if (diff < -SCROLL_HIDE_THRESHOLD && !headerVisible.current) {
      headerVisible.current = true;
      setHeaderInteractive(true);
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: HEADER_ANIM_DURATION,
        useNativeDriver: false,
      }).start();
    }

    lastScrollY.current = currentY;
  };

  const handleHabitatPress = useCallback(
    (id: string) => {
      router.push({ pathname: '/property/unlock/[id]', params: { id } });
    },
    [router],
  );

  const handleRefresh = useCallback(() => {
    fetchHabitats();
    fetchControlData();
  }, [fetchHabitats, fetchControlData]);

  const renderItem = useCallback(
    ({ item }: { item: Habitat }) => <HabitatCard habitat={item} onPress={handleHabitatPress} />,
    [handleHabitatPress],
  );

  return (
    <View style={styles.content}>
      <Animated.View
        style={[
          styles.collapsibleHeader,
          {
            opacity: headerAnim,
            transform: [{ translateY: animatedTranslateY }],
          },
        ]}
        onLayout={handleHeaderLayout}
        pointerEvents={headerInteractive ? 'auto' : 'none'}
      >
        <IncidentBanner />
        <HabitatFilterBar />
      </Animated.View>

      <Animated.View style={[styles.listWrapper, { paddingTop: animatedPaddingTop }]}>
        {displayedHabitats.length === 0 ? (
          <EmptyState
            icon={isFiltered ? 'filter-circle-outline' : 'planet-outline'}
            title={isFiltered ? 'No Habitats Match Filters' : 'No Habitats Found'}
            subtitle={
              isFiltered
                ? 'Try relaxing your credit, berth, or bathroom criteria.'
                : 'The settlement registry currently has no registered habitat pods.'
            }
            actionLabel={isFiltered ? 'Reset All Filters' : undefined}
            onAction={isFiltered ? resetFilters : undefined}
          />
        ) : (
          <FlatList
            data={displayedHabitats}
            keyExtractor={(item: Habitat) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={handleRefresh}
                tintColor={brand.primary}
                colors={[brand.primary]}
              />
            }
            renderItem={renderItem}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  collapsibleHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: neutral.background,
  },
  listWrapper: {
    flex: 1,
  },
  list: { paddingTop: spacing.md, paddingBottom: spacing['6xl'] },
});
