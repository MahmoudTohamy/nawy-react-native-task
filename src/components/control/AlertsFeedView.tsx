import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { FLATLIST_PERF } from '../../constants/listPerformance';
import { useFilteredAlerts } from '../../hooks/useFilteredAlerts';
import { useControlStore } from '../../stores/controlStore';
import { spacing, status } from '../../theme';
import { HabitatAlert } from '../../types/control';
import { AlertSeverityFilter } from '../../utils/filterAlerts';
import { EmptyState } from '../ui';
import AlertCard from './AlertCard';
import AlertSeverityFilters from './AlertSeverityFilters';

const UNKNOWN_HABITAT_ID = 'unknown';
const EMPTY_TITLE = 'All Clear — No Active Incidents';
const EMPTY_SUBTITLE_ALL =
  'Settlement diagnostics report all habitat life-support loops running within nominal bounds.';

function getEmptySubtitle(severityFilter: AlertSeverityFilter): string {
  if (severityFilter === 'all') return EMPTY_SUBTITLE_ALL;
  return `No alerts found with ${severityFilter} severity rating.`;
}

export default function AlertsFeedView() {
  const router = useRouter();
  const setSeverityFilter = useControlStore((s) => s.setSeverityFilter);
  const { filteredAlerts, counts, severityFilter } = useFilteredAlerts();

  const handleAlertPress = useCallback(
    (alertId: string) => {
      router.push({ pathname: '/control/alert/[id]', params: { id: alertId } });
    },
    [router],
  );

  const handleHabitatPress = useCallback(
    (habitatId: string) => {
      if (habitatId && habitatId !== UNKNOWN_HABITAT_ID) {
        router.push({ pathname: '/property/unlock/[id]', params: { id: habitatId } });
      }
    },
    [router],
  );

  const keyExtractor = useCallback((item: HabitatAlert) => item.id, []);

  const renderItem = useCallback<ListRenderItem<HabitatAlert>>(
    ({ item }) => (
      <AlertCard alert={item} onPress={handleAlertPress} onPressHabitat={handleHabitatPress} />
    ),
    [handleAlertPress, handleHabitatPress],
  );

  const emptySubtitle = useMemo(() => getEmptySubtitle(severityFilter), [severityFilter]);

  const listEmpty = useCallback(
    () => (
      <EmptyState
        icon="shield-checkmark-outline"
        iconSize={54}
        iconColor={status.safe.text}
        titleColor={status.safe.text}
        title={EMPTY_TITLE}
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
});
