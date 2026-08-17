import { AlertSnapshot, AlertSeverityFilter, HabitatAlert } from '../types/control';

const EMPTY_SNAPSHOT: AlertSnapshot = {
  activeAlerts: [],
  counts: { all: 0, critical: 0, warning: 0, info: 0 },
};

let cachedAlerts: HabitatAlert[] | null = null;
let cachedSnapshot: AlertSnapshot = EMPTY_SNAPSHOT;

export function getAlertSnapshot(alerts: HabitatAlert[]): AlertSnapshot {
  if (alerts === cachedAlerts) return cachedSnapshot;

  const activeAlerts: HabitatAlert[] = [];
  let critical = 0;
  let warning = 0;
  let info = 0;

  for (const alert of alerts) {
    if (alert.status !== 'active') continue;
    activeAlerts.push(alert);
    if (alert.severity === 'critical') critical += 1;
    else if (alert.severity === 'warning') warning += 1;
    else info += 1;
  }

  cachedAlerts = alerts;
  cachedSnapshot = {
    activeAlerts,
    counts: { all: activeAlerts.length, critical, warning, info },
  };
  return cachedSnapshot;
}

export function filterAlertsBySeverity(
  alerts: HabitatAlert[],
  severityFilter: AlertSeverityFilter,
): HabitatAlert[] {
  if (severityFilter === 'all') return alerts;
  return alerts.filter((alert) => alert.severity === severityFilter);
}
