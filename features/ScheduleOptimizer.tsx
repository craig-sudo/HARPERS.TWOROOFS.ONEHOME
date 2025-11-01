import React, { useState } from 'react';
import { getOptimizedSchedule } from '../services/geminiService';
import { ScheduleOptimizerResponse } from '../types';
import { TOOLS } from '../constants';

const ScheduleOptimizer: React.FC = () => {
    const [parentalNeeds, setParentalNeeds] = useState('');
    const [childWellbeing, setChildWellbeing] = useState('');
    const [externalFactors, setExternalFactors] = useState('');
    const [response, setResponse] = useState<ScheduleOptimizerResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tool = TOOLS.find(t => t.id === 'schedule-optimizer');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!parentalNeeds.trim() || !childWellbeing.trim()) {
            setError('Please fill in at least Parental Needs and Child\'s Wellbeing factors.');
            return;
        }
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await getOptimizedSchedule(parentalNeeds, childWellbeing, externalFactors);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="parentalNeeds" className="block text-gray-700 font-semibold mb-2">Parental Needs</label>
                            <textarea
                                id="parentalNeeds"
                                value={parentalNeeds}
                                onChange={(e) => setParentalNeeds(e.target.value)}
                                placeholder="e.g., Parent A works 9-5 M-F, Parent B works night shifts."
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={4}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="childWellbeing" className="block text-gray-700 font-semibold mb-2">Child's Wellbeing Factors</label>
                            <textarea
                                id="childWellbeing"
                                value={childWellbeing}
                                onChange={(e) => setChildWellbeing(e.target.value)}
                                placeholder="e.g., Child is 5, has soccer on Tuesdays, needs consistent bedtime."
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={4}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                         <label htmlFor="externalFactors" className="block text-gray-700 font-semibold mb-2">External Factors (Optional)</label>
                         <textarea
                            id="externalFactors"
                            value={externalFactors}
                            onChange={(e) => setExternalFactors(e.target.value)}
                            placeholder="e.g., School holidays, travel distance between homes."
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={3}
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    >
                        {loading ? 'Optimizing...' : 'Optimize Schedule'}
                    </button>
                </form>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">{error}</div>}

                {response && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Optimized Schedule & Reasoning</h2>
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Suggested Schedule:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap font-mono text-sm">
                                {response.optimizedSchedule}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2">Reasoning:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-800 whitespace-pre-wrap">{response.reasoning}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ScheduleOptimizer;
