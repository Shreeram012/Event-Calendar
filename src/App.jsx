import React, { useState } from 'react';
import EventForm from './components/EventForm';
import Calendar from './components/Calendar';

const App = () => {
  const [events, setEvents] = useState([
{
  date: '2025-06-27',
  title: 'Sample Event',
  description: 'This is a sample event description.',
  time: '10:15'
}
,
  ]);

  const [selectedDate, setSelectedDate] = useState(null);

  const handleAddEvent = (event) => {
    setEvents([...events, event]);
  };

  const handleUpdateEvent = (index, updatedEvent) => {
  const updated = [...events];
  updated[index] = updatedEvent;
  setEvents(updated);
};

const handleDeleteEvent = (index) => {
  const updated = [...events];
  updated.splice(index, 1);
  setEvents(updated);
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
            onUpdate={handleUpdateEvent}
            onDelete={handleDeleteEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

