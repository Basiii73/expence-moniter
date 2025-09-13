import React, { useState } from 'react';
// FIX: Import `Transaction` and `transactionCategories` from `../types` to resolve import errors.
import { Transaction, transactionCategories } from '../types';

interface ExpenseFormProps {
  // FIX: Update prop type to use `Omit<Transaction, 'id' | 'date'>`.
  addExpense: (expense: Omit<Transaction, 'id' | 'date'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ addExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  // FIX: Initialize category state with the first item from `transactionCategories.expense`.
  const [category, setCategory] = useState<string>(transactionCategories.expense[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) {
      setError('Please fill in all fields.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid, positive amount.');
      return;
    }
    
    // FIX: Pass a valid `Transaction` object with `type: 'expense'`.
    addExpense({ description, amount: numericAmount, category, type: 'expense' });
    
    setDescription('');
    setAmount('');
    // FIX: Reset category using `transactionCategories.expense`.
    setCategory(transactionCategories.expense[0]);
    setError('');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-white px-3 py-2"
            placeholder="e.g., Coffee with friends"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-white px-3 py-2"
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
          <select
            id="category"
            value={category}
            // FIX: Remove invalid `ExpenseCategory` type assertion.
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-white px-3 py-2"
          >
            {/* FIX: Map over `transactionCategories.expense` to populate options. */}
            {transactionCategories.expense.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;