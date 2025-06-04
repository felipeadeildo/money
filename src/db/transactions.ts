import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite";
import { Transaction } from "../types";

let db: SQLiteDatabase | null = null;

async function getDb(): Promise<SQLiteDatabase> {
  if (!db) {
    db = await openDatabaseAsync("money.db");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        fromAccountId TEXT NOT NULL,
        toAccountId TEXT,
        description TEXT,
        category TEXT,
        FOREIGN KEY(fromAccountId) REFERENCES accounts(id),
        FOREIGN KEY(toAccountId) REFERENCES accounts(id)
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transaction_tags (
        transactionId TEXT NOT NULL,
        tag TEXT NOT NULL,
        PRIMARY KEY (transactionId, tag),
        FOREIGN KEY(transactionId) REFERENCES transactions(id)
      );
    `);
  }
  return db;
}

export async function createTransaction(transaction: Transaction): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO transactions (id, amount, date, fromAccountId, toAccountId, description, category)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    transaction.id,
    transaction.amount,
    transaction.date,
    transaction.fromAccountId,
    transaction.toAccountId ?? null,
    transaction.description ?? null,
    transaction.category ?? null
  );
  if (transaction.tags && transaction.tags.length > 0) {
    for (const tag of transaction.tags) {
      await db.runAsync(
        `INSERT INTO transaction_tags (transactionId, tag) VALUES (?, ?)`,
        transaction.id,
        tag
      );
    }
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  const db = await getDb();
  const transactions = await db.getAllAsync<Transaction>(`SELECT * FROM transactions`);
  for (const tx of transactions) {
    const tags = await db.getAllAsync<{ tag: string }>(
      `SELECT tag FROM transaction_tags WHERE transactionId = ?`,
      tx.id
    );
    tx.tags = tags.map(t => t.tag);
  }
  return transactions;
}

export async function updateTransaction(transaction: Transaction): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE transactions SET amount = ?, date = ?, fromAccountId = ?, toAccountId = ?, description = ?, category = ? WHERE id = ?`,
    transaction.amount,
    transaction.date,
    transaction.fromAccountId,
    transaction.toAccountId ?? null,
    transaction.description ?? null,
    transaction.category ?? null,
    transaction.id
  );
  // Remove old tags
  await db.runAsync(`DELETE FROM transaction_tags WHERE transactionId = ?`, transaction.id);
  // Insert new tags
  if (transaction.tags && transaction.tags.length > 0) {
    for (const tag of transaction.tags) {
      await db.runAsync(
        `INSERT INTO transaction_tags (transactionId, tag) VALUES (?, ?)`,
        transaction.id,
        tag
      );
    }
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM transaction_tags WHERE transactionId = ?`, id);
  await db.runAsync(`DELETE FROM transactions WHERE id = ?`, id);
}
