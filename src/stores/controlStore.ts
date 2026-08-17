import { create } from 'zustand';
import { computeBatteryHoursRemaining, fetchAlerts, fetchEnergyStatus } from '../services/controlService';
import { AlertSeverityFilter, ControlTab, EnergyStatus, HabitatAlert } from '../types/control';

export function countActiveAlerts(alerts: HabitatAlert[]): number {
  return alerts.reduce((count, alert) => (alert.status === 'active' ? count + 1 : count), 0);
}

export function countCriticalAlerts(alerts: HabitatAlert[]): number {
  return alerts.reduce(
    (count, alert) => (alert.status === 'active' && alert.severity === 'critical' ? count + 1 : count),
    0,
  );
}

type ControlState = {
  activeTab: ControlTab;
  alerts: HabitatAlert[];
  severityFilter: AlertSeverityFilter;
  energy: EnergyStatus | null;
  loading: boolean;
  error: string | null;

  setActiveTab: (tab: ControlTab) => void;
  setSeverityFilter: (filter: AlertSeverityFilter) => void;
  fetchControlData: () => Promise<void>;
  dismissAlert: (id: string) => void;
  snoozeAlert: (id: string) => void;
  togglePowerSaveMode: () => void;
  getActiveAlertCount: () => number;
  getCriticalAlertCount: () => number;
};

export const useControlStore = create<ControlState>((set, get) => ({
  activeTab: 'alerts',
  alerts: [],
  severityFilter: 'all',
  energy: null,
  loading: false,
  error: null,

  setActiveTab: (activeTab) => set({ activeTab }),
  setSeverityFilter: (severityFilter) => set({ severityFilter }),

  fetchControlData: async () => {
    const hasLocalData = get().alerts.length > 0 || get().energy != null;
    if (!hasLocalData) {
      set({ loading: true, error: null });
    } else {
      set({ error: null });
    }

    try {
      const [alerts, energy] = await Promise.all([fetchAlerts(), fetchEnergyStatus()]);
      set((state) => {
        const previousById = new Map(state.alerts.map((alert) => [alert.id, alert]));
        const mergedAlerts = alerts.map((alert) => {
          const previous = previousById.get(alert.id);
          if (!previous) return alert;
          return {
            ...alert,
            status: previous.status,
            snoozedUntilSol: previous.snoozedUntilSol,
          };
        });

        const powerSaveMode = state.energy?.powerSaveMode ?? energy.powerSaveMode;

        return {
          alerts: mergedAlerts,
          energy: {
            ...energy,
            powerSaveMode,
            batteryHoursRemaining: computeBatteryHoursRemaining({
              batteryPct: energy.batteryPct,
              batteryCapacityKwh: energy.batteryCapacityKwh,
              baseConsumptionKw: energy.baseConsumptionKw,
              solarGenerationKw: energy.solarGenerationKw,
              powerSaveMode,
            }),
          },
          loading: false,
        };
      });
    } catch {
      set({ loading: false, error: 'Failed to synchronize with Olympus control telemetry loop.' });
    }
  },

  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, status: 'dismissed' } : a)),
    })),

  snoozeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, status: 'snoozed', snoozedUntilSol: a.timestampSol + 2 } : a
      ),
    })),

  togglePowerSaveMode: () =>
    set((state) => {
      if (!state.energy) return state;
      const nextPowerSave = !state.energy.powerSaveMode;

      return {
        energy: {
          ...state.energy,
          powerSaveMode: nextPowerSave,
          batteryHoursRemaining: computeBatteryHoursRemaining({
            batteryPct: state.energy.batteryPct,
            batteryCapacityKwh: state.energy.batteryCapacityKwh,
            baseConsumptionKw: state.energy.baseConsumptionKw,
            solarGenerationKw: state.energy.solarGenerationKw,
            powerSaveMode: nextPowerSave,
          }),
        },
      };
    }),

  getActiveAlertCount: () => countActiveAlerts(get().alerts),
  getCriticalAlertCount: () => countCriticalAlerts(get().alerts),
}));
