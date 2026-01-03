import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { v4 as uuid } from 'uuid';

import { api } from '../api/client';
import { db } from '../storage/database';

export interface LocalTransaction {
  id: string;
  wallet_id: string;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  amount: number;
  timestamp: string;
  synced: number;
  updated_at: string;
}

interface ServerTransaction {
  id: string;
  walletId: string;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  amount: number | string;
  timestamp: string;
  updatedAt?: string;
}

export const useSync = (walletId: string | null, token: string | null, onSynced?: () => void) => {
  const [loading, setLoading] = useState(false);

  const fetchServer = useCallback(async () => {
    if (!walletId || !token) return;
    const lastSync = await getLastUpdated(walletId);
    const unsynced = await getUnsynced(walletId);
    setLoading(true);
    try {
      const response = await api.post('/sync', {
        walletId,
        ...(lastSync ? { lastSyncedAt: lastSync } : {}),
        transactions: unsynced.map((tx) => ({
          id: tx.id,
          type: tx.type,
          description: tx.description,
          amount: tx.amount,
          timestamp: tx.timestamp,
          updatedAt: tx.updated_at,
        })),
      });

      const serverTransactions = (response.data.serverTransactions as ServerTransaction[]).map((tx) => ({
        id: tx.id,
        wallet_id: tx.walletId ?? walletId,
        type: tx.type,
        description: tx.description,
        amount: Number(tx.amount),
        timestamp: new Date(tx.timestamp).toISOString(),
        synced: 1,
        updated_at: tx.updatedAt ?? new Date().toISOString(),
      }));

      await applyServerTransactions(serverTransactions, walletId);
      await markSynced(unsynced.map((tx) => tx.id));
      onSynced?.();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Sync error', error);
      Alert.alert('Falha de sincronização', 'Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [walletId, token, onSynced]);

  useEffect(() => {
    fetchServer();
  }, [fetchServer]);

  return { loading, syncNow: fetchServer, createLocalTransaction };
};

const getUnsynced = (walletId: string) =>
  new Promise<LocalTransaction[]>((resolve, reject) => {
    db.readTransaction((tx) => {
      tx.executeSql(
        'SELECT * FROM transactions WHERE synced = 0 AND wallet_id = ?',
        [walletId],
        (_, { rows }) => resolve(rows._array as LocalTransaction[]),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });

const getLastUpdated = (walletId: string) =>
  new Promise<string | null>((resolve) => {
    db.readTransaction((tx) => {
      tx.executeSql(
        'SELECT MAX(updated_at) as last FROM transactions WHERE wallet_id = ?',
        [walletId],
        (_, { rows }) => {
          const last = rows.item(0)?.last as string | undefined;
          resolve(last ?? null);
        }
      );
    });
  });

const applyServerTransactions = (transactions: LocalTransaction[], walletId: string) =>
  new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      for (const serverTx of transactions) {
        tx.executeSql(
          `INSERT OR REPLACE INTO transactions (id, wallet_id, type, description, amount, timestamp, synced, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
          [
            serverTx.id,
            serverTx.wallet_id ?? walletId,
            serverTx.type,
            serverTx.description,
            serverTx.amount,
            serverTx.timestamp,
            serverTx.updated_at || new Date().toISOString(),
          ]
        );
      }
    }, reject, () => resolve());
  });

const markSynced = (ids: string[]) =>
  new Promise<void>((resolve, reject) => {
    if (!ids.length) return resolve();
    db.transaction((tx) => {
      tx.executeSql(`UPDATE transactions SET synced = 1 WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
    }, reject, () => resolve());
  });

export const createLocalTransaction = (data: Omit<LocalTransaction, 'id' | 'synced' | 'updated_at'>) =>
  new Promise<LocalTransaction>((resolve, reject) => {
    const id = uuid();
    const payload: LocalTransaction = { ...data, id, synced: 0, updated_at: new Date().toISOString() };
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO transactions (id, wallet_id, type, description, amount, timestamp, synced, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)',
        [payload.id, payload.wallet_id, payload.type, payload.description, payload.amount, payload.timestamp, payload.updated_at],
        () => resolve(payload),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
