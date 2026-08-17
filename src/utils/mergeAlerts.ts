import { HabitatAlert } from '../types/control';

function isSameAlert(left: HabitatAlert, right: HabitatAlert): boolean {
  return (
    left.id === right.id &&
    left.habitatId === right.habitatId &&
    left.habitatTitle === right.habitatTitle &&
    left.sector === right.sector &&
    left.severity === right.severity &&
    left.category === right.category &&
    left.title === right.title &&
    left.message === right.message &&
    left.suggestedAction === right.suggestedAction &&
    left.timestampSol === right.timestampSol &&
    left.timestampTime === right.timestampTime &&
    left.status === right.status &&
    left.snoozedUntilSol === right.snoozedUntilSol
  );
}

export function mergeAlerts(previous: HabitatAlert[], incoming: HabitatAlert[]): HabitatAlert[] {
  const previousById = new Map(previous.map((alert) => [alert.id, alert]));

  const merged = incoming.map((alert) => {
    const existing = previousById.get(alert.id);
    if (!existing) return alert;

    const next: HabitatAlert = {
      ...alert,
      status: existing.status,
      snoozedUntilSol: existing.snoozedUntilSol,
    };

    return isSameAlert(existing, next) ? existing : next;
  });

  const reusedArray =
    merged.length === previous.length && merged.every((alert, index) => alert === previous[index]);

  return reusedArray ? previous : merged;
}
