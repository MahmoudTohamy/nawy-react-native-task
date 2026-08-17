import { StyleSheet, View } from 'react-native';
import { CONTROL_TABS } from '../../constants/control';
import { useControlStore } from '../../stores/controlStore';
import { neutral, radius, spacing, status } from '../../theme';
import { getAlertSnapshot } from '../../utils/filterAlerts';
import ControlTabButton from './ControlTabButton';

export default function ControlTabBar() {
  const activeTab = useControlStore((s) => s.activeTab);
  const setActiveTab = useControlStore((s) => s.setActiveTab);
  const activeAlerts = useControlStore((s) => getAlertSnapshot(s.alerts).counts.all);
  const criticalCount = useControlStore((s) => getAlertSnapshot(s.alerts).counts.critical);
  const alertBadgeColor = criticalCount > 0 ? status.critical.text : status.warning.text;

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
