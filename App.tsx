import React, { useState, useCallback, useMemo } from 'react';
import { Transaction, Debt } from './types';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import CategoryChart from './components/CategoryChart';
import DebtTracker from './components/DebtTracker';
import { getFinancialAdvice } from './services/geminiService';

const initialTransactions: Transaction[] = [
    { id: '1', description: 'Monthly Salary', amount: 75000.00, category: 'Salary', date: '2024-07-28', type: 'credit'},
    { id: '2', description: 'Groceries from Market', amount: 3500.50, category: 'Food', date: '2024-07-28', type: 'expense' },
    { id: '3', description: 'Monthly train pass', amount: 1500.00, category: 'Transport', date: '2024-07-27', type: 'expense' },
    { id: '4', description: 'Freelance Project', amount: 15000.00, category: 'Freelance', date: '2024-07-26', type: 'credit'},
    { id: '5', description: 'Electricity Bill', amount: 2250.25, category: 'Utilities', date: '2024-07-25', type: 'expense' },
];

const initialDebts: Debt[] = [
    { id: 'd1', description: 'Student Loan', amount: 250000 },
    { id: 'd2', description: 'Credit Card', amount: 55000 },
];

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [advice, setAdvice] = useState<string>('');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const addDebt = (debt: Omit<Debt, 'id'>) => {
    const newDebt: Debt = { ...debt, id: crypto.randomUUID() };
    setDebts(prev => [newDebt, ...prev]);
  };
  
  const deleteDebt = (id: string) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };
  
  const handleGetAdvice = useCallback(async () => {
    if (transactions.length === 0 && debts.length === 0) {
      setError('Add some transactions or debts before getting advice.');
      return;
    }
    setIsLoadingAdvice(true);
    setError(null);
    setAdvice('');
    try {
      const result = await getFinancialAdvice(transactions, debts);
      setAdvice(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get financial advice: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoadingAdvice(false);
    }
  }, [transactions, debts]);
  
  const { totalCredits, totalExpenses, totalDebts } = useMemo(() => {
    const credits = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const debtTotal = debts.reduce((sum, d) => sum + d.amount, 0);
    return { totalCredits: credits, totalExpenses: expenses, totalDebts: debtTotal };
  }, [transactions, debts]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            AI Expense Monitor
          </h1>
          <p className="mt-2 text-lg text-gray-400">Track your finances and get smart insights.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <TransactionForm addTransaction={addTransaction} />
            <DebtTracker debts={debts} addDebt={addDebt} deleteDebt={deleteDebt} />
            <Summary 
              totalCredits={totalCredits}
              totalExpenses={totalExpenses}
              totalDebts={totalDebts}
              getAdvice={handleGetAdvice}
              advice={advice}
              isLoading={isLoadingAdvice}
              error={error}
            />
          </div>

          <div className="space-y-8">
            <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} />
            <CategoryChart transactions={transactions} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;