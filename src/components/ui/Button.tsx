import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { brand, neutral, radius, spacing } from '../../theme';

const VARIANT_STYLES = {
  primary: {
    container: { backgroundColor: brand.primary },
    label: { color: neutral.white },
    icon: neutral.white,
  },
  tint: {
    container: {
      backgroundColor: brand.primaryTint,
      borderWidth: 1,
      borderColor: brand.primaryBorder,
    },
    label: { color: brand.primary },
    icon: brand.primary,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: neutral.textSubtle },
    icon: neutral.textSubtle,
  },
} as const;

type Props = {
  label: string;
  onPress: () => void;
  variant?: keyof typeof VARIANT_STYLES;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  style,
}: Props) {
  const theme = VARIANT_STYLES[variant];

  return (
    <TouchableOpacity
      style={[styles.base, theme.container, disabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      {icon ? <Ionicons name={icon} size={16} color={theme.icon} /> : null}
      <Text style={[styles.label, theme.label]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
