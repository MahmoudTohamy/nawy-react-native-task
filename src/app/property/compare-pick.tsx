import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge, EmptyState } from '../../components/ui';
import { useHabitatStore } from '../../stores/habitatStore';
import { brand, neutral, radius, spacing } from '../../theme';
import { Habitat } from '../../types/habitat';
import { HABITABILITY_COLORS } from '../../utils/habitatSafety';

const COMPARE_PICK_TITLE = 'Choose habitat to compare';

export default function ComparePickScreen() {
  const { left } = useLocalSearchParams<{ left: string }>();
  const router = useRouter();
  const habitats = useHabitatStore((s) => s.habitats);
  const fetchHabitats = useHabitatStore((s) => s.fetchHabitats);

  useEffect(() => {
    if (habitats.length === 0) {
      fetchHabitats();
    }
  }, [fetchHabitats, habitats.length]);

  const candidates = useMemo(
    () => habitats.filter((habitat) => habitat.id !== left),
    [habitats, left],
  );

  const handleSelect = useCallback(
    (rightId: string) => {
      if (!left) return;
      router.push({ pathname: '/property/compare', params: { left, right: rightId } });
    },
    [left, router],
  );

  const keyExtractor = useCallback((item: Habitat) => item.id, []);

  const renderItem = useCallback<ListRenderItem<Habitat>>(
    ({ item }) => {
      const tone = HABITABILITY_COLORS[item.habitability];
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => handleSelect(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.rowBody}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {item.sector} · {item.leaseLabel}
            </Text>
          </View>
          <Badge label={tone.label} tone={item.habitability} />
          <Ionicons name="chevron-forward" size={18} color={neutral.textDisabled} />
        </TouchableOpacity>
      );
    },
    [handleSelect],
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: COMPARE_PICK_TITLE,
          headerBackTitle: 'Habitat',
        }}
      />

      {candidates.length === 0 ? (
        <EmptyState
          icon="git-compare-outline"
          title="Nothing to Compare"
          subtitle="At least two registered habitats are needed to run a side-by-side listing comparison."
          actionLabel="Return to Registry"
          actionVariant="primary"
          onAction={() => router.replace('/')}
        />
      ) : (
        <FlatList
          data={candidates}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neutral.background,
  },
  list: {
    paddingVertical: spacing.md,
    paddingBottom: spacing['6xl'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: neutral.white,
    marginHorizontal: spacing['3xl'],
    marginVertical: spacing.sm,
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: neutral.border,
  },
  rowBody: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: brand.dark,
  },
  meta: {
    fontSize: 12,
    color: neutral.textSubtle,
    marginTop: 2,
  },
});
