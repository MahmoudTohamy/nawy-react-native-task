import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button, Card } from '../../../components/ui';
import { useAccessStore } from '../../../stores/accessStore';
import { useHabitatStore } from '../../../stores/habitatStore';
import { brand, neutral, radius, shadow, spacing, status } from '../../../theme';

export default function UnlockHabitatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const habitat = useHabitatStore((s) => s.habitats.find((h) => h.id === id));
  const unlockHabitat = useAccessStore((s) => s.unlockHabitat);

  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = () => {
    const trimmed = passphrase.trim();
    if (!trimmed) {
      setError('Settlement clearance passphrase is required.');
      return;
    }

    if (id) {
      unlockHabitat(id);
      router.replace({ pathname: '/property/[id]', params: { id } });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: 'Settlement Security Gate',
          headerBackTitle: 'Habitats',
        }}
      />

      <Card padded={false} style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed" size={36} color={brand.primary} />
        </View>

        <Text style={styles.title}>Airlock Clearance Required</Text>
        <Text style={styles.subtitle}>
          Accessing telemetry and structural schematics for:
        </Text>

        <View style={styles.habitatBadge}>
          <Text style={styles.habitatTitle}>{habitat?.title ?? `Habitat ${id}`}</Text>
          {habitat?.sector && <Text style={styles.habitatSector}>Sector: {habitat.sector}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Enter Clearance Passphrase</Text>
          <View style={[styles.inputContainer, error ? styles.inputError : null]}>
            <Ionicons name="key-outline" size={18} color={neutral.textSubtle} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. resident token or access code"
              placeholderTextColor={neutral.textDisabled}
              value={passphrase}
              onChangeText={(text) => {
                setPassphrase(text);
                if (error) setError(null);
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleUnlock}
            />
          </View>
          {error && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={14} color={status.critical.text} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <Button
          label="Authorize & View Details"
          icon="shield-checkmark-outline"
          onPress={handleUnlock}
          style={styles.unlockButton}
        />

        <Button label="Return to Listings" variant="ghost" onPress={() => router.back()} />
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral.background,
    justifyContent: 'center',
    padding: spacing['4xl'],
  },
  card: {
    padding: spacing['5xl'],
    alignItems: 'center',
    borderRadius: radius['3xl'],
    shadowColor: shadow.color,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: brand.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['3xl'],
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: brand.dark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    color: neutral.textSubtle,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  habitatBadge: {
    backgroundColor: neutral.surface,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing['4xl'],
    width: '100%',
  },
  habitatTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: brand.primary,
  },
  habitatSector: {
    fontSize: 12,
    color: neutral.textMuted,
    marginTop: 2,
  },
  inputGroup: {
    width: '100%',
    marginBottom: spacing['3xl'],
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: neutral.textSecondary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: neutral.chipBorder,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: neutral.background,
  },
  inputError: {
    borderColor: status.critical.text,
    backgroundColor: status.critical.bg,
  },
  inputIcon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.xl,
    fontSize: 14,
    color: brand.dark,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  errorText: {
    color: status.critical.text,
    fontSize: 12,
  },
  unlockButton: {
    width: '100%',
    marginBottom: spacing.lg,
    paddingVertical: spacing['2xl'],
  },
});
