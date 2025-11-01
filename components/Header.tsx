import React, { useState, useRef, useEffect } from 'react';
import { TOOLS } from '../constants';

// FIX: Add explicit types for props to resolve TypeScript errors.
const NavLink = ({ children, isActive, onClick }: { children: React.ReactNode, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive ? 'bg-harper-purple text-white' : 'text-gray-700 hover:bg-gray-200'
        }`}
    >
        {children}
    </button>
);

const Header: React.FC<{ activeView: string; setActiveView: (view: string) => void }> = ({ activeView, setActiveView }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isAiToolActive = TOOLS.some(tool => tool.id === activeView);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToolSelect = (toolId: string) => {
        setActiveView(toolId);
        setIsDropdownOpen(false);
    }

    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Main Nav */}
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center">
                            <div className="h-8 w-8 bg-harper-purple rounded-full flex items-center justify-center font-bold text-white text-lg">H</div>
                            <span className="ml-2 font-bold text-xl text-gray-800">Harper's Place</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-4">
                            <NavLink isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')}>Dashboard</NavLink>
                            <NavLink isActive={activeView === 'calendar'} onClick={() => setActiveView('calendar')}>Calendar</NavLink>
                             <NavLink isActive={activeView === 'communication'} onClick={() => setActiveView('communication')}>Communication</NavLink>
                             <NavLink isActive={activeView === 'legal-team'} onClick={() => setActiveView('legal-team')}>Legal Team</NavLink>
                        </nav>
                    </div>

                    {/* AI Tools Dropdown and Profile */}
                    <div className="flex items-center space-x-4">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                                    isAiToolActive ? 'bg-harper-purple text-white' : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                AI Tools
                                <svg className={`ml-1 h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {TOOLS.map(tool => (
                                            <button
                                                key={tool.id}
                                                onClick={() => handleToolSelect(tool.id)}
                                                className={`flex items-center w-full text-left px-4 py-2 text-sm ${activeView === tool.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100`}
                                            >
                                                {tool.icon}
                                                <span className="ml-3">{tool.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="h-9 w-9 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-600">
                            CS
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;