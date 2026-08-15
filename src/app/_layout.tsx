import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#D84315' },
        headerTintColor: '#FFFFFF',
      }}
    />
  );
}
