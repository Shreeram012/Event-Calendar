import React from 'react';
import Calendar from './components/Calendar';

const App = () => {
  const events = [
    { date: '2025-06-25', title: 'Project Deadline' },
    { date: '2025-06-28', title: 'Team Meeting' },
    { date: '2025-07-02', title: 'Code Review' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Event Calendar</h1>
      <Calendar events={events} />
    </div>
  );
};

export default App;
