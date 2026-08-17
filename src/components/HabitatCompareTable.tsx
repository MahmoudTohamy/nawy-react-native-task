import { StyleSheet, Text, View } from 'react-native';
import { brand, neutral, radius, spacing } from '../theme';
import { Habitat } from '../types/habitat';
import { CompareMetric, getCompareWinners } from '../utils/compareHabitats';
import { HABITABILITY_COLORS } from '../utils/habitatSafety';
import { Badge } from './ui';

const METRIC_ROWS: { key: CompareMetric; label: string }[] = [
  { key: 'habitability', label: 'Habitability' },
  { key: 'price', label: 'Sale price' },
  { key: 'volume', label: 'Volume' },
  { key: 'berths', label: 'Berths' },
  { key: 'baths', label: 'Baths' },
  { key: 'o2', label: 'O₂' },
  { key: 'pressure', label: 'Cabin pressure' },
];

type Props = {
  left: Habitat;
  right: Habitat;
};

function metricValue(metric: CompareMetric, habitat: Habitat): string {
  switch (metric) {
    case 'habitability':
      return HABITABILITY_COLORS[habitat.habitability].label;
    case 'price':
      return habitat.leaseLabel;
    case 'volume':
      return `${habitat.volumeM3} m³`;
    case 'berths':
      return String(habitat.bedrooms);
    case 'baths':
      return String(habitat.bathrooms);
    case 'o2':
      return `${habitat.lifeSupport.o2Level.toFixed(1)}%`;
    case 'pressure':
      return `${habitat.lifeSupport.cabinPressureKpa} kPa`;
  }
}

export default function HabitatCompareTable({ left, right }: Props) {
  const winners = getCompareWinners(left, right);

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <View style={styles.labelCol} />
        <View style={styles.valueCol}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {left.title}
          </Text>
          <Text style={styles.headerSector}>{left.sector}</Text>
        </View>
        <View style={styles.valueCol}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {right.title}
          </Text>
          <Text style={styles.headerSector}>{right.sector}</Text>
        </View>
      </View>

      {METRIC_ROWS.map((row) => {
        const winner = winners[row.key];
        return (
          <View key={row.key} style={styles.metricRow}>
            <Text style={[styles.label, styles.labelCol]}>{row.label}</Text>
            <CompareCell
              metric={row.key}
              habitat={left}
              highlighted={winner === 'left'}
            />
            <CompareCell
              metric={row.key}
              habitat={right}
              highlighted={winner === 'right'}
            />
          </View>
        );
      })}
    </View>
  );
}

function CompareCell({
  metric,
  habitat,
  highlighted,
}: {
  metric: CompareMetric;
  habitat: Habitat;
  highlighted: boolean;
}) {
  if (metric === 'habitability') {
    return (
      <View style={[styles.valueCol, styles.cell, highlighted && styles.cellWin]}>
        <Badge label={HABITABILITY_COLORS[habitat.habitability].label} tone={habitat.habitability} />
      </View>
    );
  }

  return (
    <View style={[styles.valueCol, styles.cell, highlighted && styles.cellWin]}>
      <Text style={[styles.value, highlighted && styles.valueWin]}>{metricValue(metric, habitat)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: neutral.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: neutral.border,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: brand.dark,
    textAlign: 'center',
  },
  headerSector: {
    fontSize: 11,
    color: neutral.textSubtle,
    textAlign: 'center',
    marginTop: 2,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: neutral.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  labelCol: {
    width: '22%',
  },
  valueCol: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: neutral.textSubtle,
    paddingLeft: spacing.sm,
  },
  cell: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  cellWin: {
    backgroundColor: brand.primaryTint,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: brand.dark,
    textAlign: 'center',
  },
  valueWin: {
    color: brand.primary,
    fontWeight: '800',
  },
});
