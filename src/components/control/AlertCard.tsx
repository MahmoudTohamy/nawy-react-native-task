import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_ICONS, SEVERITY_COLORS } from '../../constants/alerts';
import { brand, neutral, radius, shadow, spacing } from '../../theme';
import { HabitatAlert } from '../../types/control';
import { Badge, Card } from '../ui';

const TAP_TO_RESPOND = 'Tap to respond';

type Props = {
  alert: HabitatAlert;
  onPress: (id: string) => void;
  onPressHabitat: (habitatId: string) => void;
};

function AlertCard({ alert, onPress, onPressHabitat }: Props) {
  const severityStyle = SEVERITY_COLORS[alert.severity];
  const iconName = CATEGORY_ICONS[alert.category];

  const handlePress = useCallback(() => {
    onPress(alert.id);
  }, [alert.id, onPress]);

  const handleHabitatPress = useCallback(() => {
    onPressHabitat(alert.habitatId);
  }, [alert.habitatId, onPressHabitat]);

  return (
    <Card borderColor={severityStyle.border} style={styles.card}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => (pressed ? styles.pressed : undefined)}
        accessibilityRole="button"
        accessibilityLabel={alert.title}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerTitleRow}>
            <View style={[styles.categoryIconCircle, { backgroundColor: severityStyle.bg }]}>
              <Ionicons name={iconName} size={16} color={severityStyle.text} />
            </View>
            <Text style={styles.alertTitle} numberOfLines={2}>
              {alert.title}
            </Text>
          </View>
          <Badge label={alert.severity.toUpperCase()} tone={alert.severity} />
        </View>
      </Pressable>

      <View style={styles.metaRow}>
        <Pressable
          onPress={handleHabitatPress}
          style={({ pressed }) => [styles.habitatLink, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${alert.habitatTitle}, ${alert.sector}`}
        >
          <Ionicons name="business-outline" size={13} color={brand.primary} />
          <Text style={styles.habitatName}>{alert.habitatTitle}</Text>
          <Text style={styles.sectorText}>({alert.sector})</Text>
        </Pressable>
        <Text style={styles.solTimestamp}>
          Sol {alert.timestampSol} · {alert.timestampTime}
        </Text>
      </View>

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => (pressed ? styles.pressed : undefined)}
        accessibilityRole="button"
        accessibilityLabel={TAP_TO_RESPOND}
      >
        <Text style={styles.messageText} numberOfLines={3}>
          {alert.message}
        </Text>
        <View style={styles.respondRow}>
          <Text style={styles.respondText}>{TAP_TO_RESPOND}</Text>
          <Ionicons name="chevron-forward" size={16} color={brand.primary} />
        </View>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    shadowColor: shadow.color,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  pressed: {
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  categoryIconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: neutral.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  habitatLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: brand.primaryTint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 1,
    borderRadius: radius.sm,
  },
  habitatName: {
    fontSize: 11,
    fontWeight: '700',
    color: brand.primary,
  },
  sectorText: {
    fontSize: 11,
    color: neutral.textSubtle,
  },
  solTimestamp: {
    fontSize: 11,
    color: neutral.textDisabled,
    fontWeight: '500',
  },
  messageText: {
    fontSize: 13,
    color: neutral.textSecondary,
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  respondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  respondText: {
    fontSize: 12,
    fontWeight: '700',
    color: brand.primary,
  },
});

export default memo(AlertCard);
