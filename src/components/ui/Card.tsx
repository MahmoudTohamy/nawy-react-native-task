import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { neutral, radius, spacing } from '../../theme';

type Props = {
  children: ReactNode;
  padded?: boolean;
  borderColor?: string;
  style?: ViewStyle;
};

export default function Card({ children, padded = true, borderColor, style }: Props) {
  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        borderColor ? { borderColor } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: neutral.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: neutral.border,
  },
  padded: {
    padding: spacing['3xl'],
  },
});
