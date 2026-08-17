import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { brand, neutral, radius, spacing } from '../../theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function Chip({ label, selected = false, onPress, icon }: Props) {
  const content = (
    <>
      {icon ? (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? neutral.white : brand.primary}
        />
      ) : null}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.chip, selected && styles.chipSelected]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.chip, selected && styles.chipSelected]}>{content}</View>;
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius['2xl'],
    backgroundColor: neutral.surface,
    borderWidth: 1,
    borderColor: neutral.chipBorder,
  },
  chipSelected: {
    backgroundColor: brand.primary,
    borderColor: brand.primary,
  },
  label: {
    fontSize: 12,
    color: neutral.textMuted,
    fontWeight: '500',
  },
  labelSelected: {
    color: neutral.white,
    fontWeight: '700',
  },
});
