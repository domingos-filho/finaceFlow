import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabase('finaceflow.db');

export const initDb = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        wallet_id TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        timestamp TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`
    );
  });
};
