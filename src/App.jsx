import React, { useState, useEffect } from 'react';
import EventForm from './components/EventForm';
import Calendar from './components/Calendar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { parseISO } from 'date-fns';

const STORAGE_KEY = 'event-calendar-events';

const App = () => {
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [
      {
        date: '2025-06-27',
        title: 'Sample Event',
        description: 'This is a sample event description.',
        time: '10:15'
      },
    ];
  });

  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  function occursOnDate(event, dateStr) {
    const { recurrence } = event;
    if (!recurrence || !recurrence.type || recurrence.type === 'none') return event.date === dateStr;

    const eventStart = parseISO(event.date);
    const checkDate = parseISO(dateStr);

    if (recurrence.endDate && checkDate > parseISO(recurrence.endDate)) return false;
    if (checkDate < eventStart) return false;

    switch (recurrence.type) {
      case 'daily':
        return (checkDate - eventStart) / (1000 * 60 * 60 * 24) >= 0;
      case 'weekly':
        return (
          ((checkDate - eventStart) / (1000 * 60 * 60 * 24 * 7) >= 0) &&
          recurrence.daysOfWeek &&
          recurrence.daysOfWeek.includes(checkDate.getDay())
        );
      case 'monthly':
        return checkDate.getDate() === eventStart.getDate();
      case 'custom': {
        let diff;
        if (recurrence.unit === 'day') {
          diff = (checkDate - eventStart) / (1000 * 60 * 60 * 24);
        } else if (recurrence.unit === 'week') {
          diff = (checkDate - eventStart) / (1000 * 60 * 60 * 24 * 7);
        } else if (recurrence.unit === 'month') {
          diff = (checkDate.getFullYear() - eventStart.getFullYear()) * 12 + (checkDate.getMonth() - eventStart.getMonth());
        }
        return diff >= 0 && diff % recurrence.interval === 0;
      }
      default:
        return false;
    }
  }


  const handleEventDrop = (event, newDate) => {
    if (event.recurrence && event.recurrence.type !== 'none') {
      alert('Recurring events cannot be rescheduled by drag-and-drop.');
      return;
    }

    const hasConflict = events.some(e =>
      (e.date === newDate || occursOnDate(e, newDate)) &&
      e.time === event.time &&
      e !== event
    );
    if (hasConflict) {
      alert('There is already an event at this time on the selected day.');
      return;
    }

    const idx = events.indexOf(event);
    if (idx !== -1) {
      const updated = [...events];
      updated[idx] = { ...event, date: newDate };
      setEvents(updated);
    }
  };

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
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">📅 Event Calendar</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="md:col-span-2">
            <Calendar
              events={events}
              selectedDate={selectedDate}
              onDateClick={setSelectedDate}
              onEventDrop={handleEventDrop}
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
    </DndProvider>
  );
};

export default App;

