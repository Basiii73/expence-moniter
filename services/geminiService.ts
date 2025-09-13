import { GoogleGenAI } from "@google/genai";
import { Transaction, Debt } from '../types';

export const getFinancialAdvice = async (transactions: Transaction[], debts: Debt[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return new Promise(resolve => setTimeout(() => resolve("This is a sample AI advice because the API key is not configured. \n\n1. **Maximize Income:** Your freelance project is a great income source. \n2. **Manage Debts:** Consider a plan to tackle the credit card debt first. \n3. **Review Spending:** Analyze your expense categories to find potential savings."), 1000));
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const credits = transactions.filter(t => t.type === 'credit');
  const expenses = transactions.filter(t => t.type === 'expense');

  const format = (items: {description: string, category?: string, amount: number}[]) => 
    items.map(i => `- ${i.description} ${i.category ? `(${i.category})` : ''}: ₹${i.amount.toFixed(2)}`).join('\n') || 'None';

  const totalEarned = credits.reduce((sum, t) => sum + t.amount, 0).toFixed(2);
  const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0).toFixed(2);
  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0).toFixed(2);

  const prompt = `
    You are a friendly and insightful financial advisor.
    Based on the following financial summary, provide a brief analysis and 2-3 actionable, encouraging tips to help the user improve their financial situation.
    All monetary values are in Indian Rupees (INR).
    Do not be judgmental. Keep the tone positive and helpful. The output should be a single block of text, formatted for easy reading with clear bullet points or numbered lists for the tips.

    FINANCIAL SUMMARY:
    - Total Credits (Income): ₹${totalEarned}
    - Total Expenses: ₹${totalSpent}
    - Net Balance: ₹${(+totalEarned - +totalSpent).toFixed(2)}
    - Total Outstanding Debt: ₹${totalDebt}

    CREDIT DETAILS:
    ${format(credits)}

    EXPENSE DETAILS:
    ${format(expenses)}

    DEBT DETAILS:
    ${format(debts)}

    Provide your analysis and advice below:
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.5,
        }
    });
    
    return response.text.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI advisor.");
  }
};