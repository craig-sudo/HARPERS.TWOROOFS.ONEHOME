import React, { useState } from 'react';
import { getImprovedCommunication } from '../services/geminiService';
import { ChildFirstCoachResponse } from '../types';
import { TOOLS } from '../constants';

const ChildFirstCoach: React.FC = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState<ChildFirstCoachResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tool = TOOLS.find(t => t.id === 'child-first-coach');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Please enter a message to revise.');
            return;
        }
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await getImprovedCommunication(message);
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
                        <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message to Revise</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type or paste your message here..."
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={5}
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    >
                        {loading ? 'Revising...' : 'Revise Message'}
                    </button>
                </form>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">{error}</div>}

                {response && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Revised Communication</h2>
                        
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Suggested Message:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-800 whitespace-pre-wrap">{response.revisedMessage}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Key Changes & Reasoning:</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {response.keyChanges.map((change, index) => (
                                    <li key={index}>{change}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChildFirstCoach;
