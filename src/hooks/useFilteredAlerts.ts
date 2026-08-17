import { useMemo } from 'react';
import { useControlStore } from '../stores/controlStore';
import {
  countAlertsBySeverity,
  filterAlertsBySeverity,
  getActiveAlerts,
} from '../utils/filterAlerts';

export function useFilteredAlerts() {
  const alerts = useControlStore((s) => s.alerts);
  const severityFilter = useControlStore((s) => s.severityFilter);

  const activeAlerts = useMemo(() => getActiveAlerts(alerts), [alerts]);

  const filteredAlerts = useMemo(
    () => filterAlertsBySeverity(activeAlerts, severityFilter),
    [activeAlerts, severityFilter],
  );

  const counts = useMemo(() => countAlertsBySeverity(activeAlerts), [activeAlerts]);

  return { filteredAlerts, counts, severityFilter };
}
