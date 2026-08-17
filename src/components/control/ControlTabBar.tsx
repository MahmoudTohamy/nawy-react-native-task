import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  ControlTab,
  countActiveAlerts,
  countCriticalAlerts,
  useControlStore,
} from '../../stores/controlStore';
import { brand, neutral, radius, spacing, status } from '../../theme';

const TABS: { key: ControlTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'alerts', label: 'Alerts Feed', icon: 'warning-outline' },
  { key: 'lifesupport', label: 'Life Support', icon: 'pulse-outline' },
  { key: 'energy', label: 'Energy & Sol', icon: 'flash-outline' },
];

export default function ControlTabBar() {
  const activeTab = useControlStore((s) => s.activeTab);
  const setActiveTab = useControlStore((s) => s.setActiveTab);
  const activeAlerts = useControlStore((s) => countActiveAlerts(s.alerts));
  const criticalCount = useControlStore((s) => countCriticalAlerts(s.alerts));

  const alertBadgeColor = useMemo(
    () => (criticalCount > 0 ? status.critical.text : status.warning.text),
    [criticalCount],
  );

  const handleTabPress = useCallback(
    (tab: ControlTab) => {
      setActiveTab(tab);
    },
    [setActiveTab],
  );

  return (
    <View style={styles.segmentedTabBar}>
      {TABS.map((tab) => {
        const isSelected = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, isSelected && styles.tabButtonActive]}
            onPress={() => handleTabPress(tab.key)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={isSelected ? neutral.white : neutral.textSubtle}
            />
            <Text style={[styles.tabButtonText, isSelected && styles.tabButtonTextActive]}>
              {tab.label}
            </Text>
            {tab.key === 'alerts' && activeAlerts > 0 && (
              <View style={[styles.alertBadge, { backgroundColor: alertBadgeColor }]}>
                <Text style={styles.alertBadgeText}>{activeAlerts}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedTabBar: {
    flexDirection: 'row',
    backgroundColor: neutral.white,
    padding: spacing.sm,
    marginHorizontal: spacing.xl,
    marginVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: neutral.border,
    gap: spacing.xs,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: 5,
  },
  tabButtonActive: {
    backgroundColor: brand.primary,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: neutral.textMuted,
  },
  tabButtonTextActive: {
    color: neutral.white,
    fontWeight: '700',
  },
  alertBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  alertBadgeText: {
    color: neutral.white,
    fontSize: 9,
    fontWeight: '800',
  },
});
