import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CONTROL_TABS } from '../../constants/control';
import { brand, neutral, radius, spacing } from '../../theme';
import { ControlTab } from '../../types/control';

type TabConfig = (typeof CONTROL_TABS)[number];

const BADGE_CAP = 99;

type Props = {
  tab: TabConfig;
  selected: boolean;
  badgeCount: number;
  badgeColor: string;
  onSelect: (tab: ControlTab) => void;
};

export default function ControlTabButton({ tab, selected, badgeCount, badgeColor, onSelect }: Props) {
  const handlePress = useCallback(() => {
    onSelect(tab.key);
  }, [onSelect, tab.key]);

  const buttonStyle = useMemo(
    (): ViewStyle[] => [styles.tabButton, selected ? styles.tabButtonActive : {}],
    [selected],
  );

  const labelStyle = useMemo(
    (): TextStyle[] => [styles.tabButtonText, selected ? styles.tabButtonTextActive : {}],
    [selected],
  );

  const iconColor = useMemo(() => (selected ? neutral.white : neutral.textMuted), [selected]);

  const showBadge = useMemo(() => tab.key === 'alerts' && badgeCount > 0, [tab.key, badgeCount]);

  const accessibilityLabel = useMemo(() => {
    if (!showBadge) return tab.label;
    return `${tab.label}, ${badgeCount} active alerts`;
  }, [showBadge, tab.label, badgeCount]);

  const badgeText = useMemo(
    () => (badgeCount > BADGE_CAP ? `${BADGE_CAP}+` : String(badgeCount)),
    [badgeCount],
  );

  const badgeStyle = useMemo(
    (): ViewStyle[] => [styles.alertBadge, { backgroundColor: badgeColor }],
    [badgeColor],
  );

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name={tab.icon} size={16} color={iconColor} />
      <Text style={labelStyle} numberOfLines={1}>
        {tab.label}
      </Text>
      {showBadge ? (
        <View style={badgeStyle}>
          <Text style={styles.alertBadgeText}>{badgeText}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs,
    minWidth: 0,
  },
  tabButtonActive: {
    backgroundColor: brand.primary,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: neutral.textMuted,
    flexShrink: 1,
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
