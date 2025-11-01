import React from 'react';

const ActionCard = ({ title, description, icon, color, onClick }) => (
    <button onClick={onClick} className={`text-left p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-transform duration-300 ${color}`}>
        <div className="flex items-center justify-center w-12 h-12 mb-4 bg-white bg-opacity-20 rounded-full">
            {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="opacity-90">{description}</p>
    </button>
);

const AiToolCard = ({ title, description, icon, onClick }) => (
    <button onClick={onClick} className="text-left bg-white p-5 rounded-xl border border-gray-200 hover:shadow-lg hover:border-harper-purple transition-all duration-300">
        <div className="flex items-center mb-3">
            <div className="w-8 h-8 flex items-center justify-center text-harper-purple">{icon}</div>
            <h4 className="ml-3 font-bold text-gray-800">{title}</h4>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
    </button>
);

const Dashboard: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Harper's Place 🏡</h1>
        <p className="text-lg text-gray-600">Where every decision, every conversation, and every action puts your child's best interests and emotional well-being first.</p>
      </div>

      {/* Child-Centered Actions */}
      <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
             <span className="text-yellow-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
             </span>
             Child-Centered Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard title="Child's Daily Care" description="Monitor well-being & milestones" color="bg-harper-purple" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} onClick={() => {}} />
            <ActionCard title="Safe Communication" description="Child-focused messaging & AI Coach" color="bg-harper-blue" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>} onClick={() => setActiveView('communication')} />
            <ActionCard title="Child's Fund" description="Transparent support & expense tracking" color="bg-harper-green" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} onClick={() => setActiveView('expense-categorizer')} />
          </div>
      </section>

      {/* Overview Widgets */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Recent Activity</h3>
            <div className="text-center text-gray-500 py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                No recent activity
            </div>
        </div>
         <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Family Overview</h3>
            <div className="flex justify-around items-center h-full">
                <div className="text-center">
                    <p className="text-3xl font-bold text-harper-purple">0</p>
                    <p className="text-gray-500">Log Entries</p>
                </div>
                 <div className="text-center">
                    <p className="text-3xl font-bold text-harper-purple">0</p>
                    <p className="text-gray-500">Journal Stories</p>
                </div>
            </div>
        </div>
         <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Memory Journal</h3>
            <div className="text-center text-gray-500 py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>
                </div>
                Add First Entry
            </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
             <span className="text-harper-purple mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
             </span>
             Child-First AI Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AiToolCard 
                    title="Child-Safe Communication" 
                    description="Protect emotional well-being" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    onClick={() => setActiveView('child-first-coach')}
                />
                 <AiToolCard 
                    title="Child-Need Tracking" 
                    description="Prioritize child expenses" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    onClick={() => setActiveView('expense-categorizer')}
                />
                 <AiToolCard 
                    title="Child Safety Analysis" 
                    description="Protect best interests" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                    onClick={() => setActiveView('document-analyzer')}
                />
                 <AiToolCard 
                    title="Child-First Platform" 
                    description="Protect their future" 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    onClick={() => setActiveView('schedule-optimizer')}
                />
          </div>
      </section>
    </div>
  );
};

export default Dashboard;
