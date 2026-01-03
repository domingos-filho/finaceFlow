import React, { useCallback, useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { v4 as uuid } from 'uuid';

import { useSync } from '../hooks/useSync';
import { db } from '../storage/database';

interface TransactionItem {
  id: string;
  wallet_id: string;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  amount: number;
  timestamp: string;
  synced: number;
}

interface Props {
  walletId: string;
  token: string;
  onBack: () => void;
}

export const TransactionsScreen = ({ walletId, token, onBack }: Props) => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const loadTransactions = useCallback(() => {
    db.readTransaction((tx) => {
      tx.executeSql(
        'SELECT * FROM transactions WHERE wallet_id = ? ORDER BY timestamp DESC',
        [walletId],
        (_, { rows }) => setTransactions(rows._array as TransactionItem[])
      );
    });
  }, [walletId]);

  const { syncNow, loading } = useSync(walletId, token, loadTransactions);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const addTransaction = () => {
    const id = uuid();
    const now = new Date().toISOString();
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO transactions (id, wallet_id, type, description, amount, timestamp, synced, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)',
        [id, walletId, Number(amount) >= 0 ? 'INCOME' : 'EXPENSE', description, Number(amount), now, now],
        () => {
          setDescription('');
          setAmount('');
          loadTransactions();
          syncNow();
        }
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="Voltar" onPress={onBack} />
        <Button title={loading ? 'Sincronizando...' : 'Sincronizar'} onPress={syncNow} />
      </View>
      <Text style={styles.title}>Lançamentos</Text>

      <View style={styles.form}>
        <TextInput placeholder="Descrição" style={styles.input} value={description} onChangeText={setDescription} />
        <TextInput placeholder="Valor" keyboardType="numeric" style={styles.input} value={amount} onChangeText={setAmount} />
        <Button title="Adicionar" onPress={addTransaction} disabled={!description || !amount} />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={item.type === 'INCOME' ? styles.income : styles.expense}>
              {item.type === 'INCOME' ? '+' : '-'} R$ {Math.abs(item.amount).toFixed(2)}
            </Text>
            <Text style={styles.meta}>{new Date(item.timestamp).toLocaleString()} • {item.synced ? 'sincronizado' : 'offline'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum lançamento.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  form: { gap: 8, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 10 },
  desc: { fontWeight: '600' },
  income: { color: 'green', marginTop: 4, fontWeight: 'bold' },
  expense: { color: 'red', marginTop: 4, fontWeight: 'bold' },
  meta: { color: '#666', marginTop: 4 },
});
