import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { brand, neutral, spacing, status } from '../../theme';
import EmptyState from './EmptyState';

type LoadingProps = {
  variant: 'loading';
  title: string;
  subtitle?: string;
};

type ErrorProps = {
  variant: 'error';
  title: string;
  subtitle?: string;
  actionLabel: string;
  onRetry: () => void;
};

type Props = LoadingProps | ErrorProps;

export default function ScreenState(props: Props) {
  if (props.variant === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={brand.primary} />
        <Text style={styles.title}>{props.title}</Text>
        {props.subtitle ? <Text style={styles.subtitle}>{props.subtitle}</Text> : null}
      </View>
    );
  }

  return (
    <EmptyState
      icon="warning-outline"
      iconColor={status.critical.text}
      titleColor={status.critical.text}
      title={props.title}
      subtitle={props.subtitle}
      actionLabel={props.actionLabel}
      onAction={props.onRetry}
      actionVariant="primary"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['5xl'],
  },
  title: {
    marginTop: spacing['3xl'],
    fontSize: 16,
    fontWeight: '700',
    color: brand.dark,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: neutral.textSubtle,
    textAlign: 'center',
  },
});
