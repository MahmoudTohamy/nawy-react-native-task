import { useMemo } from 'react';
import { useControlStore } from '../stores/controlStore';
import { filterAlertsBySeverity, getAlertSnapshot } from '../utils/filterAlerts';

export function useFilteredAlerts() {
  const alerts = useControlStore((s) => s.alerts);
  const severityFilter = useControlStore((s) => s.severityFilter);
  const snapshot = getAlertSnapshot(alerts);

  const filteredAlerts = useMemo(
    () => filterAlertsBySeverity(snapshot.activeAlerts, severityFilter),
    [snapshot.activeAlerts, severityFilter],
  );

  return { filteredAlerts, counts: snapshot.counts, severityFilter };
}
