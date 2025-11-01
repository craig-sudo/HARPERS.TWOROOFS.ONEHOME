import React, { useState } from 'react';

// FIX: Add explicit types for props to resolve TypeScript errors.
const TabButton = ({ children, isActive, onClick, icon }: { children: React.ReactNode; isActive: boolean; onClick: () => void; icon: React.ReactNode; }) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300 ${isActive ? 'border-harper-purple text-harper-purple' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
    >
        {icon}
        <span className="ml-2">{children}</span>
    </button>
);

const LegalExportView = () => (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-2">Child Welfare Documentation</h3>
        <p className="text-gray-600 mb-6">Professional reports showing your commitment to your child's best interests for court review.</p>
        
        <div className="border border-gray-200 rounded-lg p-6">
            <div className="text-center mb-6">
                <h4 className="font-bold text-lg">HARPER'S PLACE</h4>
                <p className="text-sm text-gray-500">Child-Centered Communication Analysis</p>
                <p className="text-xs text-gray-400">Document ID: HP-2025-10-22-001</p>
            </div>

            <div className="text-sm space-y-2 mb-8">
                <div className="flex justify-between"><span className="text-gray-600">Parties:</span><span className="font-medium">Parent A & Parent B</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Period:</span><span className="font-medium">October 1-22, 2025</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Total Messages:</span><span className="font-medium">47</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Child-Focused Response Rate:</span><span className="font-bold text-green-600">94% (Excellent)</span></div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h5 className="font-bold mb-4">Child's Best Interest Metrics</h5>
                <div className="space-y-4">
                    {['Child Safety Focus: 92%', 'Emotional Stability: 87%', 'Collaborative Tone: 89%', 'Child-Centered Language: 76%'].map(metric => (
                        <div key={metric}>
                            <p className="text-sm font-medium text-gray-700">{metric}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-harper-purple h-2 rounded-full" style={{ width: metric.split(': ')[1] }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="mt-6 flex space-x-4">
            <button className="flex-1 bg-harper-purple text-white font-bold py-3 px-4 rounded-lg hover:bg-harper-purple-dark transition-colors">Export PDF</button>
            <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">Legal Package</button>
        </div>
    </div>
);

const SecurityView = () => {
    const securityItems = [
        { name: 'End-to-End Encryption', detail: 'Messages encrypted before leaving your device' },
        { name: 'Transport Security', detail: 'TLS 1.3 encryption in transit' },
        { name: 'Storage Security', detail: 'AES-256 encryption at rest' },
        { name: 'Access Control', detail: 'Multi-factor authentication required' },
        { name: 'Audit Trail', detail: 'Immutable logging with digital signatures' },
    ];
    return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold mb-2">Security Architecture</h3>
        <p className="text-gray-600 mb-6">Bank-level security protecting your family's communications.</p>
        
        <div className="space-y-4">
            {securityItems.map((item, index) => (
                <div key={item.name} className="flex items-start">
                    <div className={`w-5 h-5 rounded-full ${index % 2 === 0 ? 'bg-orange-400' : 'bg-green-400'} mr-4 mt-1 flex-shrink-0`}></div>
                    <div className="flex-grow flex items-center justify-between pb-4 border-b border-gray-200">
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.detail}</p>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <p className="text-sm text-gray-500 mt-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            All security measures meet or exceed HIPAA, SOC 2, and family court requirements for sensitive communications.
        </p>
    </div>
    )
};

const CommunicationPlatform: React.FC = () => {
    const [activeTab, setActiveTab] = useState('legal');
    
    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <div className="flex justify-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
                    <div className="w-12 h-12 bg-pink-500 text-white rounded-xl flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></div>
                    <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Child-Centered Communication Platform</h1>
                <p className="text-lg text-gray-600 mt-4">Keep your child's best interests at the heart of every conversation. Professional, documented communication that prioritizes your child's emotional well-being, stability, and safety above all else.</p>
            </div>

            <div className="bg-white rounded-t-lg shadow-md border-x border-t border-gray-200">
                <div className="flex">
                    <TabButton isActive={activeTab === 'messaging'} onClick={() => setActiveTab('messaging')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}>Messaging</TabButton>
                    <TabButton isActive={activeTab === 'video'} onClick={() => setActiveTab('video')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}>Video Calls</TabButton>
                    <TabButton isActive={activeTab === 'legal'} onClick={() => setActiveTab('legal')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>Legal Export</TabButton>
                    <TabButton isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}>Security</TabButton>
                </div>
            </div>

            <div>
                {activeTab === 'legal' && <LegalExportView />}
                {activeTab === 'security' && <SecurityView />}
                {(activeTab === 'messaging' || activeTab === 'video') && (
                     <div className="bg-white p-8 text-center rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-xl font-bold">Feature Coming Soon</h3>
                        <p className="text-gray-600 mt-2">This interactive view is currently under development.</p>
                     </div>
                )}
            </div>
        </div>
    );
}

export default CommunicationPlatform;