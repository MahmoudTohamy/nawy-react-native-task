import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import HabitatCompareTable from '../../components/HabitatCompareTable';
import { EmptyState } from '../../components/ui';
import { useHabitatStore } from '../../stores/habitatStore';
import { neutral, spacing } from '../../theme';

const COMPARE_TITLE = 'Compare habitats';

export default function HabitatCompareScreen() {
  const { left: leftId, right: rightId } = useLocalSearchParams<{ left: string; right: string }>();
  const router = useRouter();
  const habitats = useHabitatStore((s) => s.habitats);
  const fetchHabitats = useHabitatStore((s) => s.fetchHabitats);

  useEffect(() => {
    if (habitats.length === 0) {
      fetchHabitats();
    }
  }, [fetchHabitats, habitats.length]);

  const left = useMemo(
    () => habitats.find((habitat) => habitat.id === leftId),
    [habitats, leftId],
  );
  const right = useMemo(
    () => habitats.find((habitat) => habitat.id === rightId),
    [habitats, rightId],
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: COMPARE_TITLE,
          headerBackTitle: 'Choose',
        }}
      />

      {!left || !right ? (
        <EmptyState
          icon="git-compare-outline"
          title="Comparison Unavailable"
          subtitle="One or both habitat identifiers are missing from the settlement registry."
          actionLabel="Return to Registry"
          actionVariant="primary"
          onAction={() => router.replace('/')}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <HabitatCompareTable left={left} right={right} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral.background,
  },
  content: {
    padding: spacing['3xl'],
    paddingBottom: spacing['7xl'],
  },
});
