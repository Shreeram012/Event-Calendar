import React, { useState } from 'react';
import EventForm from './components/EventForm';
import Calendar from './components/Calendar';

const App = () => {
  const [events, setEvents] = useState([
{
  date: '2025-06-27',
  title: 'Doctor Appointment',
  description: 'Annual check-up',
  time: '10:15'
}
,
  ]);

  const [selectedDate, setSelectedDate] = useState(null);

  const handleAddEvent = (event) => {
    setEvents([...events, event]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📅 Event Calendar</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="md:col-span-2">
          <Calendar
            events={events}
            selectedDate={selectedDate}
            onDateClick={setSelectedDate}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <EventForm
            selectedDate={selectedDate}
            events={events}
            onAdd={handleAddEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

