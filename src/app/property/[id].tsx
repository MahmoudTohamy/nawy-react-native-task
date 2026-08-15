import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { parseProperty } from '../../types/property';

function InfoTile({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return (
    <View style={styles.infoTile}>
      <Ionicons name={icon} size={28} color="#D84315" />
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = require('../../../assets/data/properties.json');
  const raw = data.find((item: any) => item.id === id);

  if (!raw) {
    return (
      <View style={styles.notFound}>
        <Text>Property not found.</Text>
      </View>
    );
  }

  const property = parseProperty(raw);
  const isAvailable = property.status === 'available';

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: property.title }} />
      <View style={styles.imageContainer}>
        {property.imageUrl ? (
          <Image source={{ uri: property.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <Ionicons name="home" size={80} color="#9E9E9E" />
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.price}>
          {property.currency} {property.price.toFixed(0)}
        </Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={16} color="#9E9E9E" />
          <Text style={styles.address}>{property.address}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.tilesRow}>
          <InfoTile icon="bed-outline" value={`${property.bedrooms}`} label="Bedrooms" />
          <InfoTile icon="water-outline" value={`${property.bathrooms}`} label="Bathrooms" />
          <InfoTile icon="resize-outline" value={property.area.toFixed(0)} label={property.areaUnit} />
        </View>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{property.description}</Text>
        {property.amenities.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.chips}>
              {property.amenities.map((amenity) => (
                <View key={amenity} style={styles.chip}>
                  <Text style={styles.chipText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </>
        )}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status: </Text>
          <View style={[styles.statusChip, { backgroundColor: isAvailable ? '#C8E6C9' : '#FFE0B2' }]}>
            <Text style={{ color: isAvailable ? '#2E7D32' : '#EF6C00' }}>{property.status}</Text>
          </View>
        </View>
        <Text style={styles.listedAt}>Listed: {property.listedAt}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageContainer: {
    height: 240,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  body: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 22, color: '#D84315', fontWeight: '700', marginTop: 8 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  address: { color: '#757575', marginLeft: 4, flex: 1 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 16 },
  tilesRow: { flexDirection: 'row', justifyContent: 'space-around' },
  infoTile: { alignItems: 'center' },
  infoValue: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  infoLabel: { color: '#757575', fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 8, marginBottom: 8 },
  description: { lineHeight: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { backgroundColor: '#EEEEEE', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 13 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  statusLabel: { fontWeight: 'bold' },
  statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  listedAt: { color: '#9E9E9E', fontSize: 12, marginTop: 8 },
});
