import React from 'react';

// Define event types and their visual properties for better organization and scalability.
const EVENT_TYPES = {
    MOMS_TIME: 'Moms_Time',
    DADS_TIME: 'Dads_Time',
    CHILDS_ACTIVITY: 'Childs_Activity',
};

const eventConfig = {
    [EVENT_TYPES.MOMS_TIME]: {
        label: "Mom's Time",
        className: 'bg-pink-200 text-pink-800',
        keyColor: 'bg-pink-400',
    },
    [EVENT_TYPES.DADS_TIME]: {
        label: "Dad's Time",
        className: 'bg-blue-200 text-blue-800',
        keyColor: 'bg-blue-400',
    },
    [EVENT_TYPES.CHILDS_ACTIVITY]: {
        label: "Child's Activities",
        className: 'bg-harper-green/40 text-green-900',
        keyColor: 'bg-harper-green',
    },
};

// NOTE: Sample events have been removed. The calendar will now be driven by the active parenting plan.
const sampleEvents: { [key: number]: { id: number; title: string; type: string }[] } = {};


interface CalendarEvent {
    id: number;
    title: string;
    type: string;
}

// FIX: Updated props to use a structured event type for better code clarity and scalability.
const CalendarDay = ({ day, isCurrentMonth, isToday, events = [] }: { day: number; isCurrentMonth: boolean; isToday: boolean; events?: CalendarEvent[] }) => {
    const dayClasses = `h-28 border-t border-r border-gray-200 p-2 flex flex-col ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`;
    const dateClasses = `w-7 h-7 flex items-center justify-center rounded-full text-sm ${isToday ? 'bg-harper-purple text-white font-bold' : ''} ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}`;

    return (
        <div className={dayClasses}>
            <span className={dateClasses}>{day}</span>
            <div className="mt-1 flex-grow overflow-y-auto text-xs space-y-1">
                {events.map(event => (
                    <div key={event.id} className={`p-1 rounded font-medium truncate ${eventConfig[event.type]?.className || ''}`}>
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
            <div>
                 <h1 className="text-4xl font-bold text-gray-900">Family Calendar</h1>
                 <p className="text-lg text-gray-600">This calendar automatically displays the schedule from your active parenting plan in the Living Handbook.</p>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg" role="alert">
                <p className="font-bold">This calendar is now read-only.</p>
                <p>To make changes, please propose an amendment to your parenting plan in the Living Handbook.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar View */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h2 className="text-xl font-bold">October 2025</h2>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
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
                            events={d.isCurrent ? sampleEvents[d.day] || [] : []}
                           />
                        ))}
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="font-bold text-lg mb-4">Schedule Key</h3>
                        <div className="space-y-3">
                           {Object.values(EVENT_TYPES).map(type => (
                                <div key={type} className="flex items-center">
                                    <span className={`w-4 h-4 rounded-full ${eventConfig[type].keyColor} mr-3`}></span>
                                    {eventConfig[type].label}
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="font-bold text-lg mb-2">October 12th, 2025</h3>
                         <div className="text-center text-gray-500 py-8">
                            <p>No events scheduled today.</p>
                        </div>
                        <button className="w-full bg-harper-purple text-white font-bold py-3 px-4 rounded-lg hover:bg-harper-purple-dark transition-colors" onClick={() => alert('Navigate to Living Handbook')}>
                            Go to Living Handbook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
