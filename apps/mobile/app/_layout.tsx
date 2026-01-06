import '../global.css';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/ThemeContext';
import { useAuthStore } from '@/stores/auth.store';
import { initI18n } from '@/i18n';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const { initialize, isLoading } = useAuthStore();
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initI18n();
      setI18nReady(true);
      await initialize();
      await SplashScreen.hideAsync();
    };
    init();
  }, [initialize]);

  if (isLoading || !i18nReady) {
    return <View className="flex-1 bg-white" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <KeyboardProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </KeyboardProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
