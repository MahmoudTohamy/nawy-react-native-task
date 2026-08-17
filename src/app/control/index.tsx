import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AlertsFeedView from '../../components/control/AlertsFeedView';
import ColonyStatusBar from '../../components/control/ColonyStatusBar';
import ControlTabBar from '../../components/control/ControlTabBar';
import EnergyStatusView from '../../components/control/EnergyStatusView';
import LifeSupportDashboardView from '../../components/control/LifeSupportDashboardView';
import { ScreenState } from '../../components/ui';
import { useControlStore } from '../../stores/controlStore';
import { useHabitatStore } from '../../stores/habitatStore';
import { neutral } from '../../theme';

export default function HabitatControlCenterScreen() {
  const activeTab = useControlStore((s) => s.activeTab);
  const loading = useControlStore((s) => s.loading);
  const error = useControlStore((s) => s.error);
  const fetchControlData = useControlStore((s) => s.fetchControlData);

  const fetchHabitats = useHabitatStore((s) => s.fetchHabitats);
  const habitatCount = useHabitatStore((s) => s.habitats.length);

  useEffect(() => {
    fetchControlData();
    fetchHabitats();
  }, [fetchControlData, fetchHabitats]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Habitat Control Center',
          headerBackTitle: 'Habitats',
        }}
      />

      <ColonyStatusBar />
      <ControlTabBar />

      {loading && habitatCount === 0 ? (
        <ScreenState variant="loading" title="Syncing Olympus Control Telemetry…" />
      ) : error ? (
        <ScreenState
          variant="error"
          title="Control Link Disconnected"
          subtitle={error}
          actionLabel="Reconnect Telemetry"
          onRetry={fetchControlData}
        />
      ) : (
        <View style={styles.tabContent}>
          {activeTab === 'alerts' && <AlertsFeedView />}
          {activeTab === 'lifesupport' && <LifeSupportDashboardView />}
          {activeTab === 'energy' && <EnergyStatusView />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral.background,
  },
  tabContent: {
    flex: 1,
  },
});
