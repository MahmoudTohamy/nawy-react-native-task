import { create } from 'zustand';
import { fetchAlerts, fetchEnergyStatus } from '../services/controlService';
import { AlertSeverity, EnergyStatus, HabitatAlert } from '../types/control';

export type ControlTab = 'alerts' | 'lifesupport' | 'energy';

type ControlState = {
  activeTab: ControlTab;
  alerts: HabitatAlert[];
  severityFilter: AlertSeverity | 'all';
  energy: EnergyStatus | null;
  selectedHabitatId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  setActiveTab: (tab: ControlTab) => void;
  setSeverityFilter: (filter: AlertSeverity | 'all') => void;
  setSelectedHabitatId: (id: string | null) => void;
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
  selectedHabitatId: null,
  loading: false,
  error: null,

  setActiveTab: (activeTab) => set({ activeTab }),
  setSeverityFilter: (severityFilter) => set({ severityFilter }),
  setSelectedHabitatId: (selectedHabitatId) => set({ selectedHabitatId }),

  fetchControlData: async () => {
    set({ loading: true, error: null });
    try {
      const [alerts, energy] = await Promise.all([fetchAlerts(), fetchEnergyStatus()]);
      set({ alerts, energy, loading: false });
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
      const base = state.energy.baseConsumptionKw;
      const solar = state.energy.solarGenerationKw;
      const cap = state.energy.batteryCapacityKwh;
      const pct = state.energy.batteryPct;

      const effectiveConsumption = nextPowerSave ? base * 0.65 : base;
      const netDraw = Math.max(0.1, effectiveConsumption - (solar * 0.3));
      const availableKwh = (pct / 100) * cap;
      const batteryHoursRemaining = Number((availableKwh / netDraw).toFixed(1));

      return {
        energy: {
          ...state.energy,
          powerSaveMode: nextPowerSave,
          batteryHoursRemaining,
        },
      };
    }),

  getActiveAlertCount: () => get().alerts.filter((a) => a.status === 'active').length,

  getCriticalAlertCount: () =>
    get().alerts.filter((a) => a.status === 'active' && a.severity === 'critical').length,
}));
