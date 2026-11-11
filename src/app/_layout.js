import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { colors } from '../theme';

function Routes() {
  const { session, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  return <><StatusBar style="dark" /><Stack id="products-root" screenOptions={{ headerShown: false }}>
    <Stack.Protected guard={!session}><Stack.Screen name="index" /></Stack.Protected>
    <Stack.Protected guard={!!session}><Stack.Screen name="products" /></Stack.Protected>
  </Stack></>;
}
export default function RootLayout() { return <AuthProvider><Routes /></AuthProvider>; }
