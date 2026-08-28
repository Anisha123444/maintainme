import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Expense, RecurringPayment, SavingsGoal } from '../types';

interface MMDatabase extends DBSchema {
  expenses: {
    key: string;
    value: Expense;
    indexes: { 'by-date': string; 'by-category': string };
  };
  recurring: {
    key: string;
    value: RecurringPayment;
  };
  goals: {
    key: string;
    value: SavingsGoal;
  };
}

const DB_NAME = 'MM_Finance_DB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MMDatabase>> | null = null;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<MMDatabase>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Expenses store
        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' });
          expenseStore.createIndex('by-date', 'date');
          expenseStore.createIndex('by-category', 'category');
        }

        // Recurring store
        if (!db.objectStoreNames.contains('recurring')) {
          db.createObjectStore('recurring', { keyPath: 'id' });
        }

        // Goals store
        if (!db.objectStoreNames.contains('goals')) {
          db.createObjectStore('goals', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

// Expense Operations
export const dbGetExpenses = async (): Promise<Expense[]> => {
  const db = await getDB();
  const expenses = await db.getAll('expenses');
  return expenses.sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || '')));
};

export const dbAddExpense = async (expense: Expense): Promise<void> => {
  const db = await getDB();
  await db.put('expenses', expense);
};

export const dbUpdateExpense = async (expense: Expense): Promise<void> => {
  const db = await getDB();
  await db.put('expenses', expense);
};

export const dbDeleteExpense = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('expenses', id);
};

// Recurring Operations
export const dbGetRecurring = async (): Promise<RecurringPayment[]> => {
  const db = await getDB();
  return await db.getAll('recurring');
};

export const dbAddRecurring = async (item: RecurringPayment): Promise<void> => {
  const db = await getDB();
  await db.put('recurring', item);
};

export const dbUpdateRecurring = async (item: RecurringPayment): Promise<void> => {
  const db = await getDB();
  await db.put('recurring', item);
};

export const dbDeleteRecurring = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('recurring', id);
};

// Goal Operations
export const dbGetGoals = async (): Promise<SavingsGoal[]> => {
  const db = await getDB();
  return await db.getAll('goals');
};

export const dbAddGoal = async (goal: SavingsGoal): Promise<void> => {
  const db = await getDB();
  await db.put('goals', goal);
};

export const dbUpdateGoal = async (goal: SavingsGoal): Promise<void> => {
  const db = await getDB();
  await db.put('goals', goal);
};

export const dbDeleteGoal = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('goals', id);
};

// Clear All Data
export const dbClearAllData = async (): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction(['expenses', 'recurring', 'goals'], 'readwrite');
  await Promise.all([
    tx.objectStore('expenses').clear(),
    tx.objectStore('recurring').clear(),
    tx.objectStore('goals').clear(),
    tx.done,
  ]);
};

// Bulk Import for Restore Data
export const dbRestoreAllData = async (
  expenses: Expense[],
  recurring: RecurringPayment[],
  goals: SavingsGoal[]
): Promise<void> => {
  await dbClearAllData();
  const db = await getDB();
  const tx = db.transaction(['expenses', 'recurring', 'goals'], 'readwrite');
  
  for (const exp of expenses) {
    await tx.objectStore('expenses').put(exp);
  }
  for (const rec of recurring) {
    await tx.objectStore('recurring').put(rec);
  }
  for (const goal of goals) {
    await tx.objectStore('goals').put(goal);
  }
  await tx.done;
};
