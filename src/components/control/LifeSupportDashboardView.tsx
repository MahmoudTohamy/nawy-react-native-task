import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useHabitatStore } from '../../stores/habitatStore';
import { Habitability, LifeSupport } from '../../types/habitat';
import { HABITABILITY_COLORS } from '../../utils/habitatSafety';

function VitalMetricGauge({
  label,
  value,
  safeRange,
  status,
  icon,
}: {
  label: string;
  value: string;
  safeRange: string;
  status: Habitability;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const statusTheme = HABITABILITY_COLORS[status];

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

function computeMetricStatus(
  metric: 'o2' | 'pressure' | 'temp' | 'rad' | 'power' | 'scrubber',
  lifeSupport: LifeSupport
): Habitability {
  switch (metric) {
    case 'o2':
      if (lifeSupport.o2Level >= 19.5 && lifeSupport.o2Level <= 23.5) return 'safe';
      if (lifeSupport.o2Level >= 18 && lifeSupport.o2Level <= 25) return 'warning';
      return 'critical';
    case 'pressure':
      if (lifeSupport.cabinPressureKpa >= 70 && lifeSupport.cabinPressureKpa <= 102) return 'safe';
      if (lifeSupport.cabinPressureKpa >= 65 && lifeSupport.cabinPressureKpa <= 105) return 'warning';
      return 'critical';
    case 'temp':
      if (lifeSupport.temperatureC >= 18 && lifeSupport.temperatureC <= 24) return 'safe';
      if (lifeSupport.temperatureC >= 15 && lifeSupport.temperatureC <= 27) return 'warning';
      return 'critical';
    case 'rad':
      if (lifeSupport.radiationShieldingPct >= 90) return 'safe';
      if (lifeSupport.radiationShieldingPct >= 85) return 'warning';
      return 'critical';
    case 'power':
      if (lifeSupport.powerReserveHrs >= 4) return 'safe';
      if (lifeSupport.powerReserveHrs >= 2) return 'warning';
      return 'critical';
    case 'scrubber':
      if (lifeSupport.co2ScrubberStatus === 'active') return 'safe';
      if (lifeSupport.co2ScrubberStatus === 'degraded') return 'warning';
      return 'critical';
  }
}

export default function LifeSupportDashboardView() {
  const router = useRouter();
  const habitats = useHabitatStore((s) => s.habitats);
  const [selectedId, setSelectedId] = useState<string>(habitats[0]?.id || '');

  const activeHabitat = useMemo(() => {
    return habitats.find((h) => h.id === selectedId) || habitats[0];
  }, [habitats, selectedId]);

  const settlementSummary = useMemo(() => {
    const total = habitats.length || 1;
    const safeCount = habitats.filter((h) => h.habitability === 'safe').length;
    const warningCount = habitats.filter((h) => h.habitability === 'warning').length;
    const criticalCount = habitats.filter((h) => h.habitability === 'critical').length;
    return { total, safeCount, warningCount, criticalCount };
  }, [habitats]);

  if (!activeHabitat) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="planet-outline" size={48} color="#9E9E9E" />
        <Text style={styles.emptyTitle}>No Habitats Available</Text>
      </View>
    );
  }

  const { lifeSupport } = activeHabitat;
  const overallHabitability = activeHabitat.habitability;
  const verdictStyle = HABITABILITY_COLORS[overallHabitability];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Settlement Aggregate Overview */}
      <View style={styles.settlementCard}>
        <Text style={styles.settlementTitle}>Colony Habitat Fleet Status</Text>
        <View style={styles.settlementRow}>
          <View style={styles.fleetStat}>
            <Text style={[styles.fleetNum, { color: '#2E7D32' }]}>{settlementSummary.safeCount}</Text>
            <Text style={styles.fleetLabel}>Safe Pods</Text>
          </View>
          <View style={styles.fleetDivider} />
          <View style={styles.fleetStat}>
            <Text style={[styles.fleetNum, { color: '#EF6C00' }]}>{settlementSummary.warningCount}</Text>
            <Text style={styles.fleetLabel}>Degraded</Text>
          </View>
          <View style={styles.fleetDivider} />
          <View style={styles.fleetStat}>
            <Text style={[styles.fleetNum, { color: '#C62828' }]}>{settlementSummary.criticalCount}</Text>
            <Text style={styles.fleetLabel}>Critical</Text>
          </View>
        </View>
      </View>

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
          status={computeMetricStatus('o2', lifeSupport)}
          icon="water-outline"
        />

        <VitalMetricGauge
          label="Cabin Pressure"
          value={`${lifeSupport.cabinPressureKpa} kPa`}
          safeRange="Safe: 70 – 102 kPa"
          status={computeMetricStatus('pressure', lifeSupport)}
          icon="speedometer-outline"
        />

        <VitalMetricGauge
          label="Thermal HVAC"
          value={`${lifeSupport.temperatureC}°C`}
          safeRange="Safe: 18°C – 24°C"
          status={computeMetricStatus('temp', lifeSupport)}
          icon="thermometer-outline"
        />

        <VitalMetricGauge
          label="CO₂ Scrubber"
          value={lifeSupport.co2ScrubberStatus.toUpperCase()}
          safeRange="Req: ACTIVE"
          status={computeMetricStatus('scrubber', lifeSupport)}
          icon="repeat-outline"
        />

        <VitalMetricGauge
          label="Radiation Shield"
          value={`${lifeSupport.radiationShieldingPct}%`}
          safeRange="Safe: ≥ 90%"
          status={computeMetricStatus('rad', lifeSupport)}
          icon="shield-outline"
        />

        <VitalMetricGauge
          label="Battery Reserve"
          value={`${lifeSupport.powerReserveHrs.toFixed(1)} hrs`}
          safeRange="Safe: ≥ 4.0 hrs"
          status={computeMetricStatus('power', lifeSupport)}
          icon="battery-charging-outline"
        />
      </View>

      {/* Jump to Habitat Details */}
      <TouchableOpacity
        style={styles.openDetailBtn}
        onPress={() => router.push({ pathname: '/property/unlock/[id]', params: { id: activeHabitat.id } })}
        activeOpacity={0.85}
      >
        <Ionicons name="scan-outline" size={18} color="#FFFFFF" />
        <Text style={styles.openDetailText}>Open Full Schematics & Unlock Gate</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 16, color: '#757575', marginTop: 12 },
  settlementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  settlementTitle: { fontSize: 12, fontWeight: '700', color: '#757575', letterSpacing: 0.5, marginBottom: 12 },
  settlementRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  fleetStat: { alignItems: 'center', flex: 1 },
  fleetNum: { fontSize: 22, fontWeight: '800' },
  fleetLabel: { fontSize: 11, color: '#757575', marginTop: 2, fontWeight: '500' },
  fleetDivider: { width: 1, height: 28, backgroundColor: '#E0E0E0' },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#424242', marginBottom: 10, letterSpacing: 0.3 },
  selectorRow: { gap: 8, paddingBottom: 16 },
  habitatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  habitatPillSelected: {
    backgroundColor: '#212121',
    borderColor: '#212121',
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  habitatPillText: { fontSize: 12, fontWeight: '600', color: '#616161' },
  habitatPillTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  verdictCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  verdictIconRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  verdictTextGroup: { flex: 1 },
  verdictTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.4 },
  verdictSubtitle: { fontSize: 12, color: '#424242', marginTop: 3, fontWeight: '500' },
  gaugesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  gaugeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gaugeLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  gaugeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#424242',
  },
  gaugeStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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
    color: '#757575',
  },
  openDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D84315',
    paddingVertical: 14,
    borderRadius: 10,
  },
  openDetailText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
