import React, { useState, useRef } from 'react';
import { processEvidenceImage } from '../services/geminiService';
import { EvidenceProcessorResponse } from '../types';
import { TOOLS } from '../constants';

const EvidenceProcessor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [response, setResponse] = useState<EvidenceProcessorResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tool = TOOLS.find(t => t.id === 'evidence-processor');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                setError('Please select an image file.');
                return;
            }
            setFile(selectedFile);
            setError(null);
            setResponse(null);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select an image to process.');
            return;
        }
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const imageDataUri = await fileToBase64(file);
            const result = await processEvidenceImage(imageDataUri, file.type);
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
                        <label htmlFor="image-upload" className="block text-gray-700 font-semibold mb-2">Upload Image</label>
                        <div 
                           className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                           onClick={triggerFileSelect}
                        >
                            <div className="space-y-1 text-center">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="mx-auto h-48 w-auto object-contain rounded-md" />
                                ) : (
                                    <>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <p className="pl-1">Click to upload an image</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                        {file && <p className="text-sm text-gray-500 mt-2 text-center">Selected file: {file.name}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                    >
                        {loading ? 'Processing...' : 'Process Image'}
                    </button>
                </form>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8" role="alert">{error}</div>}

                {response && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Analysis Results</h2>
                         <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-700">Suggested Title:</h3>
                                <p className="text-gray-800 bg-gray-50 p-2 rounded border">{response.suggestedTitle}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Suggested Category:</h3>
                                <p className="text-gray-800 bg-gray-50 p-2 rounded border">{response.suggestedCategory}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700">Factual Summary:</h3>
                                <p className="text-gray-800 bg-gray-50 p-2 rounded border whitespace-pre-wrap">{response.summary}</p>
                            </div>
                            {response.ocrConfidence != null && (
                                <div>
                                    <h3 className="font-semibold text-gray-700">OCR Confidence:</h3>
                                    <p className="text-gray-800 bg-gray-50 p-2 rounded border">
                                        {(response.ocrConfidence * 100).toFixed(0)}%
                                    </p>
                                </div>
                            )}
                             <div>
                                <h3 className="font-semibold text-gray-700 mb-1">Extracted Text:</h3>
                                <p className="text-gray-800 bg-gray-50 p-2 rounded border whitespace-pre-wrap h-48 overflow-y-auto">{response.extractedText}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvidenceProcessor;