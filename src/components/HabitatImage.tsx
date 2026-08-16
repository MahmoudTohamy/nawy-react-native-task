import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  imageUrl: string | null;
  size?: number;
  style?: object;
};

export default function HabitatImage({ imageUrl, size = 60, style }: Props) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return (
      <View style={[styles.fallback, style]}>
        <Ionicons name="planet-outline" size={size} color="#9E9E9E" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={[styles.image, style]}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
  fallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
  },
});
