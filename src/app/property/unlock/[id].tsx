import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAccessStore } from '../../../stores/accessStore';
import { useHabitatStore } from '../../../stores/habitatStore';

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

      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed" size={36} color="#D84315" />
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
            <Ionicons name="key-outline" size={18} color="#757575" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. resident token or access code"
              placeholderTextColor="#9E9E9E"
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
              <Ionicons name="alert-circle" size={14} color="#C62828" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock} activeOpacity={0.85}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#FFFFFF" />
          <Text style={styles.unlockButtonText}>Authorize & View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Return to Listings</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FBE9E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 12,
  },
  habitatBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  habitatTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D84315',
  },
  habitatSector: {
    fontSize: 12,
    color: '#616161',
    marginTop: 2,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#C62828',
    backgroundColor: '#FFEBEE',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#212121',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  errorText: {
    color: '#C62828',
    fontSize: 12,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D84315',
    borderRadius: 10,
    paddingVertical: 14,
    width: '100%',
    marginBottom: 10,
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#757575',
    fontSize: 13,
    fontWeight: '600',
  },
});
