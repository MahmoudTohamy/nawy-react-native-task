import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CONTROL_TABS } from '../../constants/control';
import { countActiveAlerts, countCriticalAlerts, useControlStore } from '../../stores/controlStore';
import { neutral, radius, spacing, status } from '../../theme';
import ControlTabButton from './ControlTabButton';

export default function ControlTabBar() {
  const activeTab = useControlStore((s) => s.activeTab);
  const setActiveTab = useControlStore((s) => s.setActiveTab);
  const activeAlerts = useControlStore((s) => countActiveAlerts(s.alerts));
  const criticalCount = useControlStore((s) => countCriticalAlerts(s.alerts));

  const alertBadgeColor = useMemo(
    () => (criticalCount > 0 ? status.critical.text : status.warning.text),
    [criticalCount],
  );

  return (
    <View style={styles.segmentedTabBar} accessibilityRole="tablist">
      {CONTROL_TABS.map((tab) => (
        <ControlTabButton
          key={tab.key}
          tab={tab}
          selected={activeTab === tab.key}
          badgeCount={activeAlerts}
          badgeColor={alertBadgeColor}
          onSelect={setActiveTab}
        />
      ))}
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
});
