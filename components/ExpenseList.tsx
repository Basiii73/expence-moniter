import React from 'react';
// FIX: Import `Transaction` instead of non-existent `Expense` and `ExpenseCategory`.
import { Transaction } from '../types';

interface ExpenseListProps {
  // FIX: Update prop to use `Transaction[]` and rename for consistency.
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
}

// FIX: Change `ExpenseCategory` to `string` as it is not an exported type.
const getCategoryColor = (category: string) => {
    // FIX: The Record key should be `string`.
    const colors: Record<string, string> = {
        'Food': 'bg-red-500',
        'Transport': 'bg-blue-500',
        'Shopping': 'bg-purple-500',
        'Utilities': 'bg-yellow-500',
        'Entertainment': 'bg-pink-500',
        'Health': 'bg-green-500',
        'Other': 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
}

// FIX: Update props to use `Transaction` and consistent naming.
const ExpenseItem: React.FC<{ transaction: Transaction; onDelete: (id: string) => void }> = ({ transaction, onDelete }) => (
  <li className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700/60 transition-colors duration-200">
    <div className="flex items-center space-x-4 flex-1 min-w-0">
      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getCategoryColor(transaction.category)}`}></div>
      <div className="min-w-0">
        <p className="font-semibold text-white truncate">{transaction.description}</p>
        <p className="text-sm text-gray-400">{transaction.category} - {transaction.date}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
      <p className="font-bold text-lg text-emerald-400">₹{transaction.amount.toFixed(2)}</p>
      <button
        onClick={() => onDelete(transaction.id)}
        className="text-gray-500 hover:text-red-400 transition-colors duration-200"
        aria-label={`Delete expense: ${transaction.description}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </li>
);

// FIX: Update component props to match the interface.
const ExpenseList: React.FC<ExpenseListProps> = ({ transactions, deleteTransaction }) => {
  // FIX: Filter transactions to ensure only expenses are displayed.
  const expenses = transactions.filter(t => t.type === 'expense');
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Expense History</h2>
      {expenses.length === 0 ? (
        <div className="text-center text-gray-400 py-10 border-2 border-dashed border-gray-700 rounded-lg">
          <p>No expenses recorded yet.</p>
          <p className="text-sm mt-1">Use the form above to add your first expense.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {/* FIX: Map over the filtered `expenses` array and pass correct props. */}
          {expenses.map(expense => (
            <ExpenseItem key={expense.id} transaction={expense} onDelete={deleteTransaction} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;