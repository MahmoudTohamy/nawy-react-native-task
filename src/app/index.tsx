import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HabitatListingsContent from '../components/HabitatListingsContent';
import { ScreenState } from '../components/ui';
import { countActiveAlerts, countCriticalAlerts, useControlStore } from '../stores/controlStore';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useHabitatStore } from '../stores/habitatStore';
import { brand, neutral, radius, shadow, spacing, status } from '../theme';
import { SortKey } from '../types/habitat';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'habitability', label: 'Habitability (Safe First)' },
  { key: 'leaseCredits', label: 'Price (Low–High)' },
  { key: 'o2Level', label: 'O₂ Level (Highest)' },
  { key: 'listedAtSol', label: 'Sol Listed (Newest)' },
];

export default function ListingsScreen() {
  const router = useRouter();
  const habitatCount = useHabitatStore((s) => s.habitats.length);
  const loading = useHabitatStore((s) => s.loading);
  const error = useHabitatStore((s) => s.error);
  const sortBy = useHabitatStore((s) => s.sortBy);
  const fetchHabitats = useHabitatStore((s) => s.fetchHabitats);
  const setSortBy = useHabitatStore((s) => s.setSortBy);

  const fetchControlData = useControlStore((s) => s.fetchControlData);
  const activeAlerts = useControlStore((s) => countActiveAlerts(s.alerts));
  const criticalCount = useControlStore((s) => countCriticalAlerts(s.alerts));
  const favCount = useFavoritesStore((s) => s.ids.size);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchHabitats();
    fetchControlData();
  }, [fetchHabitats, fetchControlData]);

  const handleOpenControlCenter = () => {
    router.push('/control');
  };

  const handleOpenFavorites = () => {
    router.push('/favorites');
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
                <Ionicons name="pulse" size={20} color={neutral.white} />
                {activeAlerts > 0 && (
                  <View
                    style={[
                      styles.headerBadge,
                      { backgroundColor: criticalCount > 0 ? status.critical.text : status.warning.badge },
                    ]}
                  >
                    <Text
                      style={[
                        styles.headerBadgeText,
                        { color: criticalCount > 0 ? neutral.white : brand.dark },
                      ]}
                    >
                      {activeAlerts}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOpenFavorites}
                hitSlop={8}
                style={styles.controlCenterBtn}
                accessibilityLabel="Open favorites"
              >
                <Ionicons
                  name={favCount > 0 ? 'heart' : 'heart-outline'}
                  size={22}
                  color={neutral.white}
                />
                {favCount > 0 && (
                  <View style={[styles.headerBadge, styles.favBadge]}>
                    <Text style={[styles.headerBadgeText, styles.favBadgeText]}>{favCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMenuOpen(!menuOpen)}
                hitSlop={8}
                style={styles.sortButton}
                accessibilityLabel="Sort Habitats"
              >
                <Ionicons name="swap-vertical" size={22} color={neutral.white} />
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
                {isSelected && <Ionicons name="checkmark" size={16} color={brand.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {loading && habitatCount === 0 ? (
        <ScreenState
          variant="loading"
          title="Scanning settlement habitats…"
          subtitle="Polling Mars habitat telemetry loops"
        />
      ) : error && habitatCount === 0 ? (
        <ScreenState
          variant="error"
          title="Telemetry Link Offline"
          subtitle={error}
          actionLabel="Retry Scan"
          onRetry={fetchHabitats}
        />
      ) : (
        <HabitatListingsContent />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: neutral.background },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  controlCenterBtn: {
    padding: spacing.xs,
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  headerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  favBadge: {
    backgroundColor: neutral.white,
  },
  favBadgeText: {
    color: brand.primary,
  },
  sortButton: { padding: spacing.xs },
  menu: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.xl,
    zIndex: 20,
    backgroundColor: neutral.white,
    borderRadius: radius.xl,
    elevation: 6,
    shadowColor: shadow.color,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    paddingVertical: spacing.md,
    minWidth: 220,
    borderWidth: 1,
    borderColor: neutral.border,
  },
  menuTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: neutral.textDisabled,
    letterSpacing: 0.8,
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.lg,
  },
  menuItemSelected: {
    backgroundColor: brand.primaryTint,
  },
  menuLabel: {
    fontSize: 13,
    color: neutral.textSecondary,
    fontWeight: '500',
  },
  menuLabelSelected: {
    color: brand.primary,
    fontWeight: '700',
  },
});
