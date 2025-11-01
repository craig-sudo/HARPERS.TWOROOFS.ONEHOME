import React, { useState } from 'react';
import { getOptimizedSchedule } from '../services/geminiService';

interface ProposalWizardProps {
    onCancel: () => void;
    onSubmit: (proposal: any) => void;
}

const ProposalWizard: React.FC<ProposalWizardProps> = ({ onCancel, onSubmit }) => {
    // State for the wizard
    const [step, setStep] = useState(1);
    const [proposalData, setProposalData] = useState({
        versionNotes: '',
        weeklySchedule: '',
        holidays: '',
        decisionMaking: ''
    });

    // State for the AI schedule generator
    const [showAiHelper, setShowAiHelper] = useState(false);
    const [aiInputs, setAiInputs] = useState({
        parentalNeeds: '',
        childWellbeing: '',
        externalFactors: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const handleGenerateSchedule = async () => {
        setIsGenerating(true);
        setAiError(null);
        try {
            const result = await getOptimizedSchedule(aiInputs.parentalNeeds, aiInputs.childWellbeing, aiInputs.externalFactors);
            setProposalData(prev => ({
                ...prev,
                weeklySchedule: result.optimizedSchedule + '\n\nReasoning:\n' + result.reasoning
            }));
            setShowAiHelper(false);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsGenerating(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = () => {
        // In a real app, this would submit to a backend
        console.log("Submitting proposal:", proposalData);
        onSubmit(proposalData);
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Weekly Schedule
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Step 1: Weekly Schedule</h2>
                        <p className="text-gray-600 mb-4">Define the standard weekly custody and parenting time schedule. You can write your own or use our AI assistant to generate a child-focused starting point.</p>
                        
                        {!showAiHelper && (
                             <button onClick={() => setShowAiHelper(true)} className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-harper-purple hover:bg-harper-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-harper-purple">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                Generate AI Suggestion
                            </button>
                        )}

                        {showAiHelper && (
                             <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                                <h3 className="font-semibold mb-2">AI Schedule Optimizer</h3>
                                <div className="space-y-3">
                                    <textarea value={aiInputs.parentalNeeds} onChange={(e) => setAiInputs({...aiInputs, parentalNeeds: e.target.value})} placeholder="Parental Needs (e.g., work schedules)" className="w-full p-2 border rounded" rows={2}></textarea>
                                    <textarea value={aiInputs.childWellbeing} onChange={(e) => setAiInputs({...aiInputs, childWellbeing: e.target.value})} placeholder="Child's Wellbeing Factors (e.g., age, school, activities)" className="w-full p-2 border rounded" rows={2}></textarea>
                                    <textarea value={aiInputs.externalFactors} onChange={(e) => setAiInputs({...aiInputs, externalFactors: e.target.value})} placeholder="External Factors (e.g., travel time)" className="w-full p-2 border rounded" rows={2}></textarea>
                                    {aiError && <p className="text-red-500 text-sm">{aiError}</p>}
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => setShowAiHelper(false)} className="px-3 py-1 text-sm border rounded">Cancel</button>
                                        <button onClick={handleGenerateSchedule} disabled={isGenerating} className="px-3 py-1 text-sm bg-harper-blue text-white rounded disabled:bg-gray-400">
                                            {isGenerating ? 'Generating...' : 'Generate'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <textarea
                            value={proposalData.weeklySchedule}
                            onChange={e => setProposalData({ ...proposalData, weeklySchedule: e.target.value })}
                            className="w-full p-2 border rounded-md h-64"
                            placeholder="e.g., Week 1: Mom has Monday-Wednesday, Dad has Thursday-Friday, alternate weekends..."
                        />
                    </div>
                );
            case 2: // Holidays
                return (
                     <div>
                        <h2 className="text-xl font-bold mb-4">Step 2: Holidays & Vacations</h2>
                         <p className="text-gray-600 mb-4">Outline the schedule for statutory holidays, school breaks, and vacation time.</p>
                        <textarea
                            value={proposalData.holidays}
                            onChange={e => setProposalData({ ...proposalData, holidays: e.target.value })}
                            className="w-full p-2 border rounded-md h-64"
                            placeholder="e.g., Christmas alternates each year. March break is with Mom in even years..."
                        />
                    </div>
                );
            case 3: // Decision Making
                 return (
                     <div>
                        <h2 className="text-xl font-bold mb-4">Step 3: Decision-Making Authority</h2>
                        <p className="text-gray-600 mb-4">Specify how major decisions regarding education, health, and general welfare will be made.</p>
                        <textarea
                            value={proposalData.decisionMaking}
                            onChange={e => setProposalData({ ...proposalData, decisionMaking: e.target.value })}
                            className="w-full p-2 border rounded-md h-64"
                            placeholder="e.g., Both parents have joint decision-making on all major issues. Day-to-day decisions are made by the parent with care at the time."
                        />
                    </div>
                );
            case 4: // Review
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Step 4: Review & Submit</h2>
                        <p className="text-gray-600 mb-4">Please review the proposal details below. You can go back to make changes. When ready, add any final notes and submit the proposal to the other parent.</p>
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border max-h-80 overflow-y-auto">
                            <div>
                                <h3 className="font-semibold">Weekly Schedule</h3>
                                <p className="text-sm whitespace-pre-wrap p-2">{proposalData.weeklySchedule || 'Not specified.'}</p>
                            </div>
                             <div className="border-t pt-4 mt-4">
                                <h3 className="font-semibold">Holidays & Vacations</h3>
                                <p className="text-sm whitespace-pre-wrap p-2">{proposalData.holidays || 'Not specified.'}</p>
                            </div>
                             <div className="border-t pt-4 mt-4">
                                <h3 className="font-semibold">Decision-Making</h3>
                                <p className="text-sm whitespace-pre-wrap p-2">{proposalData.decisionMaking || 'Not specified.'}</p>
                            </div>
                        </div>
                         <div className="mt-6">
                            <label className="font-semibold text-gray-700 block mb-2">Version Notes (Optional)</label>
                             <input
                                type="text"
                                value={proposalData.versionNotes}
                                onChange={e => setProposalData({ ...proposalData, versionNotes: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                placeholder="e.g., 'Initial proposal based on our discussion.'"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    const totalSteps = 4;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">New Plan Proposal</h1>
                    <span className="text-sm font-medium text-gray-500">Step {step} of {totalSteps}</span>
                </div>
                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-harper-purple h-2 rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="min-h-[450px]">
                {renderStep()}
            </div>
            
            {/* Navigation */}
            <div className="mt-8 pt-6 border-t flex justify-between items-center">
                <button
                    onClick={onCancel}
                    className="text-gray-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                <div className="space-x-2">
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    {step < totalSteps && (
                         <button
                            onClick={nextStep}
                            className="bg-harper-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Next
                        </button>
                    )}
                     {step === totalSteps && (
                         <button
                            onClick={handleSubmit}
                            className="bg-harper-green text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Submit Proposal
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProposalWizard;
