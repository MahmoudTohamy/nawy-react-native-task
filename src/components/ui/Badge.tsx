import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { brand, neutral, radius, spacing, status } from '../../theme';

export type BadgeTone = 'safe' | 'warning' | 'critical' | 'info' | 'neutral';

const TONE_STYLES: Record<BadgeTone, { bg: string; text: string }> = {
  safe: { bg: status.safe.chip, text: status.safe.text },
  warning: { bg: status.warning.chip, text: status.warning.text },
  critical: { bg: status.critical.chip, text: status.critical.text },
  info: { bg: status.info.chip, text: status.info.text },
  neutral: { bg: neutral.surface, text: brand.dark },
};

type Props = {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
};

export default function Badge({ label, tone = 'neutral', style }: Props) {
  const colors = TONE_STYLES[tone];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 1,
    borderRadius: radius.xs,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
});
