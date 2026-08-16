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
import { useControlStore } from '../stores/controlStore';
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

  const fetchControlData = useControlStore((s) => s.fetchControlData);
  const getActiveAlertCount = useControlStore((s) => s.getActiveAlertCount);
  const getCriticalAlertCount = useControlStore((s) => s.getCriticalAlertCount);

  const [menuOpen, setMenuOpen] = useState(false);
  const displayedHabitats = useFilteredSortedHabitats();
  const isFiltered = hasActiveFilters(filters);

  useEffect(() => {
    fetchHabitats();
    fetchControlData();
  }, [fetchHabitats, fetchControlData]);

  const activeAlerts = getActiveAlertCount();
  const criticalCount = getCriticalAlertCount();

  const handleHabitatPress = (id: string) => {
    router.push({ pathname: '/property/unlock/[id]', params: { id } });
  };

  const handleOpenControlCenter = () => {
    router.push('/control');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Nawy Mars Habitats',
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleOpenControlCenter}
                hitSlop={8}
                style={styles.controlCenterBtn}
                accessibilityLabel="Open Habitat Control Center"
              >
                <Ionicons name="pulse" size={20} color="#FFFFFF" />
                {activeAlerts > 0 && (
                  <View
                    style={[
                      styles.headerBadge,
                      { backgroundColor: criticalCount > 0 ? '#C62828' : '#FFD54F' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.headerBadgeText,
                        { color: criticalCount > 0 ? '#FFFFFF' : '#212121' },
                      ]}
                    >
                      {activeAlerts}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMenuOpen(!menuOpen)}
                hitSlop={8}
                style={styles.sortButton}
                accessibilityLabel="Sort Habitats"
              >
                <Ionicons name="swap-vertical" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
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
          {/* Quick Settlement Incident Notification Banner */}
          {activeAlerts > 0 && (
            <TouchableOpacity
              style={[
                styles.incidentBanner,
                { backgroundColor: criticalCount > 0 ? '#FFEBEE' : '#FFF3E0' },
              ]}
              onPress={handleOpenControlCenter}
              activeOpacity={0.85}
            >
              <Ionicons
                name={criticalCount > 0 ? 'alert-circle' : 'warning-outline'}
                size={18}
                color={criticalCount > 0 ? '#C62828' : '#EF6C00'}
              />
              <Text
                style={[
                  styles.incidentBannerText,
                  { color: criticalCount > 0 ? '#C62828' : '#E65100' },
                ]}
                numberOfLines={1}
              >
                {criticalCount > 0
                  ? `🚨 ${criticalCount} Critical Telemetry Alert(s) — Tap for Control Center`
                  : `⚠️ ${activeAlerts} Habitat Warning(s) Active — Tap for Diagnostics`}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={criticalCount > 0 ? '#C62828' : '#EF6C00'}
              />
            </TouchableOpacity>
          )}

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
                  onRefresh={() => {
                    fetchHabitats();
                    fetchControlData();
                  }}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlCenterBtn: {
    padding: 4,
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  headerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  sortButton: { padding: 4 },
  incidentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFCDD2',
    gap: 8,
  },
  incidentBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
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

