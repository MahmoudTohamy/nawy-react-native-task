import { StyleSheet, Text, View } from 'react-native';
import { useControlStore } from '../../stores/controlStore';
import { brand, neutral, spacing, status } from '../../theme';
import { getAlertSnapshot } from '../../utils/filterAlerts';

const SAFETY_LABEL = 'COLONY SAFETY';
const INCIDENTS_LABEL = 'ACTIVE INCIDENTS';
const TELEMETRY_LABEL = 'TELEMETRY LOOP';
const TELEMETRY_VALUE = 'Live · Mesh-Net';
const ALL_SAFE_LABEL = 'ALL SAFE';

export default function ColonyStatusBar() {
  const activeAlerts = useControlStore((s) => getAlertSnapshot(s.alerts).counts.all);
  const criticalCount = useControlStore((s) => getAlertSnapshot(s.alerts).counts.critical);
  const safetyColor = criticalCount > 0 ? status.critical.text : status.safe.text;
  const safetyLabel = criticalCount > 0 ? `${criticalCount} CRITICAL` : ALL_SAFE_LABEL;

  return (
    <View style={styles.topBar}>
      <View style={styles.topBarItem}>
        <Text style={styles.topBarLabel}>{SAFETY_LABEL}</Text>
        <View style={styles.statusIndicatorRow}>
          <View style={[styles.pulseDot, { backgroundColor: safetyColor }]} />
          <Text style={[styles.statusIndicatorText, { color: safetyColor }]}>{safetyLabel}</Text>
        </View>
      </View>

      <View style={styles.topBarDivider} />

      <View style={styles.topBarItem}>
        <Text style={styles.topBarLabel}>{INCIDENTS_LABEL}</Text>
        <Text style={styles.topBarValue}>{activeAlerts} Reports</Text>
      </View>

      <View style={styles.topBarDivider} />

      <View style={styles.topBarItem}>
        <Text style={styles.topBarLabel}>{TELEMETRY_LABEL}</Text>
        <Text style={styles.topBarValue}>{TELEMETRY_VALUE}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: brand.dark,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['3xl'],
  },
  topBarItem: {
    alignItems: 'center',
    flex: 1,
  },
  topBarLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: neutral.textDisabled,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  topBarValue: {
    fontSize: 12,
    fontWeight: '700',
    color: neutral.white,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusIndicatorText: {
    fontSize: 12,
    fontWeight: '800',
  },
  topBarDivider: {
    width: 1,
    height: 22,
    backgroundColor: neutral.textSecondary,
  },
});
