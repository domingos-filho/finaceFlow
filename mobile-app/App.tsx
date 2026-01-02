import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';

import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { initDb } from './src/storage/database';
import { LoginScreen } from './src/screens/LoginScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { WalletListScreen } from './src/screens/WalletListScreen';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { token, loading } = useContext(AuthContext);
  const [walletId, setWalletId] = useState<string | null>(null);

  useEffect(() => {
    initDb();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : walletId ? (
          <Stack.Screen name="Transactions">
            {() => <TransactionsScreen walletId={walletId} token={token} onBack={() => setWalletId(null)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Wallets">
            {() => <WalletListScreen onSelect={(wallet) => setWalletId(wallet.id)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
