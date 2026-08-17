import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Badge, Card, EmptyState } from '../ui';
import { useControlStore } from '../../stores/controlStore';
import { energy, neutral, radius, spacing, status } from '../../theme';

const PHASE_CONFIG = {
  day:  { label: 'High Solar Irradiance (Day)',        icon: 'sunny' as const,         color: energy.solarOrange, bg: energy.solarOrangeBg },
  dusk: { label: 'Approaching Terminator (Dusk)',      icon: 'partly-sunny' as const,   color: energy.duskRed,     bg: energy.duskRedBg },
  night:{ label: 'Solar Eclipse / Night Sol',          icon: 'moon' as const,           color: energy.nightIndigo, bg: energy.nightIndigoBg },
  dawn: { label: 'Dawn Illumination Rising',           icon: 'sunny-outline' as const,  color: energy.dawnAmber,   bg: energy.dawnAmberBg },
};

const RISK_CONFIG = {
  nominal:  { label: 'Nominal — No Storm Detected',         color: status.safe.text,     bg: status.safe.bg },
  moderate: { label: 'Moderate — Class-2 Front Expected',   color: status.warning.text,  bg: status.warning.bg },
  severe:   { label: 'Severe Dust Blackout Warning',        color: status.critical.text, bg: status.critical.bg },
};

export default function EnergyStatusView() {
  const energyData = useControlStore((s) => s.energy);
  const togglePowerSaveMode = useControlStore((s) => s.togglePowerSaveMode);

  if (!energyData) {
    return <EmptyState icon="flash-outline" title="Telemetry Link Offline" />;
  }

  const phase = PHASE_CONFIG[energyData.dayNightPhase];
  const risk = RISK_CONFIG[energyData.dustStormRisk];
  const effectiveConsumption = energyData.powerSaveMode
    ? (energyData.baseConsumptionKw * 0.65).toFixed(1)
    : energyData.baseConsumptionKw.toFixed(1);
  const netDelta = (energyData.solarGenerationKw - Number(effectiveConsumption)).toFixed(1);
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
          <Text style={styles.phaseSubtitle}>Martian Local Time: {energyData.solTime}</Text>
        </View>
      </View>

      {/* Dust Storm Alert Card */}
      <View style={[styles.dustStormCard, { backgroundColor: risk.bg, borderColor: risk.color }]}>
        <View style={styles.dustHeader}>
          <Ionicons name="cloud-outline" size={20} color={risk.color} />
          <Text style={[styles.dustTitle, { color: risk.color }]}>Dust Storm Advisory</Text>
        </View>
        <Text style={styles.dustDescription}>
          {energyData.dustStormRisk === 'nominal'
            ? 'Atmospheric optical depth (tau) is nominal at 0.45. Full solar generation operational.'
            : `Atmospheric opacity rising. Regional front countdown: ${energyData.dustStormCountdownSols ?? 2} Sols. Prepare habitat battery buffer.`}
        </Text>
      </View>

      {/* Power Balance Dashboard */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Instantaneous Power Balance</Text>
        <View style={styles.balanceGrid}>
          <View style={styles.balanceTile}>
            <View style={styles.tileHeader}>
              <Ionicons name="sunny-outline" size={18} color={energy.solarOrange} />
              <Text style={styles.tileLabel}>Solar Inflow</Text>
            </View>
            <Text style={[styles.tileValue, { color: energy.solarOrange }]}>
              {energyData.solarGenerationKw.toFixed(1)} kW
            </Text>
            <Text style={styles.tileSub}>Photovoltaic Array</Text>
          </View>

          <View style={styles.balanceTile}>
            <View style={styles.tileHeader}>
              <Ionicons name="hardware-chip-outline" size={18} color={neutral.textPrimary} />
              <Text style={styles.tileLabel}>Habitat Draw</Text>
            </View>
            <Text style={[styles.tileValue, { color: neutral.textPrimary }]}>{effectiveConsumption} kW</Text>
            <Text style={styles.tileSub}>
              {energyData.powerSaveMode ? 'Power-Save (65%)' : 'Nominal Load'}
            </Text>
          </View>
        </View>

        <View style={[styles.netBadge, { backgroundColor: isSurplus ? status.safe.bg : status.critical.bg }]}>
          <Ionicons
            name={isSurplus ? 'trending-up' : 'trending-down'}
            size={18}
            color={isSurplus ? status.safe.text : status.critical.text}
          />
          <Text style={[styles.netText, { color: isSurplus ? status.safe.text : status.critical.text }]}>
            Net Grid Balance: {isSurplus ? `+${netDelta} kW (Charging)` : `${netDelta} kW (Discharging)`}
          </Text>
        </View>
      </Card>

      {/* Battery Reserve & Hours Remaining */}
      <Card style={styles.sectionCard}>
        <View style={styles.batteryHeader}>
          <View style={styles.batteryTitleGroup}>
            <Ionicons name="battery-charging" size={24} color={status.safe.text} />
            <View>
              <Text style={styles.batteryTitle}>Station Battery Storage</Text>
              <Text style={styles.batteryCap}>{energyData.batteryCapacityKwh} kWh Li-Titanate Buffer</Text>
            </View>
          </View>
          <Text style={styles.batteryPercent}>{energyData.batteryPct}%</Text>
        </View>

        {/* Visual Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${energyData.batteryPct}%`,
                backgroundColor:
                  energyData.batteryPct >= 50
                    ? status.safe.text
                    : energyData.batteryPct >= 25
                    ? status.warning.text
                    : status.critical.text,
              },
            ]}
          />
        </View>

        <View style={styles.batteryEstimateRow}>
          <View style={styles.estimateItem}>
            <Ionicons name="timer-outline" size={16} color={neutral.textSecondary} />
            <Text style={styles.estimateText}>
              Estimated Hours Remaining:{' '}
              <Text style={styles.estimateHighlight}>{energyData.batteryHoursRemaining} hrs</Text>
            </Text>
          </View>
          <Badge
            label={energyData.batteryHoursRemaining >= 4 ? 'SAFE (≥4H)' : 'CRITICAL (<4H)'}
            tone={energyData.batteryHoursRemaining >= 4 ? 'safe' : 'critical'}
          />
        </View>
      </Card>

      {/* Emergency Power-Saving Toggle */}
      <Card style={styles.toggleCard}>
        <View style={styles.toggleTextGroup}>
          <Text style={styles.toggleTitle}>Dust Storm Power-Saving Mode</Text>
          <Text style={styles.toggleDesc}>
            Dims non-essential cabin lighting, throttles non-critical pump loops, and extends battery
            reserve by ~35%.
          </Text>
        </View>
        <Switch
          value={energyData.powerSaveMode}
          onValueChange={togglePowerSaveMode}
          trackColor={{ false: neutral.chipBorder, true: neutral.textPrimary }}
          thumbColor={neutral.white}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing['3xl'], paddingBottom: spacing['7xl'] },
  phaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['2xl'],
    borderRadius: radius.xl,
    marginBottom: spacing.xl,
    gap: spacing.xl,
  },
  phaseIconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseTextGroup: { flex: 1 },
  phaseTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.3 },
  phaseSubtitle: { fontSize: 12, color: neutral.textMuted, marginTop: 2 },
  dustStormCard: {
    borderRadius: radius.xl,
    padding: spacing['2xl'],
    borderWidth: 1,
    marginBottom: spacing['3xl'],
  },
  dustHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  dustTitle: { fontSize: 13, fontWeight: '800' },
  dustDescription: { fontSize: 12, color: neutral.textSecondary, lineHeight: 17 },
  sectionCard: {
    marginBottom: spacing['3xl'],
  },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: neutral.textSecondary, marginBottom: spacing.xl },
  balanceGrid: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.xl },
  balanceTile: {
    flex: 1,
    backgroundColor: neutral.background,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: neutral.border,
  },
  tileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  tileLabel: { fontSize: 11, fontWeight: '700', color: neutral.textMuted },
  tileValue: { fontSize: 18, fontWeight: '800', marginVertical: 2 },
  tileSub: { fontSize: 10, color: neutral.textDisabled },
  netBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  netText: { fontSize: 12, fontWeight: '700' },
  batteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  batteryTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  batteryTitle: { fontSize: 14, fontWeight: '700', color: neutral.textPrimary },
  batteryCap: { fontSize: 11, color: neutral.textSubtle },
  batteryPercent: { fontSize: 20, fontWeight: '800', color: status.safe.text },
  progressBarTrack: {
    height: 10,
    backgroundColor: neutral.chipBorder,
    borderRadius: radius.xs + 1,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  progressBarFill: { height: '100%', borderRadius: radius.xs + 1 },
  batteryEstimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimateItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  estimateText: { fontSize: 12, color: neutral.textMuted },
  estimateHighlight: { fontWeight: '800', color: neutral.textPrimary },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  toggleTextGroup: { flex: 1 },
  toggleTitle: { fontSize: 13, fontWeight: '700', color: neutral.textPrimary },
  toggleDesc: { fontSize: 11, color: neutral.textSubtle, marginTop: spacing.xs, lineHeight: 16 },
});
