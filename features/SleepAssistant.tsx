import React, { useState } from 'react';
import { getSleepSchedule } from '../services/geminiService';
import { SleepAssistantResponse } from '../types';
import { TOOLS } from '../constants';

const SleepAssistant: React.FC = () => {
    const [age, setAge] = useState('');
    const [logs, setLogs] = useState('');
    const [desired, setDesired] = useState('');
    const [response, setResponse] = useState<SleepAssistantResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tool = TOOLS.find(t => t.id === 'sleep-assistant');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ageInMonths = parseInt(age, 10);
        if (isNaN(ageInMonths) || ageInMonths <= 0) {
            setError('Please enter a valid age in months.');
            return;
        }
        if (!logs.trim()) {
            setError('Please provide recent sleep logs.');
            return;
        }
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await getSleepSchedule(ageInMonths, logs, desired);
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
                            <label htmlFor="age" className="block text-gray-700 font-semibold mb-2">Child's Age (in months)</label>
                            <input
                                id="age"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="e.g., 18"
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="desired" className="block text-gray-700 font-semibold mb-2">Desired Schedule / Goals</label>
                            <input
                                id="desired"
                                type="text"
                                value={desired}
                                onChange={(e) => setDesired(e.target.value)}
                                placeholder="e.g., 'One nap per day', 'Sleep through the night'"
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="logs" className="block text-gray-700 font-semibold mb-2">Recent Sleep Logs</label>
                        <textarea
                            id="logs"
                            value={logs}
                            onChange={(e) => setLogs(e.target.value)}
                            placeholder="e.g., 'Woke up at 7am, napped from 12:30pm-2pm, bedtime at 7:30pm.'"
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={4}
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    >
                        {loading ? 'Generating...' : 'Get Sleep Advice'}
                    </button>
                </form>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">{error}</div>}

                {response && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Sleep Schedule Recommendation</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Next Nap Time:</h3>
                                <p className="text-gray-800 bg-gray-50 p-3 rounded border text-lg font-medium">{response.nextNapTime}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Suggested Daily Schedule:</h3>
                                <div className="text-gray-800 bg-gray-50 p-3 rounded border whitespace-pre-wrap">{response.suggestedSchedule}</div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Actionable Sleep Tips:</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {response.sleepTips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SleepAssistant;
