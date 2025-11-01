import React, { useState } from 'react';
import { categorizeExpense } from '../services/geminiService';
import { ExpenseCategorizerResponse } from '../types';
import { TOOLS } from '../constants';

const ExpenseCategorizer: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState<ExpenseCategorizerResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tool = TOOLS.find(t => t.id === 'expense-categorizer');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter an expense description.');
            return;
        }
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await categorizeExpense(prompt);
            setResponse(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <span className="text-indigo-500 mr-3">{tool?.icon}</span>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{tool?.name}</h1>
                        <p className="text-gray-600">{tool?.description}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="mb-4">
                        <label htmlFor="prompt" className="block text-gray-700 font-semibold mb-2">Expense Description</label>
                        <input
                            id="prompt"
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'Hockey skates for Timmy $129.99 CAD'"
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    >
                        {loading ? 'Categorizing...' : 'Categorize Expense'}
                    </button>
                </form>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">{error}</div>}

                {response && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Details</h2>
                         <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-700">Category:</h3>
                                <p className="text-gray-800 bg-gray-50 p-2 rounded border">{response.category}</p>
                            </div>
                            {response.amount != null && (
                                <div>
                                    <h3 className="font-semibold text-gray-700">Amount:</h3>
                                    <p className="text-gray-800 bg-gray-50 p-2 rounded border">{response.amount}</p>
                                </div>
                            )}
                            {response.currency && (
                                <div>
                                    <h3 className="font-semibold text-gray-700">Currency:</h3>
                                    <p className="text-gray-800 bg-gray-50 p-2 rounded border">{response.currency}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseCategorizer;
