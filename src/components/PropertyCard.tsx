import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Property } from '../types/property';

type Props = {
  property: Property;
  onPress: () => void;
};

export default function PropertyCard({ property, onPress }: Props) {
  const isAvailable = property.status === 'available';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        {property.imageUrl ? (
          <Image source={{ uri: property.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <Ionicons name="home" size={60} color="#9E9E9E" />
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.price}>
          {property.currency} {property.price.toFixed(0)}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {property.address}
        </Text>
        <View style={styles.row}>
          <Ionicons name="bed-outline" size={16} color="#9E9E9E" />
          <Text style={styles.detail}>{property.bedrooms} Bedrooms</Text>
          <Ionicons name="water-outline" size={16} color="#9E9E9E" style={styles.rowGap} />
          <Text style={styles.detail}>{property.bathrooms} Bathrooms</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="resize-outline" size={16} color="#9E9E9E" />
          <Text style={styles.detail}>
            {property.area.toFixed(0)} {property.areaUnit}
          </Text>
          <View style={styles.spacer} />
          <View style={[styles.statusChip, { backgroundColor: isAvailable ? '#C8E6C9' : '#FFE0B2' }]}>
            <Text style={[styles.statusText, { color: isAvailable ? '#2E7D32' : '#EF6C00' }]}>
              {property.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imageContainer: {
    height: 180,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  body: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, color: '#D84315', fontWeight: '600', marginTop: 4 },
  address: { color: '#757575', fontSize: 13, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  rowGap: { marginLeft: 12 },
  detail: { fontSize: 13, marginLeft: 4 },
  spacer: { flex: 1 },
  statusChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  statusText: { fontSize: 12 },
});
