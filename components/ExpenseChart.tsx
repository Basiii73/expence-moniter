import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Import `Transaction` type instead of the non-existent `Expense` type.
import { Transaction } from '../types';

interface ExpenseChartProps {
  // FIX: Update prop to use `Transaction[]` and rename for clarity.
  transactions: Transaction[];
}

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#6EE7B7', '#93C5FD'];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-700/80 backdrop-blur-sm p-3 rounded-lg border border-gray-600 shadow-lg">
          <p className="label text-white font-semibold">{`${payload[0].name}`}</p>
          <p className="intro text-emerald-400">{`₹${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
};

// FIX: Update component props to match the interface.
const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    // FIX: Filter transactions to ensure only expenses are used for the chart.
    const expenses = transactions.filter(t => t.type === 'expense');
    if (expenses.length === 0) return [];
    
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      // FIX: Cast `value` to `number` to resolve "toFixed does not exist on type 'unknown'" error.
      value: parseFloat((value as number).toFixed(2)),
    }));
  // FIX: Update dependency array to use the `transactions` prop.
  }, [transactions]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Spending by Category</h2>
      <div style={{ width: '100%', height: 300 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-400">
            <p>No data to display. <br/> Add some expenses to see the chart.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;