import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import HabitatCard from '../components/HabitatCard';
import { EmptyState } from '../components/ui';
import { FLATLIST_PERF } from '../constants/listPerformance';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useHabitatStore } from '../stores/habitatStore';
import { brand, neutral, spacing } from '../theme';
import { Habitat } from '../types/habitat';

const SCREEN_TITLE = 'Favorites';
const EMPTY_TITLE = 'No favorites yet';
const EMPTY_SUBTITLE =
  'Tap the heart on any listing to add it to your shortlist for this session.';

export default function FavoritesScreen() {
  const router = useRouter();
  const habitats = useHabitatStore((s) => s.habitats);
  const fetchHabitats = useHabitatStore((s) => s.fetchHabitats);
  const ids = useFavoritesStore((s) => s.ids);

  useEffect(() => {
    if (habitats.length === 0) {
      fetchHabitats();
    }
  }, [fetchHabitats, habitats.length]);

  const saved = useMemo(() => {
    const byId = new Map(habitats.map((habitat) => [habitat.id, habitat]));
    return [...ids]
      .reverse()
      .map((id) => byId.get(id))
      .filter((habitat): habitat is Habitat => habitat != null);
  }, [habitats, ids]);

  const handleHabitatPress = useCallback(
    (id: string) => {
      router.push({ pathname: '/property/unlock/[id]', params: { id } });
    },
    [router],
  );

  const keyExtractor = useCallback((item: Habitat) => item.id, []);

  const renderItem = useCallback<ListRenderItem<Habitat>>(
    ({ item }) => <HabitatCard habitat={item} onPress={handleHabitatPress} />,
    [handleHabitatPress],
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: SCREEN_TITLE,
          headerBackTitle: 'Habitats',
        }}
      />

      {saved.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          iconColor={brand.primary}
          title={EMPTY_TITLE}
          subtitle={EMPTY_SUBTITLE}
          actionLabel="Browse habitats"
          actionVariant="primary"
          onAction={() => router.replace('/')}
        />
      ) : (
        <FlatList
          data={saved}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          {...FLATLIST_PERF}
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
    paddingTop: spacing.md,
    paddingBottom: spacing['6xl'],
  },
});
