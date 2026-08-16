import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useHabitatStore } from '../stores/habitatStore';
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
          <Ionicons name="options-outline" size={16} color="#D84315" />
          <Text style={styles.headerTitle}>Environmental Filters</Text>
        </View>

        <TouchableOpacity
          onPress={resetFilters}
          hitSlop={8}
          style={[styles.clearButton, { opacity: isActive ? 1 : 0 }]}
          disabled={!isActive}
        >
          <Ionicons name="close-circle-outline" size={14} color="#D84315" />
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
                <TouchableOpacity
                  key={i}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() =>
                    setFilters({
                      minLeaseCredits: opt.min,
                      maxLeaseCredits: opt.max,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
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
                <TouchableOpacity
                  key={i}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => setFilters({ minBedrooms: opt.min })}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
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
                <TouchableOpacity
                  key={i}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => setFilters({ minBathrooms: opt.min })}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    minHeight: 26,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#424242',
    letterSpacing: 0.3,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FBE9E7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  clearText: {
    fontSize: 12,
    color: '#D84315',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#D84315',
    borderColor: '#D84315',
  },
  chipText: {
    fontSize: 12,
    color: '#616161',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
  },
});
