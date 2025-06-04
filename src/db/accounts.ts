import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import { Account } from "../types";

let db: SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLiteDatabase> {
  if (!db) {
    db = await openDatabaseAsync("money.db");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        initialBalance REAL NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
  }
  return db;
}

export async function createAccount(account: Account): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO accounts (id, name, initialBalance, createdAt) VALUES (?, ?, ?, ?)`,
    account.id,
    account.name,
    account.initialBalance,
    account.createdAt
  );
}

export async function getAccounts(): Promise<Account[]> {
  const db = await getDb();
  return await db.getAllAsync<Account>(`SELECT * FROM accounts`);
}

export async function updateAccount(account: Account): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE accounts SET name = ?, initialBalance = ?, createdAt = ? WHERE id = ?`,
    account.name,
    account.initialBalance,
    account.createdAt,
    account.id
  );
}

export async function deleteAccount(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM accounts WHERE id = ?`, id);
}
