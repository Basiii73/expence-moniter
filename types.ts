export type TransactionType = 'expense' | 'credit';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
}

export interface Debt {
  id: string;
  description: string;
  amount: number;
}

export const transactionCategories: Record<TransactionType, string[]> = {
  expense: [
    'Food',
    'Transport',
    'Shopping',
    'Utilities',
    'Entertainment',
    'Health',
    'Debt Payment',
    'Other',
  ],
  credit: ['Salary', 'Freelance', 'Gift', 'Bonus', 'Other'],
};
