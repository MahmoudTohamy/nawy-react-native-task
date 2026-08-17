import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { brand, neutral, radius, shadow, spacing, status } from '../theme';
import { Habitat } from '../types/habitat';
import { HABITABILITY_COLORS } from '../utils/habitatSafety';
import FavoriteButton from './FavoriteButton';
import HabitatImage from './HabitatImage';
import { Badge } from './ui';

type Props = {
  habitat: Habitat;
  onPress: (id: string) => void;
};

function scrubberIcon(scrubberStatus: Habitat['lifeSupport']['co2ScrubberStatus']) {
  if (scrubberStatus === 'active') return { name: 'checkmark-circle' as const, color: status.safe.text };
  if (scrubberStatus === 'degraded') return { name: 'alert-circle' as const, color: status.warning.text };
  return { name: 'close-circle' as const, color: status.critical.text };
}

function HabitatCard({ habitat, onPress }: Props) {
  const habitabilityStyle = HABITABILITY_COLORS[habitat.habitability];
  const isAvailable = habitat.status === 'available';
  const co2 = scrubberIcon(habitat.lifeSupport.co2ScrubberStatus);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(habitat.id)} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <HabitatImage imageUrl={habitat.imageUrl} size={60} />
        <Badge
          label={habitabilityStyle.label}
          tone={habitat.habitability}
          style={styles.habitabilityBadge}
        />
        <FavoriteButton habitatId={habitat.id} style={styles.favoriteButton} />
      </View>
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {habitat.title}
          </Text>
          <Text style={styles.sector}>{habitat.sector}</Text>
        </View>
        <Text style={styles.lease}>{habitat.leaseLabel}</Text>
        <Text style={styles.grid} numberOfLines={1}>
          {habitat.gridCoordinates}
        </Text>
        <View style={styles.vitalsRow}>
          <View style={styles.vital}>
            <Ionicons name="water-outline" size={14} color={brand.primary} />
            <Text style={styles.vitalText}>O₂ {habitat.lifeSupport.o2Level.toFixed(1)}%</Text>
          </View>
          <View style={styles.vital}>
            <Ionicons name="speedometer-outline" size={14} color={brand.primary} />
            <Text style={styles.vitalText}>{habitat.lifeSupport.cabinPressureKpa} kPa</Text>
          </View>
          <View style={styles.vital}>
            <Ionicons name={co2.name} size={14} color={co2.color} />
            <Text style={styles.vitalText}>CO₂</Text>
          </View>
        </View>
        <View style={styles.secondaryRow}>
          <Text style={styles.detail}>
            Power: {habitat.lifeSupport.powerReserveHrs.toFixed(1)} hrs
          </Text>
          <Text style={styles.detail}>
            Rad: {habitat.lifeSupport.radiationShieldingPct}%
          </Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.detail}>
            {habitat.bedrooms} berths · {habitat.bathrooms} baths
          </Text>
          <Badge label={habitat.status} tone={isAvailable ? 'safe' : 'warning'} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing['3xl'],
    marginVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: neutral.white,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: shadow.color,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: { height: 160, backgroundColor: neutral.placeholder },
  habitabilityBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  body: { padding: spacing['3xl'] },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: 'bold', flex: 1, marginRight: spacing.md },
  sector: { fontSize: 12, color: neutral.textSubtle, fontWeight: '600' },
  lease: { fontSize: 15, color: brand.primary, fontWeight: '600', marginTop: spacing.xs },
  grid: { color: neutral.textSubtle, fontSize: 12, marginTop: 2 },
  vitalsRow: { flexDirection: 'row', marginTop: spacing.lg, gap: spacing.xl },
  vital: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  vitalText: { fontSize: 12, fontWeight: '500' },
  secondaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  footerRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  detail: { fontSize: 12, color: neutral.textSubtle, flex: 1 },
});

export default memo(HabitatCard);
