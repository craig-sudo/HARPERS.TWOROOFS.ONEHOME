import React from 'react';

// FIX: Add explicit types for props to resolve TypeScript error with 'key' prop.
const CalendarDay = ({ day, isCurrentMonth, isToday, events = [] }: { day: number; isCurrentMonth: boolean; isToday: boolean; events?: { id: number; title: string; color: string; }[] }) => {
    const dayClasses = `h-24 border-t border-r border-gray-200 p-2 flex flex-col ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`;
    const dateClasses = `w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-harper-purple text-white' : ''} ${!isCurrentMonth ? 'text-gray-400' : ''}`;

    return (
        <div className={dayClasses}>
            <span className={dateClasses}>{day}</span>
            <div className="mt-1 flex-grow overflow-y-auto">
                {events.map(event => (
                    <div key={event.id} className={`text-xs p-1 rounded mb-1 ${event.color === 'pink' ? 'bg-pink-200' : 'bg-blue-200'}`}>
                        {event.title}
                    </div>
                ))}
            </div>
        </div>
    );
};


const CalendarPage: React.FC = () => {
    const calendarDays = [
        ...[28, 29, 30, 31].map(d => ({ day: d, isCurrent: false })),
        ...Array.from({ length: 31 }, (_, i) => ({ day: i + 1, isCurrent: true })),
        { day: 1, isCurrent: false }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-gray-900">Family Calendar</h1>
            <p className="text-lg text-gray-600">Coordinate schedules, events, and memories based on the current plan.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar View */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <button className="p-2 rounded-full hover:bg-gray-100">&lt;</button>
                        <h2 className="text-xl font-bold">October 2025</h2>
                        <button className="p-2 rounded-full hover:bg-gray-100">&gt;</button>
                    </div>
                    <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-b border-l border-r border-gray-200">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="py-2">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 border-l border-b border-gray-200">
                        {calendarDays.map((d, index) => (
                           <CalendarDay 
                            key={index} 
                            day={d.day} 
                            isCurrentMonth={d.isCurrent} 
                            isToday={d.day === 12 && d.isCurrent} 
                            events={d.day === 5 ? [{id: 1, title: "Dad's Time", color: 'blue'}] : d.day === 19 ? [{id: 2, title: "Mom's Time", color: 'pink'}] : []}
                           />
                        ))}
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="font-bold text-lg mb-4">Schedule Key</h3>
                        <div className="space-y-3">
                            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-pink-400 mr-3"></span>Mom's Time</div>
                            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-blue-400 mr-3"></span>Dad's Time</div>
                            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-gray-300 mr-3"></span>Alternate Block</div>
                            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-yellow-300 mr-3"></span>Birthday</div>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="font-bold text-lg mb-2">September 5th, 2025</h3>
                        <div className="flex items-center text-gray-700 py-4">
                            <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </span>
                            Harper with Mom
                        </div>
                        <button className="w-full bg-harper-purple text-white font-bold py-3 px-4 rounded-lg hover:bg-harper-purple-dark transition-colors">
                            Request Schedule Change
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;