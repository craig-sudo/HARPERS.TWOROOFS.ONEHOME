import React, { useState } from 'react';
import { createStructuredAction } from '../services/geminiService';
import { StructuredActionLogResponse } from '../types';
import { TOOLS } from '../constants';

const StructuredActionLog: React.FC = () => {
    const [text, setText] = useState('');
    const [response, setResponse] = useState<StructuredActionLogResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tool = TOOLS.find(t => t.id === 'structured-action-log');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            setError('Please enter chat messages to analyze.');
            return;
        }
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await createStructuredAction(text);
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
                        <label htmlFor="text" className="block text-gray-700 font-semibold mb-2">Chat Messages</label>
                        <textarea
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste chat conversation here..."
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={8}
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    >
                        {loading ? 'Analyzing...' : 'Create Action Log'}
                    </button>
                </form>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">{error}</div>}

                {response && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Structured Action Item</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-700">Title:</h3>
                                <p className="text-gray-800 bg-gray-50 p-2 rounded border">{response.title}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Type:</h3>
                                <p className="text-gray-800 bg-gray-50 p-2 rounded border">{response.type}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Details:</h3>
                                <p className="text-gray-800 bg-gray-50 p-2 rounded border whitespace-pre-wrap">{response.details}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StructuredActionLog;
