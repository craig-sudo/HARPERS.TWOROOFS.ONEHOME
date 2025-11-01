import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

import Dashboard from './features/Dashboard';
import CalendarPage from './features/CalendarPage';
import CommunicationPlatform from './features/CommunicationPlatform';
import ChildFirstCoach from './features/ChildFirstCoach';
import StructuredActionLog from './features/StructuredActionLog';
import DocumentAnalyzer from './features/DocumentAnalyzer';
import EvidenceProcessor from './features/EvidenceProcessor';
import ScheduleOptimizer from './features/ScheduleOptimizer';
import ExpenseCategorizer from './features/ExpenseCategorizer';
import SleepAssistant from './features/SleepAssistant';
// FIX: Switched to a named import for LegalTeamView to resolve module resolution error.
import { LegalTeamView } from './features/LegalTeamView';
import FamilyHandbook from './features/FamilyHandbook';
import LunaiAssistant from './features/AiAssistant';
import VideoAnalyzer from './features/VideoAnalyzer';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'calendar':
        return <CalendarPage />;
      case 'communication':
        return <CommunicationPlatform />;
      case 'legal-team':
        return <LegalTeamView />;
      case 'family-handbook':
        return <FamilyHandbook />;
      // AI Tools
      case 'child-first-coach':
        return <ChildFirstCoach />;
      case 'structured-action-log':
        return <StructuredActionLog />;
      case 'document-analyzer':
        return <DocumentAnalyzer />;
      case 'evidence-processor':
        return <EvidenceProcessor />;
      case 'schedule-optimizer':
        return <ScheduleOptimizer />;
      case 'expense-categorizer':
        return <ExpenseCategorizer />;
      case 'sleep-assistant':
        return <SleepAssistant />;
      case 'lunai-assistant':
        return <LunaiAssistant />;
      case 'video-analyzer':
        return <VideoAnalyzer />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;