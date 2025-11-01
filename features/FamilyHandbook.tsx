import React, { useState } from 'react';
import ProposalWizard from './ProposalWizard';

const PlanStatus = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Active Plan: Version 3.1</h3>
        <p className="text-gray-500 text-sm">Finalized on October 1st, 2025</p>
        <p className="mt-4 bg-green-50 text-green-800 text-sm font-medium py-2 px-4 rounded-lg">This plan is active and its schedule is reflected in the Family Calendar.</p>
    </div>
);

const PendingProposal = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
         <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800">New Proposal Pending</h3>
                <p className="text-gray-500 text-sm">Parent B suggested changes on Oct 14, 2025.</p>
            </div>
        </div>
        <div className="flex space-x-4 mt-4">
            <button className="flex-1 bg-harper-purple text-white font-bold py-3 px-4 rounded-lg hover:bg-harper-purple-dark transition-colors">
                Review Changes
            </button>
             <button className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                View History
            </button>
        </div>
    </div>
);


const FamilyHandbook: React.FC = () => {
    const [viewMode, setViewMode] = useState<'dashboard' | 'proposing'>('dashboard');

    const handleStartProposal = () => setViewMode('proposing');
    const handleCancelProposal = () => setViewMode('dashboard');
    const handleSubmitProposal = (proposal: any) => {
        console.log("Submitting proposal:", proposal);
        // In a real app, this would be sent to a backend and update the state.
        // For now, we'll just go back to the dashboard.
        setViewMode('dashboard');
    };

    if (viewMode === 'proposing') {
        return <ProposalWizard onCancel={handleCancelProposal} onSubmit={handleSubmitProposal} />;
    }

    return (
        <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
                 <div className="mx-auto w-16 h-16 rounded-2xl bg-harper-purple-light flex items-center justify-center mb-4 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6s-1.5 2-4 2-4-2-4-2v12s1.5-2 4-2 4 2 4 2V6zm0 12s1.5-2 4-2 4 2 4 2V6s-1.5 2-4 2-4-2-4-2v12z" /></svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">The Living Handbook</h1>
                <p className="text-lg text-gray-600 mt-4">This is the central hub for your family's parenting plan. Propose, negotiate, and finalize a clear, child-focused agreement that guides your co-parenting.</p>
            </div>
            
            <div className="flex justify-center md:justify-end">
                <button 
                    onClick={handleStartProposal}
                    className="bg-harper-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Propose New Plan or Amendment
                </button>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <PlanStatus />
                <PendingProposal />
            </section>
            
            <section>
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Plan History</h3>
                    <p className="text-gray-600 mb-6 text-sm">Review past versions of your parenting plan to understand how it has evolved.</p>
                    {/* Placeholder for history items */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                            <div>
                                <p className="font-semibold text-gray-700">Version 3.0</p>
                                <p className="text-xs text-gray-500">Active from July 15 - Oct 1, 2025</p>
                            </div>
                            <button className="text-sm font-semibold text-harper-purple hover:underline">View Details</button>
                        </div>
                         <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                            <div>
                                <p className="font-semibold text-gray-700">Version 2.5</p>
                                <p className="text-xs text-gray-500">Active from Mar 10 - July 15, 2025</p>
                            </div>
                            <button className="text-sm font-semibold text-harper-purple hover:underline">View Details</button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default FamilyHandbook;
