import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { neutral, spacing } from '../../theme';
import Button from './Button';

const DEFAULT_ICON_SIZE = 48;

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  iconColor?: string;
  iconSize?: number;
  titleColor?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'tint';
};

export default function EmptyState({
  icon,
  title,
  subtitle,
  iconColor = neutral.textDisabled,
  iconSize = DEFAULT_ICON_SIZE,
  titleColor = neutral.textSubtle,
  actionLabel,
  onAction,
  actionVariant = 'tint',
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant={actionVariant}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['6xl'],
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: neutral.textSubtle,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  action: {
    marginTop: spacing['3xl'],
  },
});
