import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AlertsFeedView from '../../components/control/AlertsFeedView';
import EnergyStatusView from '../../components/control/EnergyStatusView';
import LifeSupportDashboardView from '../../components/control/LifeSupportDashboardView';
import { ControlTab, useControlStore } from '../../stores/controlStore';
import { useHabitatStore } from '../../stores/habitatStore';

const TABS: { key: ControlTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'alerts', label: 'Alerts Feed', icon: 'warning-outline' },
  { key: 'lifesupport', label: 'Life Support', icon: 'pulse-outline' },
  { key: 'energy', label: 'Energy & Sol', icon: 'flash-outline' },
];

export default function HabitatControlCenterScreen() {
  const activeTab = useControlStore((s) => s.activeTab);
  const setActiveTab = useControlStore((s) => s.setActiveTab);
  const loading = useControlStore((s) => s.loading);
  const error = useControlStore((s) => s.error);
  const fetchControlData = useControlStore((s) => s.fetchControlData);
  const getActiveAlertCount = useControlStore((s) => s.getActiveAlertCount);
  const getCriticalAlertCount = useControlStore((s) => s.getCriticalAlertCount);

  const fetchHabitats = useHabitatStore((s) => s.fetchHabitats);
  const habitats = useHabitatStore((s) => s.habitats);

  useEffect(() => {
    fetchControlData();
    if (habitats.length === 0) {
      fetchHabitats();
    }
  }, [fetchControlData, fetchHabitats, habitats.length]);

  const activeAlerts = getActiveAlertCount();
  const criticalCount = getCriticalAlertCount();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Habitat Control Center',
          headerBackTitle: 'Habitats',
        }}
      />

      {/* Top Settlement Telemetry Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarItem}>
          <Text style={styles.topBarLabel}>COLONY SAFETY</Text>
          <View style={styles.statusIndicatorRow}>
            <View
              style={[
                styles.pulseDot,
                { backgroundColor: criticalCount > 0 ? '#C62828' : '#2E7D32' },
              ]}
            />
            <Text
              style={[
                styles.statusIndicatorText,
                { color: criticalCount > 0 ? '#C62828' : '#2E7D32' },
              ]}
            >
              {criticalCount > 0 ? `${criticalCount} CRITICAL` : 'ALL SAFE'}
            </Text>
          </View>
        </View>

        <View style={styles.topBarDivider} />

        <View style={styles.topBarItem}>
          <Text style={styles.topBarLabel}>ACTIVE INCIDENTS</Text>
          <Text style={styles.topBarValue}>{activeAlerts} Reports</Text>
        </View>

        <View style={styles.topBarDivider} />

        <View style={styles.topBarItem}>
          <Text style={styles.topBarLabel}>TELEMETRY LOOP</Text>
          <Text style={styles.topBarValue}>Live · Mesh-Net</Text>
        </View>
      </View>

      {/* Segmented Navigation Tab Bar */}
      <View style={styles.segmentedTabBar}>
        {TABS.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isSelected && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={isSelected ? '#FFFFFF' : '#757575'}
              />
              <Text style={[styles.tabButtonText, isSelected && styles.tabButtonTextActive]}>
                {tab.label}
              </Text>
              {tab.key === 'alerts' && activeAlerts > 0 && (
                <View
                  style={[
                    styles.alertBadge,
                    { backgroundColor: criticalCount > 0 ? '#C62828' : '#EF6C00' },
                  ]}
                >
                  <Text style={styles.alertBadgeText}>{activeAlerts}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* View Content */}
      {loading && !habitats.length ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#D84315" />
          <Text style={styles.loadingText}>Syncing Olympus Control Telemetry…</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="warning-outline" size={48} color="#C62828" />
          <Text style={styles.errorTitle}>Control Link Disconnected</Text>
          <Text style={styles.errorSub}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchControlData}>
            <Text style={styles.retryBtnText}>Reconnect Telemetry</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#FAFAFA',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#212121',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  topBarItem: {
    alignItems: 'center',
    flex: 1,
  },
  topBarLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9E9E9E',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  topBarValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusIndicatorText: {
    fontSize: 12,
    fontWeight: '800',
  },
  topBarDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#424242',
  },
  segmentedTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 6,
    marginHorizontal: 12,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
  },
  tabButtonActive: {
    backgroundColor: '#D84315',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#616161',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  alertBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  alertBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabContent: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C62828',
    marginTop: 12,
  },
  errorSub: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    marginTop: 4,
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: '#D84315',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
