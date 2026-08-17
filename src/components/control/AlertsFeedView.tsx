import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORY_ICONS, SEVERITY_COLORS } from '../../constants/alerts';
import { FLATLIST_PERF } from '../../constants/listPerformance';
import { useControlStore } from '../../stores/controlStore';
import { brand, neutral, radius, shadow, spacing, status } from '../../theme';
import { HabitatAlert } from '../../types/control';
import { Badge, Card, EmptyState } from '../ui';
import AlertSeverityFilters from './AlertSeverityFilters';

function AlertCard({
  alert,
  onPress,
  onPressHabitat,
}: {
  alert: HabitatAlert;
  onPress: (id: string) => void;
  onPressHabitat: (habitatId: string) => void;
}) {
  const severityStyle = SEVERITY_COLORS[alert.severity];
  const iconName = CATEGORY_ICONS[alert.category];

  return (
    <TouchableOpacity onPress={() => onPress(alert.id)} activeOpacity={0.85}>
      <Card borderColor={severityStyle.border} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.categoryIconCircle, { backgroundColor: severityStyle.bg }]}>
              <Ionicons name={iconName} size={16} color={severityStyle.text} />
            </View>
            <Text style={styles.alertTitle} numberOfLines={2}>
              {alert.title}
            </Text>
          </View>
          <Badge label={alert.severity.toUpperCase()} tone={alert.severity} />
        </View>

        <View style={styles.metaRow}>
          <TouchableOpacity
            style={styles.habitatLink}
            onPress={() => onPressHabitat(alert.habitatId)}
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

        <Text style={styles.messageText} numberOfLines={3}>
          {alert.message}
        </Text>

        <View style={styles.respondRow}>
          <Text style={styles.respondText}>Tap to respond</Text>
          <Ionicons name="chevron-forward" size={16} color={brand.primary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const MemoAlertCard = memo(AlertCard);

export default function AlertsFeedView() {
  const router = useRouter();
  const alerts = useControlStore((s) => s.alerts);
  const severityFilter = useControlStore((s) => s.severityFilter);
  const setSeverityFilter = useControlStore((s) => s.setSeverityFilter);

  const activeAlerts = useMemo(
    () => alerts.filter((a) => a.status === 'active'),
    [alerts],
  );
  const filteredAlerts = useMemo(
    () => activeAlerts.filter((a) => severityFilter === 'all' || a.severity === severityFilter),
    [activeAlerts, severityFilter],
  );

  const counts = useMemo(() => {
    let critical = 0;
    let warning = 0;
    let info = 0;
    for (const alert of activeAlerts) {
      if (alert.severity === 'critical') critical += 1;
      else if (alert.severity === 'warning') warning += 1;
      else info += 1;
    }
    return { all: activeAlerts.length, critical, warning, info };
  }, [activeAlerts]);

  const handleAlertPress = useCallback(
    (alertId: string) => {
      router.push({ pathname: '/control/alert/[id]', params: { id: alertId } });
    },
    [router],
  );

  const handleHabitatPress = useCallback((habitatId: string) => {
    if (habitatId && habitatId !== 'unknown') {
      router.push({ pathname: '/property/unlock/[id]', params: { id: habitatId } });
    }
  }, [router]);

  const keyExtractor = useCallback((item: HabitatAlert) => item.id, []);

  const renderItem = useCallback<ListRenderItem<HabitatAlert>>(
    ({ item }) => (
      <MemoAlertCard
        alert={item}
        onPress={handleAlertPress}
        onPressHabitat={handleHabitatPress}
      />
    ),
    [handleAlertPress, handleHabitatPress],
  );

  const emptySubtitle = useMemo(
    () =>
      severityFilter === 'all'
        ? 'Settlement diagnostics report all habitat life-support loops running within nominal bounds.'
        : `No alerts found with ${severityFilter} severity rating.`,
    [severityFilter],
  );

  const listEmpty = useMemo(
    () => (
      <EmptyState
        icon="shield-checkmark-outline"
        iconSize={54}
        iconColor={status.safe.text}
        titleColor={status.safe.text}
        title="All Clear — No Active Incidents"
        subtitle={emptySubtitle}
      />
    ),
    [emptySubtitle],
  );

  const listContentStyle = useMemo(
    () => [styles.listContent, filteredAlerts.length === 0 && styles.emptyList],
    [filteredAlerts.length],
  );

  return (
    <View style={styles.container}>
      <AlertSeverityFilters
        selected={severityFilter}
        counts={counts}
        onSelect={setSeverityFilter}
      />

      <FlatList
        data={filteredAlerts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        {...FLATLIST_PERF}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={listContentStyle}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing['3xl'],
    paddingBottom: spacing['8xl'],
    gap: spacing.xl,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    elevation: 2,
    shadowColor: shadow.color,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
    fontSize: 14,
    fontWeight: '700',
    color: neutral.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  habitatLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: brand.primaryTint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 1,
    borderRadius: radius.sm,
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
    marginBottom: spacing.lg,
  },
  respondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  respondText: {
    fontSize: 12,
    fontWeight: '700',
    color: brand.primary,
  },
});
