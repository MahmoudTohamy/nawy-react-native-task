import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HabitatCard from '../components/HabitatCard';
import HabitatFilterBar from '../components/HabitatFilterBar';
import { useFilteredSortedHabitats } from '../hooks/useFilteredSortedHabitats';
import { useHabitatStore } from '../stores/habitatStore';
import { SortKey } from '../types/habitat';
import { hasActiveFilters } from '../utils/filterHabitats';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'habitability', label: 'Habitability (Safe First)' },
  { key: 'leaseCredits', label: 'Lease Credits (Low–High)' },
  { key: 'o2Level', label: 'O₂ Level (Highest)' },
  { key: 'listedAtSol', label: 'Sol Listed (Newest)' },
];

export default function ListingsScreen() {
  const router = useRouter();
  const habitats = useHabitatStore((s) => s.habitats);
  const loading = useHabitatStore((s) => s.loading);
  const error = useHabitatStore((s) => s.error);
  const sortBy = useHabitatStore((s) => s.sortBy);
  const filters = useHabitatStore((s) => s.filters);
  const fetchHabitats = useHabitatStore((s) => s.fetchHabitats);
  const setSortBy = useHabitatStore((s) => s.setSortBy);
  const resetFilters = useHabitatStore((s) => s.resetFilters);

  const [menuOpen, setMenuOpen] = useState(false);
  const displayedHabitats = useFilteredSortedHabitats();
  const isFiltered = hasActiveFilters(filters);

  useEffect(() => {
    fetchHabitats();
  }, [fetchHabitats]);

  const handleHabitatPress = (id: string) => {
    router.push({ pathname: '/property/unlock/[id]', params: { id } });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Nawy Mars Habitats',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setMenuOpen(!menuOpen)}
              hitSlop={12}
              style={styles.sortButton}
            >
              <Ionicons name="swap-vertical" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />

      {menuOpen && (
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>SORT HABITATS</Text>
          {SORT_OPTIONS.map((option) => {
            const isSelected = sortBy === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.menuItem, isSelected && styles.menuItemSelected]}
                onPress={() => {
                  setSortBy(option.key);
                  setMenuOpen(false);
                }}
              >
                <Text style={[styles.menuLabel, isSelected && styles.menuLabelSelected]}>
                  {option.label}
                </Text>
                {isSelected && <Ionicons name="checkmark" size={16} color="#D84315" />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Main Content Area */}
      {loading && habitats.length === 0 ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#D84315" />
          <Text style={styles.loadingText}>Scanning settlement habitats…</Text>
          <Text style={styles.subStateText}>Polling Mars habitat telemetry loops</Text>
        </View>
      ) : error && habitats.length === 0 ? (
        <View style={styles.stateContainer}>
          <Ionicons name="warning-outline" size={48} color="#C62828" />
          <Text style={styles.errorTitle}>Telemetry Link Offline</Text>
          <Text style={styles.subStateText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHabitats}>
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Retry Scan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <HabitatFilterBar />

          {displayedHabitats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name={isFiltered ? 'filter-circle-outline' : 'planet-outline'}
                size={48}
                color="#9E9E9E"
              />
              <Text style={styles.emptyTitle}>
                {isFiltered ? 'No Habitats Match Filters' : 'No Habitats Found'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {isFiltered
                  ? 'Try relaxing your credit, berth, or bathroom criteria.'
                  : 'The settlement registry currently has no registered habitat pods.'}
              </Text>
              {isFiltered && (
                <TouchableOpacity style={styles.clearFiltersBtn} onPress={resetFilters}>
                  <Text style={styles.clearFiltersBtnText}>Reset All Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <FlatList
              data={displayedHabitats}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={fetchHabitats}
                  tintColor="#D84315"
                  colors={['#D84315']}
                />
              }
              renderItem={({ item }) => (
                <HabitatCard habitat={item} onPress={() => handleHabitatPress(item.id)} />
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { flex: 1 },
  sortButton: { padding: 4 },
  list: { paddingTop: 8, paddingBottom: 32 },
  menu: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    paddingVertical: 8,
    minWidth: 220,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  menuTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9E9E9E',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuItemSelected: {
    backgroundColor: '#FBE9E7',
  },
  menuLabel: {
    fontSize: 13,
    color: '#424242',
    fontWeight: '500',
  },
  menuLabelSelected: {
    color: '#D84315',
    fontWeight: '700',
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  subStateText: {
    marginTop: 6,
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
  },
  errorTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C62828',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    backgroundColor: '#D84315',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#212121',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  clearFiltersBtn: {
    marginTop: 16,
    backgroundColor: '#FBE9E7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCCBC',
  },
  clearFiltersBtnText: {
    color: '#D84315',
    fontSize: 13,
    fontWeight: '700',
  },
});
