import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useControlStore } from '../../stores/controlStore';

const PHASE_CONFIG = {
  day: { label: 'High Solar Irradiance (Day)', icon: 'sunny' as const, color: '#F57C00', bg: '#FFF8E1' },
  dusk: { label: 'Approaching Terminator (Dusk)', icon: 'partly-sunny' as const, color: '#E64A19', bg: '#FBE9E7' },
  night: { label: 'Solar Eclipse / Night Sol', icon: 'moon' as const, color: '#5C6BC0', bg: '#EDE7F6' },
  dawn: { label: 'Dawn Illumination Rising', icon: 'sunny-outline' as const, color: '#FFA000', bg: '#FFF3E0' },
};

const RISK_CONFIG = {
  nominal: { label: 'Nominal — No Storm Detected', color: '#2E7D32', bg: '#E8F5E9' },
  moderate: { label: 'Moderate — Class-2 Front Expected', color: '#EF6C00', bg: '#FFF3E0' },
  severe: { label: 'Severe Dust Blackout Warning', color: '#C62828', bg: '#FFEBEE' },
};

export default function EnergyStatusView() {
  const energy = useControlStore((s) => s.energy);
  const togglePowerSaveMode = useControlStore((s) => s.togglePowerSaveMode);

  if (!energy) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="flash-outline" size={48} color="#9E9E9E" />
        <Text style={styles.emptyTitle}>Telemetry Link Offline</Text>
      </View>
    );
  }

  const phase = PHASE_CONFIG[energy.dayNightPhase];
  const risk = RISK_CONFIG[energy.dustStormRisk];
  const effectiveConsumption = energy.powerSaveMode
    ? (energy.baseConsumptionKw * 0.65).toFixed(1)
    : energy.baseConsumptionKw.toFixed(1);
  const netDelta = (energy.solarGenerationKw - Number(effectiveConsumption)).toFixed(1);
  const isSurplus = Number(netDelta) >= 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Sol Day/Night Cycle Banner */}
      <View style={[styles.phaseBanner, { backgroundColor: phase.bg }]}>
        <View style={styles.phaseIconCircle}>
          <Ionicons name={phase.icon} size={24} color={phase.color} />
        </View>
        <View style={styles.phaseTextGroup}>
          <Text style={[styles.phaseTitle, { color: phase.color }]}>{phase.label}</Text>
          <Text style={styles.phaseSubtitle}>Martian Local Time: {energy.solTime}</Text>
        </View>
      </View>

      {/* Dust Storm Alert Card */}
      <View style={[styles.dustStormCard, { backgroundColor: risk.bg, borderColor: risk.color }]}>
        <View style={styles.dustHeader}>
          <Ionicons name="cloud-outline" size={20} color={risk.color} />
          <Text style={[styles.dustTitle, { color: risk.color }]}>Dust Storm Advisory</Text>
        </View>
        <Text style={styles.dustDescription}>
          {energy.dustStormRisk === 'nominal'
            ? 'Atmospheric optical depth (tau) is nominal at 0.45. Full solar generation operational.'
            : `Atmospheric opacity rising. Regional front countdown: ${energy.dustStormCountdownSols ?? 2} Sols. Prepare habitat battery buffer.`}
        </Text>
      </View>

      {/* Power Balance Dashboard (Solar Generation vs. Consumption) */}
      <View style={styles.balanceCard}>
        <Text style={styles.sectionHeader}>Instantaneous Power Balance</Text>
        <View style={styles.balanceGrid}>
          <View style={styles.balanceTile}>
            <View style={styles.tileHeader}>
              <Ionicons name="sunny-outline" size={18} color="#F57C00" />
              <Text style={styles.tileLabel}>Solar Inflow</Text>
            </View>
            <Text style={[styles.tileValue, { color: '#F57C00' }]}>
              {energy.solarGenerationKw.toFixed(1)} kW
            </Text>
            <Text style={styles.tileSub}>Photovoltaic Array</Text>
          </View>

          <View style={styles.balanceTile}>
            <View style={styles.tileHeader}>
              <Ionicons name="hardware-chip-outline" size={18} color="#D84315" />
              <Text style={styles.tileLabel}>Habitat Draw</Text>
            </View>
            <Text style={[styles.tileValue, { color: '#D84315' }]}>{effectiveConsumption} kW</Text>
            <Text style={styles.tileSub}>
              {energy.powerSaveMode ? 'Power-Save (65%)' : 'Nominal Load'}
            </Text>
          </View>
        </View>

        <View style={[styles.netBadge, { backgroundColor: isSurplus ? '#E8F5E9' : '#FFEBEE' }]}>
          <Ionicons
            name={isSurplus ? 'trending-up' : 'trending-down'}
            size={18}
            color={isSurplus ? '#2E7D32' : '#C62828'}
          />
          <Text style={[styles.netText, { color: isSurplus ? '#2E7D32' : '#C62828' }]}>
            Net Grid Balance: {isSurplus ? `+${netDelta} kW (Charging)` : `${netDelta} kW (Discharging)`}
          </Text>
        </View>
      </View>

      {/* Battery Reserve & Hours Remaining */}
      <View style={styles.batteryCard}>
        <View style={styles.batteryHeader}>
          <View style={styles.batteryTitleGroup}>
            <Ionicons name="battery-charging" size={24} color="#2E7D32" />
            <View>
              <Text style={styles.batteryTitle}>Station Battery Storage</Text>
              <Text style={styles.batteryCap}>{energy.batteryCapacityKwh} kWh Li-Titanate Buffer</Text>
            </View>
          </View>
          <Text style={styles.batteryPercent}>{energy.batteryPct}%</Text>
        </View>

        {/* Visual Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${energy.batteryPct}%`,
                backgroundColor:
                  energy.batteryPct >= 50
                    ? '#2E7D32'
                    : energy.batteryPct >= 25
                    ? '#EF6C00'
                    : '#C62828',
              },
            ]}
          />
        </View>

        <View style={styles.batteryEstimateRow}>
          <View style={styles.estimateItem}>
            <Ionicons name="timer-outline" size={16} color="#424242" />
            <Text style={styles.estimateText}>
              Estimated Hours Remaining:{' '}
              <Text style={styles.estimateHighlight}>{energy.batteryHoursRemaining} hrs</Text>
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: energy.batteryHoursRemaining >= 4 ? '#C8E6C9' : '#FFCDD2',
              },
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                { color: energy.batteryHoursRemaining >= 4 ? '#2E7D32' : '#C62828' },
              ]}
            >
              {energy.batteryHoursRemaining >= 4 ? 'SAFE (≥4H)' : 'CRITICAL (<4H)'}
            </Text>
          </View>
        </View>
      </View>

      {/* Emergency Power-Saving Toggle */}
      <View style={styles.toggleCard}>
        <View style={styles.toggleTextGroup}>
          <Text style={styles.toggleTitle}>Dust Storm Power-Saving Mode</Text>
          <Text style={styles.toggleDesc}>
            Dims non-essential cabin lighting, throttles non-critical pump loops, and extends battery
            reserve by ~35%.
          </Text>
        </View>
        <Switch
          value={energy.powerSaveMode}
          onValueChange={togglePowerSaveMode}
          trackColor={{ false: '#E0E0E0', true: '#D84315' }}
          thumbColor={energy.powerSaveMode ? '#FFFFFF' : '#FFFFFF'}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 16, color: '#757575', marginTop: 12 },
  phaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  phaseIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseTextGroup: { flex: 1 },
  phaseTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.3 },
  phaseSubtitle: { fontSize: 12, color: '#616161', marginTop: 2 },
  dustStormCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  dustHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  dustTitle: { fontSize: 13, fontWeight: '800' },
  dustDescription: { fontSize: 12, color: '#424242', lineHeight: 17 },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#424242', marginBottom: 12 },
  balanceGrid: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  balanceTile: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  tileHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  tileLabel: { fontSize: 11, fontWeight: '700', color: '#616161' },
  tileValue: { fontSize: 18, fontWeight: '800', marginVertical: 2 },
  tileSub: { fontSize: 10, color: '#9E9E9E' },
  netBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  netText: { fontSize: 12, fontWeight: '700' },
  batteryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  batteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  batteryTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  batteryTitle: { fontSize: 14, fontWeight: '700', color: '#212121' },
  batteryCap: { fontSize: 11, color: '#757575' },
  batteryPercent: { fontSize: 20, fontWeight: '800', color: '#2E7D32' },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: { height: '100%', borderRadius: 5 },
  batteryEstimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimateItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  estimateText: { fontSize: 12, color: '#616161' },
  estimateHighlight: { fontWeight: '800', color: '#212121' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusPillText: { fontSize: 10, fontWeight: '800' },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 12,
  },
  toggleTextGroup: { flex: 1 },
  toggleTitle: { fontSize: 13, fontWeight: '700', color: '#212121' },
  toggleDesc: { fontSize: 11, color: '#757575', marginTop: 4, lineHeight: 16 },
});
