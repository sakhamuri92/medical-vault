import '../global.css';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { runMigrations } from '@/db/migrations';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const db = SQLite.openDatabaseSync('medvault.db');
    runMigrations(db)
      .then(() => setDbReady(true))
      .catch((err) => {
        console.error('DB migration failed', err);
        setDbReady(true); // still let the app open so user sees an error screen
      });
  }, []);

  if (!dbReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
