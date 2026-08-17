import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useFavoritesStore } from '../stores/favoritesStore';
import { brand, neutral, radius, spacing } from '../theme';

const HIT_SLOP = spacing.md;

const VARIANT = {
  overlay: { iconSize: 20, color: brand.primary },
  header: { iconSize: 22, color: neutral.white },
} as const;

type Props = {
  habitatId: string;
  variant?: keyof typeof VARIANT;
  style?: ViewStyle;
};

export default function FavoriteButton({ habitatId, variant = 'overlay', style }: Props) {
  const isFavorite = useFavoritesStore((s) => s.ids.has(habitatId));
  const toggle = useFavoritesStore((s) => s.toggle);
  const theme = VARIANT[variant];

  const handlePress = useCallback(() => {
    toggle(habitatId);
  }, [habitatId, toggle]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      style={[styles.base, variant === 'overlay' && styles.overlay, style]}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={theme.iconSize}
        color={theme.color}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: spacing.xs,
  },
  overlay: {
    backgroundColor: neutral.white,
    borderRadius: radius.full,
    padding: spacing.sm,
  },
});
