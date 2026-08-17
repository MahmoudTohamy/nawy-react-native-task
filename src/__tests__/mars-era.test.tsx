import React from 'react';
import { render } from '@testing-library/react-native';
import { AppConfig } from '../constants/config';
import { parseHabitat } from '../utils/parseHabitat';
import { getHabitability } from '../utils/habitatSafety';
import { filterHabitats } from '../utils/filterHabitats';
import { sortHabitats } from '../utils/sortHabitats';
import { useAccessStore } from '../stores/accessStore';
import HabitatCard from '../components/HabitatCard';
import { Habitat } from '../types/habitat';

describe('Mars-era Habitat Suite — Deliverable A', () => {
  describe('Defensive Parsing & Normalization', () => {
    test('status normalization handles uppercase and whitespace', () => {
      const h1 = parseHabitat({ id: '1', status: 'AVAILABLE' });
      const h2 = parseHabitat({ id: '2', status: '  Available  ' });
      const h3 = parseHabitat({ id: '3', status: 'pending' });
      const h4 = parseHabitat({ id: '4', status: 'sold' });
      const h5 = parseHabitat({ id: '5', status: 'unknown_value' });

      expect(h1.status).toBe('available');
      expect(h2.status).toBe('available');
      expect(h3.status).toBe('pending');
      expect(h4.status).toBe('occupied');
      expect(h5.status).toBe('maintenance');
    });

    test('corrupt lease credits (-1) parsed gracefully without crash', () => {
      const habitat = parseHabitat({
        id: 'prop_004',
        title: 'Corrupt Habitat',
        lease_credits: -1,
        life_support: {
          o2_level: 21.0,
          cabin_pressure_kpa: 98,
          temperature_c: 21,
          radiation_shielding_pct: 95,
          power_reserve_hrs: 5.0,
          co2_scrubber_status: 'active',
        },
      });

      expect(habitat.leaseCredits).toBeNull();
      expect(habitat.leaseLabel).toBe('Credits unavailable');
      expect(habitat.dataIssues).toContain('Invalid lease credits');
    });

    test('missing or malformed amenities defaults to empty array', () => {
      const h1 = parseHabitat({ id: 'h1', amenities: undefined });
      const h2 = parseHabitat({ id: 'h2', amenities: null });
      const h3 = parseHabitat({ id: 'h3', amenities: 'not-an-array' as any });
      const h4 = parseHabitat({ id: 'h4', amenities: ['Airlock', 123 as any, 'Solar'] });

      expect(h1.amenities).toEqual([]);
      expect(h2.amenities).toEqual([]);
      expect(h3.amenities).toEqual([]);
      expect(h3.dataIssues).toContain('Invalid amenities format');
      expect(h4.amenities).toEqual(['Airlock', 'Solar']);
    });
  });

  describe('Martian Habitability & Life Support Safety Scoring', () => {
    test('computes safe habitability when all vitals within safe thresholds', () => {
      const habitability = getHabitability({
        o2Level: 21.0,
        cabinPressureKpa: 95,
        temperatureC: 21,
        radiationShieldingPct: 95,
        powerReserveHrs: 6.0,
        co2ScrubberStatus: 'active',
      });
      expect(habitability).toBe('safe');
    });

    test('computes warning habitability when a metric enters warning band', () => {
      const habitability = getHabitability({
        o2Level: 18.5, // warning (18 - 19.5)
        cabinPressureKpa: 95,
        temperatureC: 21,
        radiationShieldingPct: 95,
        powerReserveHrs: 6.0,
        co2ScrubberStatus: 'active',
      });
      expect(habitability).toBe('warning');
    });

    test('computes critical habitability when worst-case metric fails', () => {
      const habitabilityO2 = getHabitability({
        o2Level: 17.0, // critical (<18)
        cabinPressureKpa: 95,
        temperatureC: 21,
        radiationShieldingPct: 95,
        powerReserveHrs: 6.0,
        co2ScrubberStatus: 'active',
      });
      expect(habitabilityO2).toBe('critical');

      const habitabilityScrubber = getHabitability({
        o2Level: 21.0,
        cabinPressureKpa: 95,
        temperatureC: 21,
        radiationShieldingPct: 95,
        powerReserveHrs: 6.0,
        co2ScrubberStatus: 'failed',
      });
      expect(habitabilityScrubber).toBe('critical');
    });
  });

  describe('Passphrase & Security Verification', () => {
    test('no hardcoded access passphrase in AppConfig', () => {
      expect((AppConfig as any).accessPassphrase).toBeUndefined();
    });

    test('accessStore session unlock works as expected', () => {
      const { unlockHabitat, isUnlocked } = useAccessStore.getState();
      expect(isUnlocked('prop_test_999')).toBe(false);

      unlockHabitat('prop_test_999');
      expect(useAccessStore.getState().isUnlocked('prop_test_999')).toBe(true);
    });
  });

  describe('Filtering & Sorting Logic', () => {
    const mockHabitats: Habitat[] = [
      parseHabitat({
        id: 'h1',
        title: 'Pod 1',
        bedrooms: 1,
        bathrooms: 1,
        lease_credits: 300,
        listed_at_sol: 500,
        life_support: {
          o2_level: 21.0,
          cabin_pressure_kpa: 95,
          temperature_c: 21,
          radiation_shielding_pct: 95,
          power_reserve_hrs: 6.0,
          co2_scrubber_status: 'active',
        },
      }),
      parseHabitat({
        id: 'h2',
        title: 'Pod 2',
        bedrooms: 3,
        bathrooms: 2,
        lease_credits: 800,
        listed_at_sol: 900,
        life_support: {
          o2_level: 18.5,
          cabin_pressure_kpa: 80,
          temperature_c: 20,
          radiation_shielding_pct: 88,
          power_reserve_hrs: 3.0,
          co2_scrubber_status: 'degraded',
        },
      }),
      parseHabitat({
        id: 'h3',
        title: 'Pod 3',
        bedrooms: 4,
        bathrooms: 3,
        lease_credits: -1, // corrupt price
        listed_at_sol: 1200,
        life_support: {
          o2_level: 17.0,
          cabin_pressure_kpa: 60,
          temperature_c: 14,
          radiation_shielding_pct: 80,
          power_reserve_hrs: 1.0,
          co2_scrubber_status: 'failed',
        },
      }),
    ];

    test('filters by minimum berths and bathrooms', () => {
      const filtered = filterHabitats(mockHabitats, {
        minBedrooms: 3,
        minBathrooms: 2,
        minLeaseCredits: null,
        maxLeaseCredits: null,
      });

      expect(filtered.map((h) => h.id)).toEqual(['h2', 'h3']);
    });

    test('filters by lease credits range and excludes corrupt price', () => {
      const filtered = filterHabitats(mockHabitats, {
        minBedrooms: null,
        minBathrooms: null,
        minLeaseCredits: 200,
        maxLeaseCredits: 500,
      });

      expect(filtered.map((h) => h.id)).toEqual(['h1']);
    });

    test('sorts by habitability with safe first', () => {
      const sorted = sortHabitats(mockHabitats, 'habitability');
      expect(sorted.map((h) => h.habitability)).toEqual(['safe', 'warning', 'critical']);
    });

    test('sorts by listed sol newest first', () => {
      const sorted = sortHabitats(mockHabitats, 'listedAtSol');
      expect(sorted.map((h) => h.listedAtSol)).toEqual([1200, 900, 500]);
    });
  });

  describe('Martian UI Components', () => {
    test('HabitatCard renders Mars metrics, telemetry, and badges', async () => {
      const habitat = parseHabitat({
        id: 'prop_001',
        title: 'Alpha Dome 3-Berth',
        lease_credits: 450,
        sector: 'Dome-7',
        grid_coordinates: 'Grid F-14',
        bedrooms: 3,
        bathrooms: 2,
        volume_m3: 420,
        status: 'available',
        life_support: {
          o2_level: 21.2,
          cabin_pressure_kpa: 98,
          temperature_c: 21,
          radiation_shielding_pct: 94,
          power_reserve_hrs: 6.2,
          co2_scrubber_status: 'active',
        },
      });

      const { getByText, queryByText } = await render(
        <HabitatCard habitat={habitat} onPress={() => {}} />
      );

      expect(getByText('Alpha Dome 3-Berth')).toBeTruthy();
      expect(getByText('450 CR')).toBeTruthy();
      expect(getByText('SAFE')).toBeTruthy();
      expect(getByText('O₂ 21.2%')).toBeTruthy();
      expect(getByText('98 kPa')).toBeTruthy();
      expect(getByText('Power: 6.2 hrs')).toBeTruthy();
      expect(getByText('Rad: 94%')).toBeTruthy();
      expect(queryByText(/EGP/)).toBeNull();
    });

    test('HabitatCard shows Credits unavailable for corrupted lease credits', async () => {
      const habitat = parseHabitat({
        id: 'prop_004',
        title: 'Corrupt Habitat',
        lease_credits: -1,
        sector: 'Dome-5',
        bedrooms: 2,
        bathrooms: 1,
        status: 'available',
      });

      const { getByText, queryByText } = await render(
        <HabitatCard habitat={habitat} onPress={() => {}} />
      );

      expect(getByText('Credits unavailable')).toBeTruthy();
      expect(queryByText(/Data issue/)).toBeNull();
    });
  });

  describe('Habitat Compare Winners', () => {
    const { getCompareWinners } = require('../utils/compareHabitats');

    const safeSupport = {
      o2_level: 21.0,
      cabin_pressure_kpa: 86,
      temperature_c: 21,
      radiation_shielding_pct: 95,
      power_reserve_hrs: 6,
      co2_scrubber_status: 'active',
    };

    test('safer habitability wins', () => {
      const left = parseHabitat({
        id: 'a',
        lease_credits: 500,
        volume_m3: 400,
        life_support: safeSupport,
      });
      const right = parseHabitat({
        id: 'b',
        lease_credits: 500,
        volume_m3: 400,
        life_support: { ...safeSupport, o2_level: 16 },
      });

      expect(getCompareWinners(left, right).habitability).toBe('left');
    });

    test('lower sale price wins when both have credits', () => {
      const left = parseHabitat({
        id: 'a',
        lease_credits: 1200,
        volume_m3: 400,
        life_support: safeSupport,
      });
      const right = parseHabitat({
        id: 'b',
        lease_credits: 450,
        volume_m3: 400,
        life_support: safeSupport,
      });

      expect(getCompareWinners(left, right).price).toBe('right');
    });

    test('null credits is not treated as cheaper', () => {
      const left = parseHabitat({
        id: 'a',
        lease_credits: -1,
        volume_m3: 400,
        life_support: safeSupport,
      });
      const right = parseHabitat({
        id: 'b',
        lease_credits: 800,
        volume_m3: 400,
        life_support: safeSupport,
      });

      expect(left.leaseCredits).toBeNull();
      expect(getCompareWinners(left, right).price).toBe('tie');
    });

    test('more berths wins the structural row', () => {
      const left = parseHabitat({
        id: 'a',
        lease_credits: 500,
        bedrooms: 4,
        bathrooms: 1,
        volume_m3: 400,
        life_support: safeSupport,
      });
      const right = parseHabitat({
        id: 'b',
        lease_credits: 500,
        bedrooms: 2,
        bathrooms: 3,
        volume_m3: 400,
        life_support: safeSupport,
      });

      expect(getCompareWinners(left, right).berths).toBe('left');
      expect(getCompareWinners(left, right).baths).toBe('right');
    });
  });

  describe('Innovation Feature — Deliverable B (Habitat Control Center)', () => {
    describe('Alerts Parsing & Triage', () => {
      test('defensively parses alerts with unknown severity and categories', () => {
        const { parseAlert } = require('../services/controlService');
        const alert = parseAlert({
          id: 'test_alert_1',
          severity: 'UNKNOWN_SEV',
          category: 'invalid_cat',
          title: 'Custom Alert',
        });

        expect(alert.severity).toBe('info');
        expect(alert.category).toBe('structural');
        expect(alert.status).toBe('active');
        expect(alert.suggestedAction).toBe('Monitor colony diagnostics dashboard.');
      });
    });

    describe('Energy Status & Power Balance Calculation', () => {
      test('correctly computes battery hours remaining and power-save reduction', () => {
        const { parseEnergyStatus } = require('../services/controlService');
        const energy = parseEnergyStatus({
          solar_generation_kw: 10,
          base_consumption_kw: 20,
          power_save_mode: false,
          battery_pct: 50,
          battery_capacity_kwh: 100,
        });

        // Available kWh = (50/100)*100 = 50 kWh
        // Net draw = 20 - 10 = 10 kW
        // Battery hours = 50 / 10 = 5.0 hrs
        expect(energy.batteryHoursRemaining).toBe(5.0);
        expect(energy.dustStormRisk).toBe('nominal');
        expect(energy.dayNightPhase).toBe('day');
      });
    });

    describe('Control Store State Transitions', () => {
      test('dismisses and snoozes active alerts', () => {
        const { useControlStore } = require('../stores/controlStore');
        const { parseAlert } = require('../services/controlService');

        const mockAlerts = [
          parseAlert({
            id: 'alt_1',
            title: 'Critical Leak',
            severity: 'critical',
            status: 'active',
            timestamp_sol: 1200,
          }),
          parseAlert({
            id: 'alt_2',
            title: 'Solar Dust',
            severity: 'warning',
            status: 'active',
            timestamp_sol: 1200,
          }),
        ];

        useControlStore.setState({ alerts: mockAlerts });
        expect(useControlStore.getState().getActiveAlertCount()).toBe(2);
        expect(useControlStore.getState().getCriticalAlertCount()).toBe(1);

        // Dismiss alt_1
        useControlStore.getState().dismissAlert('alt_1');
        expect(useControlStore.getState().getActiveAlertCount()).toBe(1);
        expect(useControlStore.getState().getCriticalAlertCount()).toBe(0);

        // Snooze alt_2
        useControlStore.getState().snoozeAlert('alt_2');
        const snoozed = useControlStore.getState().alerts.find((a: any) => a.id === 'alt_2');
        expect(snoozed.status).toBe('snoozed');
        expect(snoozed.snoozedUntilSol).toBe(1202);
      });

      test('toggles emergency power saving mode and recalculates grid reserves', () => {
        const { useControlStore } = require('../stores/controlStore');
        const { parseEnergyStatus, computeBatteryHoursRemaining } = require('../services/controlService');

        const initialEnergy = parseEnergyStatus({
          solar_generation_kw: 0,
          base_consumption_kw: 30,
          power_save_mode: false,
          battery_pct: 60,
          battery_capacity_kwh: 200,
        });

        useControlStore.setState({ energy: initialEnergy });
        expect(useControlStore.getState().energy?.powerSaveMode).toBe(false);

        // Toggle power save on
        useControlStore.getState().togglePowerSaveMode();
        expect(useControlStore.getState().energy?.powerSaveMode).toBe(true);
        expect(useControlStore.getState().energy?.batteryHoursRemaining).toBe(
          computeBatteryHoursRemaining({
            solarGenerationKw: 0,
            baseConsumptionKw: 30,
            powerSaveMode: true,
            batteryPct: 60,
            batteryCapacityKwh: 200,
          })
        );
        expect(useControlStore.getState().energy?.batteryHoursRemaining).toBeGreaterThan(
          initialEnergy.batteryHoursRemaining
        );
      });
    });
  });
});

