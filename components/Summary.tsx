import React from 'react';

interface SummaryProps {
  totalCredits: number;
  totalExpenses: number;
  totalDebts: number;
  getAdvice: () => void;
  advice: string;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center space-x-2">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-400"></div>
    <span className="text-emerald-300">Thinking...</span>
  </div>
);

const Summary: React.FC<SummaryProps> = ({ totalCredits, totalExpenses, totalDebts, getAdvice, advice, isLoading, error }) => {
  const netBalance = totalCredits - totalExpenses;
  const netBalanceColor = netBalance >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-cyan-400">Financial Overview</h2>
        <div className="space-y-3">
            <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Total Credits:</span>
                <span className="font-bold text-2xl text-green-400">+₹{totalCredits.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Total Expenses:</span>
                <span className="font-bold text-2xl text-red-400">-₹{totalExpenses.toFixed(2)}</span>
            </div>
             <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Total Debts:</span>
                <span className="font-bold text-2xl text-yellow-400">₹{totalDebts.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-700 my-2"></div>
            <div className="flex justify-between items-baseline">
                <span className="text-lg font-semibold text-white">Net Balance:</span>
                <span className={`font-extrabold text-3xl ${netBalanceColor}`}>
                    {netBalance >= 0 ? '₹' : '-₹'}{Math.abs(netBalance).toFixed(2)}
                </span>
            </div>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-xl font-bold mb-3 text-cyan-400">AI Financial Advisor</h3>
        <button
          onClick={getAdvice}
          disabled={isLoading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
        >
          {isLoading ? <LoadingSpinner /> : 'Get Smart Advice'}
        </button>
        
        <div className="mt-4 min-h-[120px] bg-gray-900/50 p-4 rounded-md border border-gray-700">
          {isLoading && <div className="flex justify-center items-center h-full"><p className="text-gray-400">AI is analyzing your finances...</p></div>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {advice ? (
            <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{advice}</p>
          ) : (
            !isLoading && !error && <p className="text-gray-500 text-sm">Click the button for AI-powered insights on your finances.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;