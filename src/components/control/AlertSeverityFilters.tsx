import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { AlertSeverity } from '../../types/control';
import { neutral, radius, spacing, status } from '../../theme';

export type SeverityFilter = AlertSeverity | 'all';

const SEVERITY_FILTERS: { key: SeverityFilter; label: string; activeColor: string }[] = [
  { key: 'all', label: 'All', activeColor: neutral.textSecondary },
  { key: 'critical', label: 'Critical', activeColor: status.critical.text },
  { key: 'warning', label: 'Warning', activeColor: status.warning.text },
  { key: 'info', label: 'Info', activeColor: status.info.text },
];

type FilterCounts = Record<SeverityFilter, number>;

type ChipProps = {
  value: SeverityFilter;
  label: string;
  count: number;
  selected: boolean;
  activeColor: string;
  onSelect: (value: SeverityFilter) => void;
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
  selected: SeverityFilter;
  counts: FilterCounts;
  onSelect: (value: SeverityFilter) => void;
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
