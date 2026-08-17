import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { countActiveAlerts, countCriticalAlerts, useControlStore } from '../stores/controlStore';
import { spacing, status } from '../theme';

const BANNER = {
  critical: {
    icon: 'alert-circle' as const,
    bg: status.critical.bg,
    border: status.critical.border,
    text: status.critical.text,
    accent: status.critical.text,
  },
  warning: {
    icon: 'warning-outline' as const,
    bg: status.warning.bg,
    border: status.warning.border,
    text: status.warning.text,
    accent: status.warning.accent,
  },
};

export default function IncidentBanner() {
  const router = useRouter();
  const activeAlerts = useControlStore((s) => countActiveAlerts(s.alerts));
  const criticalCount = useControlStore((s) => countCriticalAlerts(s.alerts));

  if (activeAlerts === 0) return null;

  const isCritical = criticalCount > 0;
  const tone = isCritical ? BANNER.critical : BANNER.warning;
  const message = isCritical
    ? `${criticalCount} Critical Telemetry Alert(s) — Tap for Control Center`
    : `${activeAlerts} Habitat Warning(s) Active — Tap for Diagnostics`;

  return (
    <TouchableOpacity
      style={[styles.banner, { backgroundColor: tone.bg, borderBottomColor: tone.border }]}
      onPress={() => router.push('/control')}
      activeOpacity={0.85}
    >
      <Ionicons name={tone.icon} size={18} color={tone.text} />
      <Text style={[styles.message, { color: tone.accent }]} numberOfLines={1}>
        {message}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={tone.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  message: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
});
