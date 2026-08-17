import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AlertCardActions from '../../../components/control/AlertCardActions';
import { Badge, Card, EmptyState } from '../../../components/ui';
import { CATEGORY_ICONS, SEVERITY_COLORS } from '../../../constants/alerts';
import { useControlStore } from '../../../stores/controlStore';
import { brand, neutral, radius, spacing, status } from '../../../theme';

export default function AlertResponseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const alert = useControlStore((s) => s.alerts.find((item) => item.id === id));
  const dismissAlert = useControlStore((s) => s.dismissAlert);
  const snoozeAlert = useControlStore((s) => s.snoozeAlert);

  const severityStyle = useMemo(
    () => (alert ? SEVERITY_COLORS[alert.severity] : null),
    [alert],
  );

  const handleDismiss = useCallback(() => {
    if (!id) return;
    dismissAlert(id);
    router.back();
  }, [dismissAlert, id, router]);

  const handleSnooze = useCallback(() => {
    if (!id) return;
    snoozeAlert(id);
    router.back();
  }, [id, router, snoozeAlert]);

  const handleHabitatPress = useCallback(() => {
    if (!alert?.habitatId || alert.habitatId === 'unknown') return;
    router.push({ pathname: '/property/unlock/[id]', params: { id: alert.habitatId } });
  }, [alert, router]);

  if (!alert || !severityStyle) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Alert Not Found"
        subtitle="This incident is no longer in the active telemetry loop."
        actionLabel="Return to Control Center"
        actionVariant="primary"
        onAction={() => router.back()}
      />
    );
  }

  const iconName = CATEGORY_ICONS[alert.category];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: 'Incident Response',
          headerBackTitle: 'Alerts',
        }}
      />

      <Card borderColor={severityStyle.border}>
        <View style={styles.cardHeader}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.categoryIconCircle, { backgroundColor: severityStyle.bg }]}>
              <Ionicons name={iconName} size={16} color={severityStyle.text} />
            </View>
            <Text style={styles.alertTitle}>{alert.title}</Text>
          </View>
          <Badge label={alert.severity.toUpperCase()} tone={alert.severity} />
        </View>

        <View style={styles.metaRow}>
          <TouchableOpacity
            style={styles.habitatLink}
            onPress={handleHabitatPress}
            activeOpacity={0.7}
          >
            <Ionicons name="business-outline" size={13} color={brand.primary} />
            <Text style={styles.habitatName}>{alert.habitatTitle}</Text>
            <Text style={styles.sectorText}>({alert.sector})</Text>
          </TouchableOpacity>
          <Text style={styles.solTimestamp}>
            Sol {alert.timestampSol} · {alert.timestampTime}
          </Text>
        </View>

        <Text style={styles.messageText}>{alert.message}</Text>

        <View style={styles.protocolBox}>
          <Ionicons
            name="shield-checkmark"
            size={16}
            color={status.protocol.text}
            style={styles.protocolIcon}
          />
          <View style={styles.protocolContent}>
            <Text style={styles.protocolLabel}>RECOMMENDED PROTOCOL</Text>
            <Text style={styles.protocolText}>{alert.suggestedAction}</Text>
          </View>
        </View>

        <AlertCardActions onDismiss={handleDismiss} onSnooze={handleSnooze} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral.background,
  },
  content: {
    padding: spacing['3xl'],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  categoryIconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: neutral.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  habitatLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: brand.primaryTint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 1,
    borderRadius: radius.sm,
    flexShrink: 1,
  },
  habitatName: {
    fontSize: 11,
    fontWeight: '700',
    color: brand.primary,
  },
  sectorText: {
    fontSize: 11,
    color: neutral.textSubtle,
  },
  solTimestamp: {
    fontSize: 11,
    color: neutral.textDisabled,
    fontWeight: '500',
  },
  messageText: {
    fontSize: 13,
    color: neutral.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.xl,
  },
  protocolBox: {
    flexDirection: 'row',
    backgroundColor: status.protocol.bg,
    borderWidth: 1,
    borderColor: status.protocol.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing['3xl'],
    gap: spacing.md,
  },
  protocolIcon: {
    marginTop: 2,
  },
  protocolContent: {
    flex: 1,
  },
  protocolLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: status.protocol.label,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  protocolText: {
    fontSize: 12,
    color: status.protocol.text,
    fontWeight: '600',
    lineHeight: 17,
  },
});
