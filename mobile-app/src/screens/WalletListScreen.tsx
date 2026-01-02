import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { api } from '../api/client';
import { AuthContext } from '../context/AuthContext';

interface Wallet {
  id: string;
  name: string;
}

interface Props {
  onSelect: (wallet: Wallet) => void;
}

export const WalletListScreen = ({ onSelect }: Props) => {
  const { signOut } = useContext(AuthContext);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWallets = async () => {
    setLoading(true);
    const response = await api.get('/wallets');
    setWallets(response.data as Wallet[]);
    setLoading(false);
  };

  useEffect(() => {
    loadWallets();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas carteiras</Text>
        <Button title="Sair" onPress={signOut} />
      </View>
      <FlatList
        data={wallets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Nenhuma carteira disponível.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold' },
  card: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
});
