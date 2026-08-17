import { HabitatAlert, AlertSeverityFilter } from '../types/control';

export type { AlertSeverityFilter };

export type AlertSeverityCounts = Record<AlertSeverityFilter, number>;

export function getActiveAlerts(alerts: HabitatAlert[]): HabitatAlert[] {
  return alerts.filter((alert) => alert.status === 'active');
}

export function filterAlertsBySeverity(
  alerts: HabitatAlert[],
  severityFilter: AlertSeverityFilter,
): HabitatAlert[] {
  if (severityFilter === 'all') return alerts;
  return alerts.filter((alert) => alert.severity === severityFilter);
}

export function countAlertsBySeverity(alerts: HabitatAlert[]): AlertSeverityCounts {
  let critical = 0;
  let warning = 0;
  let info = 0;

  for (const alert of alerts) {
    if (alert.severity === 'critical') critical += 1;
    else if (alert.severity === 'warning') warning += 1;
    else info += 1;
  }

  return { all: alerts.length, critical, warning, info };
}
