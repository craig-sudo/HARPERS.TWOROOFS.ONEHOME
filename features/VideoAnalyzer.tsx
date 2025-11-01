import React, { useState, useRef } from 'react';
import { analyzeVideo } from '../services/geminiService';
import { TOOLS } from '../constants';

const VideoAnalyzer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState<{ summary: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tool = TOOLS.find(t => t.id === 'video-analyzer');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('video/')) {
                setError('Please select a video file.');
                return;
            }
            setFile(selectedFile);
            setError(null);
            setResponse(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a video file to analyze.');
            return;
        }
        if (!prompt.trim()) {
            setError('Please enter a prompt for the analysis.');
            return;
        }
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await analyzeVideo(file, prompt);
            setResponse(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

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
                        <label className="block text-gray-700 font-semibold mb-2">Upload Video</label>
                        <div
                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                            onClick={triggerFileSelect}
                        >
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-600">{file ? file.name : 'Click to upload a video'}</p>
                                <p className="text-xs text-gray-500">MP4, MOV, etc.</p>
                            </div>
                        </div>
                        <input id="video-upload" name="video-upload" type="file" className="sr-only" accept="video/*" onChange={handleFileChange} ref={fileInputRef} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="prompt" className="block text-gray-700 font-semibold mb-2">Analysis Prompt</label>
                        <input
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'Summarize the key events in this video.'"
                            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                    >
                        {loading ? 'Analyzing Video...' : 'Analyze Video'}
                    </button>
                </form>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">{error}</div>}

                {response && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Analysis Summary</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap">
                            {response.summary}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoAnalyzer;