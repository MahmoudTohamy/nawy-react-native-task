import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HabitatImage from '../../components/HabitatImage';
import { getHabitatById } from '../../services/habitatService';
import { useAccessStore } from '../../stores/accessStore';
import { useHabitatStore } from '../../stores/habitatStore';
import { Co2ScrubberStatus } from '../../types/habitat';
import { HABITABILITY_COLORS } from '../../utils/habitatSafety';

function TelemetryTile({
  icon,
  label,
  value,
  statusColor = '#D84315',
  safeRange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  statusColor?: string;
  safeRange?: string;
}) {
  return (
    <View style={styles.telemetryTile}>
      <View style={styles.tileHeader}>
        <Ionicons name={icon} size={20} color={statusColor} />
        <Text style={styles.tileLabel}>{label}</Text>
      </View>
      <Text style={[styles.tileValue, { color: statusColor }]}>{value}</Text>
      {safeRange && <Text style={styles.tileRange}>{safeRange}</Text>}
    </View>
  );
}

function getScrubberDetails(status: Co2ScrubberStatus) {
  if (status === 'active') return { label: 'Active', color: '#2E7D32', icon: 'checkmark-circle' as const };
  if (status === 'degraded') return { label: 'Degraded', color: '#EF6C00', icon: 'alert-circle' as const };
  return { label: 'Failed', color: '#C62828', icon: 'close-circle' as const };
}

