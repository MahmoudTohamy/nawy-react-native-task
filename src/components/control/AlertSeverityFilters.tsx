import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { SEVERITY_FILTERS } from '../../constants/control';
import { AlertSeverityCounts, AlertSeverityFilter } from '../../types/control';
import { neutral, radius, spacing } from '../../theme';

type ChipProps = {
  value: AlertSeverityFilter;
  label: string;
  count: number;
  selected: boolean;
  activeColor: string;
  onSelect: (value: AlertSeverityFilter) => void;
};

function AlertSeverityFilterChip({
  value,
  label,
  count,
  selected,
  activeColor,
  onSelect,
}: ChipProps) {
  const handlePress = useCallback(() => {
    onSelect(value);
  }, [onSelect, value]);

  const chipStyle = useMemo(
    (): ViewStyle[] => [
      styles.filterChip,
      selected ? { backgroundColor: activeColor, borderColor: activeColor } : {},
    ],
    [selected, activeColor],
  );

  return (
    <TouchableOpacity style={chipStyle} onPress={handlePress} activeOpacity={0.8}>
      <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );
}

type Props = {
  selected: AlertSeverityFilter;
  counts: AlertSeverityCounts;
  onSelect: (value: AlertSeverityFilter) => void;
};

export default function AlertSeverityFilters({ selected, counts, onSelect }: Props) {
  return (
    <View style={styles.filtersContainer}>
      {SEVERITY_FILTERS.map((filter) => (
        <AlertSeverityFilterChip
          key={filter.key}
          value={filter.key}
          label={filter.label}
          count={counts[filter.key]}
          selected={selected === filter.key}
          activeColor={filter.activeColor}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.xl,
    gap: spacing.md,
    backgroundColor: neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: neutral.border,
  },
  filterChip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius['3xl'],
    backgroundColor: neutral.surface,
    borderWidth: 1,
    borderColor: neutral.chipBorder,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: neutral.textMuted,
  },
  filterChipTextActive: {
    color: neutral.white,
  },
});
