import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, EmptyState } from '../ui';
import { useHabitatStore } from '../../stores/habitatStore';
import { neutral, radius, spacing, status } from '../../theme';
import { Habitability } from '../../types/habitat';
import { HABITABILITY_COLORS, getMetricHabitability } from '../../utils/habitatSafety';

function VitalMetricGauge({
  label,
  value,
  safeRange,
  status: gaugeStatus,
  icon,
}: {
  label: string;
  value: string;
  safeRange: string;
  status: Habitability;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const statusTheme = HABITABILITY_COLORS[gaugeStatus];

  return (
    <View style={[styles.gaugeCard, { borderColor: statusTheme.bg }]}>
      <View style={styles.gaugeHeader}>
        <View style={styles.gaugeLabelGroup}>
          <Ionicons name={icon} size={18} color={statusTheme.text} />
          <Text style={styles.gaugeLabel}>{label}</Text>
        </View>
        <View style={[styles.gaugeStatusBadge, { backgroundColor: statusTheme.bg }]}>
          <Text style={[styles.gaugeStatusText, { color: statusTheme.text }]}>
            {statusTheme.label}
          </Text>
        </View>
      </View>
      <Text style={[styles.gaugeValue, { color: statusTheme.text }]}>{value}</Text>
      <Text style={styles.gaugeRange}>{safeRange}</Text>
    </View>
  );
}

export default function LifeSupportDashboardView() {
  const router = useRouter();
  const habitats = useHabitatStore((s) => s.habitats);
  const [selectedId, setSelectedId] = useState<string>(habitats[0]?.id || '');

  const activeHabitat = useMemo(() => {
    return habitats.find((h) => h.id === selectedId) || habitats[0];
  }, [habitats, selectedId]);

  const settlementSummary = useMemo(() => {
    let safeCount = 0;
    let warningCount = 0;
    let criticalCount = 0;

    for (const habitat of habitats) {
      if (habitat.habitability === 'safe') safeCount += 1;
      else if (habitat.habitability === 'warning') warningCount += 1;
      else criticalCount += 1;
    }

    return { safeCount, warningCount, criticalCount };
  }, [habitats]);

  if (!activeHabitat) {
    return <EmptyState icon="planet-outline" title="No Habitats Available" />;
  }

  const { lifeSupport } = activeHabitat;
  const overallHabitability = activeHabitat.habitability;
  const verdictStyle = HABITABILITY_COLORS[overallHabitability];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Settlement Aggregate Overview */}
      <Card style={styles.settlementCard}>
        <Text style={styles.settlementTitle}>Colony Habitat Fleet Status</Text>
        <View style={styles.settlementRow}>
          <View style={styles.fleetStat}>
            <Text style={[styles.fleetNum, { color: status.safe.text }]}>{settlementSummary.safeCount}</Text>
            <Text style={styles.fleetLabel}>Safe Pods</Text>
          </View>
          <View style={styles.fleetDivider} />
          <View style={styles.fleetStat}>
            <Text style={[styles.fleetNum, { color: status.warning.text }]}>{settlementSummary.warningCount}</Text>
            <Text style={styles.fleetLabel}>Degraded</Text>
          </View>
          <View style={styles.fleetDivider} />
          <View style={styles.fleetStat}>
            <Text style={[styles.fleetNum, { color: status.critical.text }]}>{settlementSummary.criticalCount}</Text>
            <Text style={styles.fleetLabel}>Critical</Text>
          </View>
        </View>
      </Card>

      {/* Habitat Selector Carousel */}
      <Text style={styles.sectionHeader}>Inspect Pod Telemetry</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorRow}>
        {habitats.map((h) => {
          const isSelected = h.id === activeHabitat.id;
          const dotColor = HABITABILITY_COLORS[h.habitability].text;
          return (
            <TouchableOpacity
              key={h.id}
              style={[styles.habitatPill, isSelected && styles.habitatPillSelected]}
              onPress={() => setSelectedId(h.id)}
            >
              <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
              <Text style={[styles.habitatPillText, isSelected && styles.habitatPillTextSelected]}>
                {h.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 3-Second Verdict Card */}
      <View style={[styles.verdictCard, { backgroundColor: verdictStyle.bg }]}>
        <View style={styles.verdictIconRow}>
          <Ionicons
            name={
              overallHabitability === 'safe'
                ? 'shield-checkmark'
                : overallHabitability === 'warning'
                ? 'alert-circle'
                : 'skull-outline'
            }
            size={28}
            color={verdictStyle.text}
          />
          <View style={styles.verdictTextGroup}>
            <Text style={[styles.verdictTitle, { color: verdictStyle.text }]}>
              {overallHabitability === 'safe'
                ? '3-SEC VERDICT: LIFE SUPPORT NOMINAL'
                : overallHabitability === 'warning'
                ? '3-SEC VERDICT: HABITABILITY DEGRADED'
                : '3-SEC VERDICT: HAZARDOUS ATMOSPHERE'}
            </Text>
            <Text style={styles.verdictSubtitle}>
              {activeHabitat.title} · {activeHabitat.sector} ({activeHabitat.gridCoordinates})
            </Text>
          </View>
        </View>
      </View>

      {/* 6 Vital Telemetry Gauges */}
      <View style={styles.gaugesGrid}>
        <VitalMetricGauge
          label="Atmospheric O₂"
          value={`${lifeSupport.o2Level.toFixed(1)}%`}
          safeRange="Safe: 19.5% – 23.5%"
          status={getMetricHabitability('o2', lifeSupport)}
          icon="water-outline"
        />
        <VitalMetricGauge
          label="Cabin Pressure"
          value={`${lifeSupport.cabinPressureKpa} kPa`}
          safeRange="Safe: 70 – 102 kPa"
          status={getMetricHabitability('pressure', lifeSupport)}
          icon="speedometer-outline"
        />
        <VitalMetricGauge
          label="Thermal HVAC"
          value={`${lifeSupport.temperatureC}°C`}
          safeRange="Safe: 18°C – 24°C"
          status={getMetricHabitability('temp', lifeSupport)}
          icon="thermometer-outline"
        />
        <VitalMetricGauge
          label="CO₂ Scrubber"
          value={lifeSupport.co2ScrubberStatus.toUpperCase()}
          safeRange="Req: ACTIVE"
          status={getMetricHabitability('scrubber', lifeSupport)}
          icon="repeat-outline"
        />
        <VitalMetricGauge
          label="Radiation Shield"
          value={`${lifeSupport.radiationShieldingPct}%`}
          safeRange="Safe: ≥ 90%"
          status={getMetricHabitability('rad', lifeSupport)}
          icon="shield-outline"
        />
        <VitalMetricGauge
          label="Battery Reserve"
          value={`${lifeSupport.powerReserveHrs.toFixed(1)} hrs`}
          safeRange="Safe: ≥ 4.0 hrs"
          status={getMetricHabitability('power', lifeSupport)}
          icon="battery-charging-outline"
        />
      </View>

      {/* Jump to Habitat Details */}
      <Button
        label="Open Full Schematics & Unlock Gate"
        icon="scan-outline"
        onPress={() => router.push({ pathname: '/property/unlock/[id]', params: { id: activeHabitat.id } })}
        style={styles.openDetailBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing['3xl'], paddingBottom: spacing['7xl'] },
  settlementCard: {
    marginBottom: spacing['3xl'],
  },
  settlementTitle: { fontSize: 12, fontWeight: '700', color: neutral.textSubtle, letterSpacing: 0.5, marginBottom: spacing.xl },
  settlementRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  fleetStat: { alignItems: 'center', flex: 1 },
  fleetNum: { fontSize: 22, fontWeight: '800' },
  fleetLabel: { fontSize: 11, color: neutral.textSubtle, marginTop: 2, fontWeight: '500' },
  fleetDivider: { width: 1, height: 28, backgroundColor: neutral.chipBorder },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: neutral.textSecondary, marginBottom: spacing.lg, letterSpacing: 0.3 },
  selectorRow: { gap: spacing.md, paddingBottom: spacing['3xl'] },
  habitatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius['4xl'],
    backgroundColor: neutral.white,
    borderWidth: 1,
    borderColor: neutral.chipBorder,
  },
  habitatPillSelected: {
    backgroundColor: neutral.textPrimary,
    borderColor: neutral.textPrimary,
  },
  statusDot: { width: 8, height: 8, borderRadius: radius.full },
  habitatPillText: { fontSize: 12, fontWeight: '600', color: neutral.textMuted },
  habitatPillTextSelected: { color: neutral.white, fontWeight: '700' },
  verdictCard: {
    borderRadius: radius.xl,
    padding: spacing['3xl'],
    marginBottom: spacing['3xl'],
  },
  verdictIconRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  verdictTextGroup: { flex: 1 },
  verdictTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.4 },
  verdictSubtitle: { fontSize: 12, color: neutral.textSecondary, marginTop: spacing.xxs + 1, fontWeight: '500' },
  gaugesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginBottom: spacing['3xl'],
  },
  gaugeCard: {
    width: '48%',
    backgroundColor: neutral.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1.5,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  gaugeLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  gaugeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: neutral.textSecondary,
  },
  gaugeStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  gaugeStatusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  gaugeValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  gaugeRange: {
    fontSize: 10,
    color: neutral.textSubtle,
  },
  openDetailBtn: {
    paddingVertical: spacing['2xl'],
    borderRadius: radius.lg,
  },
});
