import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HabitatImage from '../../components/HabitatImage';
import { Badge, Button, Card, Chip, EmptyState } from '../../components/ui';
import { getHabitatById } from '../../services/habitatService';
import { useAccessStore } from '../../stores/accessStore';
import { useHabitatStore } from '../../stores/habitatStore';
import { brand, neutral, radius, spacing, status } from '../../theme';
import { Co2ScrubberStatus } from '../../types/habitat';
import { HABITABILITY_COLORS, getMetricHabitability, metricToneColor } from '../../utils/habitatSafety';

function TelemetryTile({
  icon,
  label,
  value,
  statusColor = brand.primary,
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

function getScrubberDetails(scrubberStatus: Co2ScrubberStatus) {
  if (scrubberStatus === 'active') {
    return { label: 'Active', color: status.safe.text, icon: 'checkmark-circle' as const };
  }
  if (scrubberStatus === 'degraded') {
    return { label: 'Degraded', color: status.warning.text, icon: 'alert-circle' as const };
  }
  return { label: 'Failed', color: status.critical.text, icon: 'close-circle' as const };
}

const COMPARE_LABEL = 'Compare with another habitat';

export default function HabitatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const isUnlocked = useAccessStore((s) => (id ? s.unlockedIds.has(id) : false));
  const storeHabitat = useHabitatStore((s) => s.habitats.find((h) => h.id === id));
  const habitat = storeHabitat || (id ? getHabitatById(id) : undefined);

  const handleCompare = useCallback(() => {
    if (!id) return;
    router.push({ pathname: '/property/compare-pick', params: { left: id } });
  }, [id, router]);

  useEffect(() => {
    if (id && !isUnlocked) {
      router.replace({ pathname: '/property/unlock/[id]', params: { id } });
    }
  }, [id, isUnlocked, router]);

  if (!isUnlocked) {
    return (
      <View style={styles.centered}>
        <Ionicons name="lock-closed" size={40} color={brand.primary} />
        <Text style={styles.gateText}>Verifying clearance credentials…</Text>
      </View>
    );
  }

  if (!habitat) {
    return (
      <EmptyState
        icon="planet-outline"
        title="Habitat Not Found"
        subtitle="The requested habitat identifier is not registered in the settlement database."
        actionLabel="Return to Registry"
        actionVariant="primary"
        onAction={() => router.replace('/')}
      />
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
        <Badge
          label={`● ${habitabilityStyle.label}`}
          tone={habitat.habitability}
          style={styles.habitabilityBadge}
        />
      </View>

      <View style={styles.body}>
        {/* Title and Sector */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{habitat.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={brand.primary} />
            <Text style={styles.locationText}>
              {habitat.sector} · {habitat.gridCoordinates}
            </Text>
          </View>
          <Text style={styles.leaseRate}>{habitat.leaseLabel}</Text>
        </View>

        {/* Structural Specifications */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Structural Specs</Text>
          <View style={styles.specRow}>
            <View style={styles.specItem}>
              <Ionicons name="cube-outline" size={20} color={brand.primary} />
              <Text style={styles.specValue}>{habitat.volumeM3} m³</Text>
              <Text style={styles.specLabel}>Pressurized Vol</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Ionicons name="bed-outline" size={20} color={brand.primary} />
              <Text style={styles.specValue}>{habitat.bedrooms}</Text>
              <Text style={styles.specLabel}>Berths</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Ionicons name="water-outline" size={20} color={brand.primary} />
              <Text style={styles.specValue}>{habitat.bathrooms}</Text>
              <Text style={styles.specLabel}>Sanitation</Text>
            </View>
          </View>
        </Card>

        {/* Life Support Telemetry Dashboard */}
        <Card style={styles.sectionCard}>
          <View style={styles.telemetrySectionHeader}>
            <Ionicons name="pulse-outline" size={20} color={brand.primary} />
            <Text style={styles.sectionHeader}>Life Support Telemetry</Text>
          </View>

          <View style={styles.telemetryGrid}>
            <TelemetryTile
              icon="water-outline"
              label="O₂ Level"
              value={`${habitat.lifeSupport.o2Level.toFixed(1)}%`}
              safeRange="Safe: 19.5–23.5%"
              statusColor={metricToneColor(getMetricHabitability('o2', habitat.lifeSupport))}
            />
            <TelemetryTile
              icon="speedometer-outline"
              label="Cabin Pressure"
              value={`${habitat.lifeSupport.cabinPressureKpa} kPa`}
              safeRange="Safe: 70–102 kPa"
              statusColor={metricToneColor(getMetricHabitability('pressure', habitat.lifeSupport))}
            />
            <TelemetryTile
              icon="thermometer-outline"
              label="Temperature"
              value={`${habitat.lifeSupport.temperatureC}°C`}
              safeRange="Safe: 18–24°C"
              statusColor={metricToneColor(getMetricHabitability('temp', habitat.lifeSupport))}
            />
            <TelemetryTile
              icon="shield-checkmark-outline"
              label="Radiation Shield"
              value={`${habitat.lifeSupport.radiationShieldingPct}%`}
              safeRange="Safe: ≥90%"
              statusColor={metricToneColor(getMetricHabitability('rad', habitat.lifeSupport))}
            />
            <TelemetryTile
              icon="battery-charging-outline"
              label="Power Reserve"
              value={`${habitat.lifeSupport.powerReserveHrs.toFixed(1)} hrs`}
              safeRange="Safe: ≥4 hrs"
              statusColor={metricToneColor(getMetricHabitability('power', habitat.lifeSupport))}
            />
            <TelemetryTile
              icon={scrubber.icon}
              label="CO₂ Scrubber"
              value={scrubber.label}
              safeRange="Req: Active"
              statusColor={scrubber.color}
            />
          </View>
        </Card>

        {/* Description */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Habitat Briefing</Text>
          <Text style={styles.descriptionText}>
            {habitat.description || 'No briefing notes provided for this habitat.'}
          </Text>
        </Card>

        {/* Amenities */}
        {habitat.amenities.length > 0 && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>Life Support & Safety Systems</Text>
            <View style={styles.chipsContainer}>
              {habitat.amenities.map((amenity, index) => (
                <Chip key={index} label={amenity} icon="checkmark-circle-outline" />
              ))}
            </View>
          </Card>
        )}

        <Button
          label={COMPARE_LABEL}
          icon="git-compare-outline"
          onPress={handleCompare}
          style={styles.compareButton}
        />

        {/* Settlement Status & Sol Info */}
        <Card>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Settlement Availability:</Text>
            <Badge label={habitat.status} tone={isAvailable ? 'safe' : 'warning'} />
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Registered on Mars:</Text>
            <Text style={styles.solText}>Sol {habitat.listedAtSol}</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: neutral.background },
  scrollContent: { paddingBottom: spacing['7xl'] },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['5xl'],
    backgroundColor: neutral.background,
  },
  gateText: {
    marginTop: spacing.xl,
    fontSize: 14,
    color: neutral.textSubtle,
    fontWeight: '500',
  },
  imageContainer: {
    height: 220,
    backgroundColor: neutral.chipBorder,
    position: 'relative',
  },
  habitabilityBadge: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.xl,
  },
  body: {
    padding: spacing['3xl'],
  },
  titleSection: {
    marginBottom: spacing['3xl'],
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: brand.dark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  locationText: {
    fontSize: 14,
    color: neutral.textMuted,
    fontWeight: '500',
  },
  leaseRate: {
    fontSize: 18,
    fontWeight: '700',
    color: brand.primary,
    marginTop: spacing.md,
  },
  sectionCard: {
    marginBottom: spacing['3xl'],
  },
  compareButton: {
    width: '100%',
    marginBottom: spacing['3xl'],
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: brand.dark,
    marginBottom: spacing.xl,
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
    color: brand.dark,
    marginTop: spacing.xs,
  },
  specLabel: {
    fontSize: 11,
    color: neutral.textSubtle,
    marginTop: 2,
  },
  specDivider: {
    width: 1,
    height: 32,
    backgroundColor: neutral.chipBorder,
  },
  telemetrySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  telemetryTile: {
    width: '48%',
    backgroundColor: neutral.background,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: neutral.border,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  tileLabel: {
    fontSize: 11,
    color: neutral.textMuted,
    fontWeight: '600',
  },
  tileValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  tileRange: {
    fontSize: 10,
    color: neutral.textDisabled,
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: neutral.textSecondary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  footerLabel: {
    fontSize: 13,
    color: neutral.textMuted,
    fontWeight: '500',
  },
  solText: {
    fontSize: 13,
    color: brand.dark,
    fontWeight: '700',
  },
});
