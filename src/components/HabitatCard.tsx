import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Habitat } from '../types/habitat';
import { HABITABILITY_COLORS } from '../utils/habitatSafety';
import HabitatImage from './HabitatImage';

type Props = {
  habitat: Habitat;
  onPress: () => void;
};

function scrubberIcon(status: Habitat['lifeSupport']['co2ScrubberStatus']) {
  if (status === 'active') return { name: 'checkmark-circle' as const, color: '#2E7D32' };
  if (status === 'degraded') return { name: 'alert-circle' as const, color: '#EF6C00' };
  return { name: 'close-circle' as const, color: '#C62828' };
}

export default function HabitatCard({ habitat, onPress }: Props) {
  const habitabilityStyle = HABITABILITY_COLORS[habitat.habitability];
  const isAvailable = habitat.status === 'available';
  const co2 = scrubberIcon(habitat.lifeSupport.co2ScrubberStatus);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <HabitatImage imageUrl={habitat.imageUrl} size={60} />
        <View style={[styles.habitabilityBadge, { backgroundColor: habitabilityStyle.bg }]}>
          <Text style={[styles.habitabilityText, { color: habitabilityStyle.text }]}>
            {habitabilityStyle.label}
          </Text>
        </View>
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
            <Ionicons name="water-outline" size={14} color="#D84315" />
            <Text style={styles.vitalText}>O₂ {habitat.lifeSupport.o2Level.toFixed(1)}%</Text>
          </View>
          <View style={styles.vital}>
            <Ionicons name="speedometer-outline" size={14} color="#D84315" />
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
          <View style={[styles.statusChip, { backgroundColor: isAvailable ? '#C8E6C9' : '#FFE0B2' }]}>
            <Text style={[styles.statusText, { color: isAvailable ? '#2E7D32' : '#EF6C00' }]}>
              {habitat.status}
            </Text>
          </View>
        </View>
        {habitat.dataIssues.length > 0 && (
          <View style={styles.issueChip}>
            <Ionicons name="warning-outline" size={12} color="#EF6C00" />
            <Text style={styles.issueText}>Data issue detected</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: { height: 160, backgroundColor: '#EEEEEE' },
  habitabilityBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  habitabilityText: { fontSize: 11, fontWeight: '700' },
  body: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: 'bold', flex: 1, marginRight: 8 },
  sector: { fontSize: 12, color: '#757575', fontWeight: '600' },
  lease: { fontSize: 15, color: '#D84315', fontWeight: '600', marginTop: 4 },
  grid: { color: '#757575', fontSize: 12, marginTop: 2 },
  vitalsRow: { flexDirection: 'row', marginTop: 10, gap: 12 },
  vital: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vitalText: { fontSize: 12, fontWeight: '500' },
  secondaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  footerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  detail: { fontSize: 12, color: '#757575', flex: 1 },
  statusChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  statusText: { fontSize: 11, textTransform: 'capitalize' },
  issueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  issueText: { fontSize: 11, color: '#EF6C00' },
});
