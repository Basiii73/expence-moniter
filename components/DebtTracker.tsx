import React, { useState } from 'react';
import { Debt } from '../types';

interface DebtTrackerProps {
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  deleteDebt: (id: string) => void;
}

const DebtTracker: React.FC<DebtTrackerProps> = ({ debts, addDebt, deleteDebt }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) {
      setError('Please provide a description and amount.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    addDebt({ description, amount: numericAmount });
    setDescription('');
    setAmount('');
    setError('');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-emerald-400">Debt Tracker</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-grow bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-white px-3 py-2"
            placeholder="e.g., Credit Card"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full sm:w-32 bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-white px-3 py-2"
            placeholder="Amount"
            step="0.01"
          />
          <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
            Add Debt
          </button>
        </form>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
      
      {debts.length > 0 && (
        <div className="border-t border-gray-700 pt-4">
          <ul className="space-y-2">
            {debts.map(debt => (
              <li key={debt.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-md">
                <span className="text-gray-300">{debt.description}</span>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-yellow-400">₹{debt.amount.toFixed(2)}</span>
                   <button
                      onClick={() => deleteDebt(debt.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors duration-200"
                      aria-label={`Delete debt: ${debt.description}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DebtTracker;