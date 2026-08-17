import { Stack } from 'expo-router';
import { brand, neutral } from '../theme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: brand.primary },
        headerTintColor: neutral.white,
      }}
    />
  );
}
