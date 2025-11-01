
import React, { useState, useRef, useEffect, useCallback } from 'react';
// FIX: Removed `LiveSession` as it is not an exported member.
import { GoogleGenAI, Chat, Part, LiveServerMessage, Modality, Blob as GenaiBlob } from '@google/genai';
import { generateSpeech } from '../services/geminiService';
import Welcome from './Welcome';

// --- Audio Helper Functions from Guidelines ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    image?: string;
}

const LunaiAssistant: React.FC = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'initial', role: 'model', text: "Hello! I'm LUNai. My only interest is your child's best interest. How can I help you focus on that today?" }
    ]);
    const [input, setInput] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isThinkingMode, setIsThinkingMode] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const chatRef = useRef<Chat | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    // FIX: Changed `LiveSession` to `any` because it is not an exported type.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);
    
    const API_KEY = process.env.API_KEY;

    const initializeChat = useCallback(() => {
        if (!API_KEY) {
            setError("API_KEY is not configured.");
            return;
        }
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const model = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash-lite';
        
        const systemInstruction = "You are LUNai, a child-focused AI assistant. Your only interest is the child's best interest. Every response must prioritize the child's well-being, emotional safety, and stability. Guide the user toward collaborative, non-confrontational solutions.";

        const config = {
            systemInstruction,
            ...(isThinkingMode && { thinkingConfig: { thinkingBudget: 32768 } })
        };
        
        chatRef.current = ai.chats.create({
            model,
            config,
        });
    }, [isThinkingMode, API_KEY]);

    useEffect(() => {
        initializeChat();
    }, [initializeChat]);
    
    useEffect(() => {
        if (hasStarted) {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, hasStarted]);


    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const currentInput = input.trim();
        if (!currentInput && !imageFile) return;

        setError(null);
        setIsLoading(true);

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: currentInput,
            image: imagePreview || undefined,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setImageFile(null);
        setImagePreview(null);
        
        try {
            if (!chatRef.current) {
                initializeChat();
                if (!chatRef.current) {
                     throw new Error("Chat not initialized.");
                }
            }
            
            const parts: Part[] = [{ text: currentInput }];
            if (imageFile) {
                const base64Data = await fileToBase64(imageFile);
                parts.unshift({
                    inlineData: {
                        data: base64Data,
                        mimeType: imageFile.type,
                    },
                });
            }

            const responseStream = await chatRef.current.sendMessageStream({ message: parts });

            let modelResponse = '';
            const modelMessageId = Date.now().toString() + "-model";
            setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => prev.map(msg => msg.id === modelMessageId ? { ...msg, text: modelResponse } : msg));
            }
            
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            setMessages(prev => [...prev, {id: 'error', role: 'model', text: 'Sorry, I encountered an error.'}]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleToggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            if (!API_KEY) {
                 setError("API_KEY is not configured.");
                 return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setIsRecording(true);
                
                const ai = new GoogleGenAI({ apiKey: API_KEY });
                
                let transcribedText = '';

                sessionPromiseRef.current = ai.live.connect({
                  model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                  callbacks: {
                    onopen: () => console.log('Live session opened.'),
                    onmessage: (message: LiveServerMessage) => {
                      if (message.serverContent?.inputTranscription) {
                        transcribedText += message.serverContent.inputTranscription.text;
                        setInput(transcribedText);
                      }
                      if(message.serverContent?.turnComplete) {
                        setInput(transcribedText);
                      }
                    },
                    onerror: (e: ErrorEvent) => setError(`Live session error: ${e.message}`),
                    onclose: (e: CloseEvent) => console.log('Live session closed.'),
                  },
                  config: {
                    inputAudioTranscription: {},
                  },
                });

                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.ondataavailable = (event) => {
                   event.data.arrayBuffer().then(buffer => {
                       const blob: GenaiBlob = {
                         data: encode(new Uint8Array(buffer)),
                         mimeType: event.data.type,
                       };
                       sessionPromiseRef.current?.then(session => {
                           session.sendRealtimeInput({ media: blob });
                       });
                   });
                };
                mediaRecorder.start(1000); // Send data every second

                 mediaRecorder.onstop = () => {
                    stream.getTracks().forEach(track => track.stop());
                    sessionPromiseRef.current?.then(session => session.close());
                };

            } catch (err) {
                setError("Could not access microphone. Please grant permission.");
                setIsRecording(false);
            }
        }
    };
    
    const handleTTS = async (text: string) => {
        try {
            const audioBase64 = await generateSpeech(text);
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
            const audioBuffer = await decodeAudioData(decode(audioBase64), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate audio.');
        }
    };

    if (!hasStarted) {
        return (
            <div className="h-[calc(100vh-10rem)] max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
                <Welcome onStart={() => setHasStarted(true)} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
             <div className="p-4 border-b flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">LUNai Child-Focused AI</h1>
                <div className="flex items-center space-x-2">
                    <label htmlFor="thinking-mode" className="text-sm font-medium text-gray-700">Thinking Mode</label>
                    <input
                      type="checkbox"
                      id="thinking-mode"
                      checked={isThinkingMode}
                      onChange={(e) => setIsThinkingMode(e.target.checked)}
                      className="toggle-checkbox"
                    />
                    <div className="relative">
                        <input id="thinking-mode" type="checkbox" className="sr-only" checked={isThinkingMode} onChange={(e) => setIsThinkingMode(e.target.checked)} />
                        <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isThinkingMode ? 'translate-x-6 bg-harper-purple-dark' : ''}`}></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-harper-purple text-white' : 'bg-gray-200 text-gray-800'}`}>
                                {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-2 max-h-60" />}
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                {msg.role === 'model' && msg.text && (
                                    <button onClick={() => handleTTS(msg.text)} className="mt-2 text-xs text-gray-500 hover:text-gray-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 5.858a3 3 0 010 4.243m12.728 0a3 3 0 010 4.243" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                            <div className="max-w-lg p-3 rounded-2xl bg-gray-200 text-gray-800">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messageEndRef} />
                </div>
            </div>
            
            {error && <div className="p-4 text-sm text-red-700 bg-red-100 border-t">{error}</div>}

            <div className="p-4 border-t">
                {imagePreview && (
                    <div className="relative w-24 h-24 mb-2">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        <button onClick={() => {setImageFile(null); setImagePreview(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">&times;</button>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                    <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
                    <label htmlFor="image-upload" className="p-2 text-gray-500 hover:text-harper-purple cursor-pointer rounded-full hover:bg-gray-100">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </label>
                     <button type="button" onClick={handleToggleRecording} className={`p-2 rounded-full hover:bg-gray-100 ${isRecording ? 'text-red-500' : 'text-gray-500 hover:text-harper-purple'}`}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 10v1m-6-1v1m12-1v1M9 11a3 3 0 116 0a3 3 0 01-6 0zM12 2a1 1 0 00-1 1v6a1 1 0 002 0V3a1 1 0 00-1-1z" /></svg>
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isRecording ? "Listening..." : "Type your message..."}
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-harper-purple"
                        disabled={isLoading}
                    />
                    <button type="submit" className="p-2 bg-harper-purple text-white rounded-full disabled:bg-gray-300" disabled={isLoading}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LunaiAssistant;
