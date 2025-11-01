
import React from 'react';

const Welcome: React.FC<{ onStart: () => void }> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-harper-purple text-white rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Meet LUNai</h1>
            <p className="text-lg text-gray-500 mt-2 italic">Focused solely on your child's best interests.</p>
            <p className="text-gray-600 mt-4 max-w-md">Your AI partner is here to guide you toward collaborative, child-focused solutions.</p>

            <div className="my-8 w-full max-w-md text-left space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                     <div className="w-5 h-5 rounded-full bg-green-500 mr-4 flex-shrink-0"></div>
                    <div>
                        <h3 className="font-semibold text-gray-700">Child's Best Interest First</h3>
                        <p className="text-sm text-gray-500">Every analysis and suggestion prioritizes their well-being.</p>
                    </div>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                    <div className="w-5 h-5 rounded-full bg-blue-500 mr-4 flex-shrink-0"></div>
                    <div>
                        <h3 className="font-semibold text-gray-700">Emotional Safety</h3>
                        <p className="text-sm text-gray-500">Guidance to reduce conflict and create a stable environment.</p>
                    </div>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                    <div className="w-5 h-5 rounded-full bg-yellow-500 mr-4 flex-shrink-0"></div>
                    <div>
                        <h3 className="font-semibold text-gray-700">Collaborative Solutions</h3>
                        <p className="text-sm text-gray-500">Tools to help you work together for your child.</p>
                    </div>
                </div>
            </div>

            <button
                onClick={onStart}
                className="bg-harper-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-harper-purple-dark transition-colors shadow-md"
            >
                Start Conversation
            </button>
        </div>
    );
};

export default Welcome;