import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { neutral, radius, spacing, status } from '../../theme';

const DISMISS_LABEL = 'Resolve & Dismiss';
const SNOOZE_LABEL = 'Snooze 2 Sols';

type Props = {
  onDismiss: () => void;
  onSnooze: () => void;
};

export default function AlertCardActions({ onDismiss, onSnooze }: Props) {
  const handleDismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  const handleSnooze = useCallback(() => {
    onSnooze();
  }, [onSnooze]);

  return (
    <View style={styles.actionsRow}>
      <TouchableOpacity style={styles.dismissBtn} onPress={handleDismiss} activeOpacity={0.8}>
        <Ionicons name="checkmark-circle-outline" size={16} color={status.safe.text} />
        <Text style={styles.dismissBtnText}>{DISMISS_LABEL}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.snoozeBtn} onPress={handleSnooze} activeOpacity={0.8}>
        <Ionicons name="time-outline" size={15} color={neutral.textSubtle} />
        <Text style={styles.snoozeBtnText}>{SNOOZE_LABEL}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  dismissBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: status.safe.bg,
    paddingVertical: 9,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: status.safe.border,
  },
  dismissBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: status.safe.text,
  },
  snoozeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: neutral.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: 9,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: neutral.chipBorder,
  },
  snoozeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: neutral.textMuted,
  },
});