export default function HabitatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const isUnlocked = useAccessStore((s) => (id ? s.isUnlocked(id) : false));
  const storeHabitat = useHabitatStore((s) => s.habitats.find((h) => h.id === id));
  const habitat = storeHabitat || (id ? getHabitatById(id) : undefined);

  useEffect(() => {
    if (id && !isUnlocked) {
      router.replace({ pathname: '/property/unlock/[id]', params: { id } });
    }
  }, [id, isUnlocked, router]);

  if (!isUnlocked) {
    return (
      <View style={styles.centered}>
        <Ionicons name="lock-closed" size={40} color="#D84315" />
        <Text style={styles.gateText}>Verifying clearance credentials…</Text>
      </View>
    );
  }

  if (!habitat) {
    return (
      <View style={styles.centered}>
        <Ionicons name="planet-outline" size={48} color="#9E9E9E" />
        <Text style={styles.notFoundTitle}>Habitat Not Found</Text>
        <Text style={styles.notFoundSubtitle}>
          The requested habitat identifier is not registered in the settlement database.
        </Text>
        <TouchableOpacity style={styles.returnBtn} onPress={() => router.replace('/')}>
          <Text style={styles.returnBtnText}>Return to Registry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const habitabilityStyle = HABITABILITY_COLORS[habitat.habitability];
  const scrubber = getScrubberDetails(habitat.lifeSupport.co2ScrubberStatus);
  const isAvailable = habitat.status === 'available';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: habitat.title,
          headerBackTitle: 'Habitats',
        }}
      />

      <View style={styles.imageContainer}>
        <HabitatImage imageUrl={habitat.imageUrl} size={80} />
        <View style={[styles.habitabilityBadge, { backgroundColor: habitabilityStyle.bg }]}>
          <Text style={[styles.habitabilityText, { color: habitabilityStyle.text }]}>
            ● {habitabilityStyle.label}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Title and Sector */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{habitat.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#D84315" />
            <Text style={styles.locationText}>
              {habitat.sector} · {habitat.gridCoordinates}
            </Text>
          </View>
          <Text style={styles.leaseRate}>{habitat.leaseLabel}</Text>
        </View>

        {/* Data Issues Alert */}
        {habitat.dataIssues.length > 0 && (
          <View style={styles.dataIssueBanner}>
            <Ionicons name="alert-circle" size={18} color="#EF6C00" />
            <View style={styles.dataIssueContent}>
              <Text style={styles.dataIssueTitle}>Telemetry / Data Notice</Text>
              {habitat.dataIssues.map((issue, idx) => (
                <Text key={idx} style={styles.dataIssueText}>
                  • {issue}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Structural Specifications */}
        <View style={styles.specificationsCard}>
          <Text style={styles.sectionHeader}>Structural Specs</Text>
          <View style={styles.specRow}>
            <View style={styles.specItem}>
              <Ionicons name="cube-outline" size={20} color="#D84315" />
              <Text style={styles.specValue}>{habitat.volumeM3} m³</Text>
              <Text style={styles.specLabel}>Pressurized Vol</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Ionicons name="bed-outline" size={20} color="#D84315" />
              <Text style={styles.specValue}>{habitat.bedrooms}</Text>
              <Text style={styles.specLabel}>Berths</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Ionicons name="water-outline" size={20} color="#D84315" />
              <Text style={styles.specValue}>{habitat.bathrooms}</Text>
              <Text style={styles.specLabel}>Sanitation</Text>
            </View>
          </View>
        </View>

        {/* Life Support Telemetry Dashboard */}
        <View style={styles.telemetrySection}>
          <View style={styles.telemetrySectionHeader}>
            <Ionicons name="pulse-outline" size={20} color="#D84315" />
            <Text style={styles.sectionHeader}>Life Support Telemetry</Text>
          </View>

          <View style={styles.telemetryGrid}>
            <TelemetryTile
              icon="water-outline"
              label="O₂ Level"
              value={`${habitat.lifeSupport.o2Level.toFixed(1)}%`}
              safeRange="Safe: 19.5–23.5%"
              statusColor={
                habitat.lifeSupport.o2Level >= 19.5 && habitat.lifeSupport.o2Level <= 23.5
                  ? '#2E7D32'
                  : '#C62828'
              }
            />
            <TelemetryTile
              icon="speedometer-outline"
              label="Cabin Pressure"
              value={`${habitat.lifeSupport.cabinPressureKpa} kPa`}
              safeRange="Safe: 70–102 kPa"
              statusColor={
                habitat.lifeSupport.cabinPressureKpa >= 70 && habitat.lifeSupport.cabinPressureKpa <= 102
                  ? '#2E7D32'
                  : '#C62828'
              }
            />
            <TelemetryTile
              icon="thermometer-outline"
              label="Temperature"
              value={`${habitat.lifeSupport.temperatureC}°C`}
              safeRange="Safe: 18–24°C"
              statusColor={
                habitat.lifeSupport.temperatureC >= 18 && habitat.lifeSupport.temperatureC <= 24
                  ? '#2E7D32'
                  : '#C62828'
              }
            />
            <TelemetryTile
              icon="shield-checkmark-outline"
              label="Radiation Shield"
              value={`${habitat.lifeSupport.radiationShieldingPct}%`}
              safeRange="Safe: ≥90%"
              statusColor={habitat.lifeSupport.radiationShieldingPct >= 90 ? '#2E7D32' : '#C62828'}
            />
            <TelemetryTile
              icon="battery-charging-outline"
              label="Power Reserve"
              value={`${habitat.lifeSupport.powerReserveHrs.toFixed(1)} hrs`}
              safeRange="Safe: ≥4 hrs"
              statusColor={habitat.lifeSupport.powerReserveHrs >= 4 ? '#2E7D32' : '#C62828'}
            />
            <TelemetryTile
              icon={scrubber.icon}
              label="CO₂ Scrubber"
              value={scrubber.label}
              safeRange="Req: Active"
              statusColor={scrubber.color}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionHeader}>Habitat Briefing</Text>
          <Text style={styles.descriptionText}>
            {habitat.description || 'No briefing notes provided for this habitat.'}
          </Text>
        </View>

        {/* Amenities */}
        {habitat.amenities.length > 0 && (
          <View style={styles.amenitiesSection}>
            <Text style={styles.sectionHeader}>Life Support & Safety Systems</Text>
            <View style={styles.chipsContainer}>
              {habitat.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#D84315" />
                  <Text style={styles.amenityChipText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Settlement Status & Sol Info */}
        <View style={styles.footerCard}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Settlement Availability:</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isAvailable ? '#C8E6C9' : '#FFE0B2' },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: isAvailable ? '#2E7D32' : '#EF6C00' },
                ]}
              >
                {habitat.status}
              </Text>
            </View>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Registered on Mars:</Text>
            <Text style={styles.solText}>Sol {habitat.listedAtSol}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { paddingBottom: 40 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FAFAFA',
  },
  gateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 12,
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  returnBtn: {
    marginTop: 20,
    backgroundColor: '#D84315',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  returnBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  imageContainer: {
    height: 220,
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },
  habitabilityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  habitabilityText: {
    fontSize: 12,
    fontWeight: '800',
  },
  body: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#616161',
    fontWeight: '500',
  },
  leaseRate: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D84315',
    marginTop: 8,
  },
  dataIssueBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  dataIssueContent: {
    flex: 1,
  },
  dataIssueTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF6C00',
    marginBottom: 2,
  },
  dataIssueText: {
    fontSize: 12,
    color: '#E65100',
  },
  specificationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  specItem: {
    alignItems: 'center',
    flex: 1,
  },
  specValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 4,
  },
  specLabel: {
    fontSize: 11,
    color: '#757575',
    marginTop: 2,
  },
  specDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E0E0E0',
  },
  telemetrySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  telemetrySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  telemetryTile: {
    width: '48%',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tileLabel: {
    fontSize: 11,
    color: '#616161',
    fontWeight: '600',
  },
  tileValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  tileRange: {
    fontSize: 10,
    color: '#9E9E9E',
    marginTop: 2,
  },
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#424242',
  },
  amenitiesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  amenityChipText: {
    fontSize: 12,
    color: '#424242',
    fontWeight: '500',
  },
  footerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  footerLabel: {
    fontSize: 13,
    color: '#616161',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  solText: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '700',
  },
});
