/**
 * WTG Routes - Root Layout
 */

import { View, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme, darkTheme } from '../src/theme';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="navigation/[routeId]"
                options={{
                  headerShown: false,
                  presentation: 'fullScreenModal',
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen
                name="route-planner"
                options={{
                  headerShown: true,
                  title: 'Nowa trasa',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="ai-search"
                options={{
                  headerShown: true,
                  title: 'Wyszukaj AI',
                  presentation: 'modal',
                }}
              />
            </Stack>
          </PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </View>
  );
}
