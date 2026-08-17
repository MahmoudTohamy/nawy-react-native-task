import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { BADGE_TONE_STYLES, BadgeTone } from '../../constants/badge';
import { radius, spacing } from '../../theme';

export type { BadgeTone };

type Props = {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
};

export default function Badge({ label, tone = 'neutral', style }: Props) {
  const colors = BADGE_TONE_STYLES[tone];

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
