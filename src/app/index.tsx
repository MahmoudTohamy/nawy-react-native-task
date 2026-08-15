import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropertyCard from '../components/PropertyCard';
import { parseProperty, Property } from '../types/property';

const SORT_OPTIONS = [
  { key: 'price', label: 'Sort by Price' },
  { key: 'area', label: 'Sort by Area' },
  { key: 'date', label: 'Sort by Date Listed' },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]['key'];

export default function ListingsScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('price');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Simulates the latency of the Earth property feed API.
        await new Promise((resolve) => setTimeout(resolve, 800));
        const data = require('../../assets/data/properties.json');
        setProperties(data.map((item: any) => parseProperty(item)));
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  const displayed = [...properties];
  if (sortBy === 'price') {
    displayed.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'area') {
    displayed.sort((a, b) => a.area - b.area);
  } else if (sortBy === 'date') {
    displayed.sort((a, b) => a.listedAt.localeCompare(b.listedAt));
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Nawy Mars',
          headerRight: () => (
            <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} hitSlop={12}>
              <Ionicons name="swap-vertical" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      {menuOpen && (
        <View style={styles.menu}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.menuItem}
              onPress={() => {
                setSortBy(option.key);
                setMenuOpen(false);
              }}
            >
              <Text style={styles.menuLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  list: { paddingTop: 8, paddingBottom: 24 },
  menu: {
    position: 'absolute',
    top: 4,
    right: 8,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    paddingVertical: 4,
  },
  menuItem: { paddingHorizontal: 16, paddingVertical: 10 },
  menuLabel: { fontSize: 14 },
});
