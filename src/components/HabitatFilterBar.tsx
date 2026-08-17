import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Chip } from './ui';
import { useHabitatStore } from '../stores/habitatStore';
import { brand, neutral, radius, spacing } from '../theme';
import { hasActiveFilters } from '../utils/filterHabitats';

const CREDIT_OPTIONS = [
  { label: 'All Credits', min: null, max: null },
  { label: '< 500 CR', min: null, max: 499 },
  { label: '500–1000 CR', min: 500, max: 1000 },
  { label: '1000+ CR', min: 1001, max: null },
] as const;

const BERTH_OPTIONS = [
  { label: 'Any', min: null },
  { label: '1+', min: 1 },
  { label: '2+', min: 2 },
  { label: '3+', min: 3 },
  { label: '4+', min: 4 },
] as const;

const BATH_OPTIONS = [
  { label: 'Any', min: null },
  { label: '1+', min: 1 },
  { label: '2+', min: 2 },
  { label: '3+', min: 3 },
] as const;

export default function HabitatFilterBar() {
  const filters = useHabitatStore((s) => s.filters);
  const setFilters = useHabitatStore((s) => s.setFilters);
  const resetFilters = useHabitatStore((s) => s.resetFilters);

  const isActive = hasActiveFilters(filters);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="options-outline" size={16} color={brand.primary} />
          <Text style={styles.headerTitle}>Environmental Filters</Text>
        </View>

        <TouchableOpacity
          onPress={resetFilters}
          hitSlop={8}
          style={[styles.clearButton, { opacity: isActive ? 1 : 0 }]}
          disabled={!isActive}
        >
          <Ionicons name="close-circle-outline" size={14} color={brand.primary} />
          <Text style={styles.clearText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Credits Section */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Credits:</Text>
          <View style={styles.chipRow}>
            {CREDIT_OPTIONS.map((opt, i) => {
              const selected =
                filters.minLeaseCredits === opt.min && filters.maxLeaseCredits === opt.max;
              return (
                <Chip
                  key={i}
                  label={opt.label}
                  selected={selected}
                  onPress={() =>
                    setFilters({
                      minLeaseCredits: opt.min,
                      maxLeaseCredits: opt.max,
                    })
                  }
                />
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Berths Section */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Berths:</Text>
          <View style={styles.chipRow}>
            {BERTH_OPTIONS.map((opt, i) => {
              const selected = filters.minBedrooms === opt.min;
              return (
                <Chip
                  key={i}
                  label={opt.label}
                  selected={selected}
                  onPress={() => setFilters({ minBedrooms: opt.min })}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Baths Section */}
        <View style={styles.group}>
          <Text style={styles.groupLabel}>Baths:</Text>
          <View style={styles.chipRow}>
            {BATH_OPTIONS.map((opt, i) => {
              const selected = filters.minBathrooms === opt.min;
              return (
                <Chip
                  key={i}
                  label={opt.label}
                  selected={selected}
                  onPress={() => setFilters({ minBathrooms: opt.min })}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: neutral.white,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: neutral.chipBorder,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
    marginBottom: spacing.md,
    minHeight: 26,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: neutral.textSecondary,
    letterSpacing: 0.3,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: brand.primaryTint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 1,
    borderRadius: radius['2xl'],
  },
  clearText: {
    fontSize: 12,
    color: brand.primary,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: spacing['3xl'],
    alignItems: 'center',
    gap: spacing.xl,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: neutral.textSubtle,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: neutral.chipBorder,
  },
});
