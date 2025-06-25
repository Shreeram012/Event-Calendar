import React, { useState, useEffect } from 'react';
import { parse, compareAsc } from 'date-fns';

const EventForm = ({ selectedDate, events, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    // Clear inputs when a new date is selected
    setTitle('');
    setDescription('');
    setTime('');
  }, [selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !time || !selectedDate) return;

    onAdd({ date: selectedDate, title, description, time });
    setTitle('');
    setDescription('');
    setTime('');
  };

  // Filter and sort events for selected date
  const eventsForDate = events
    .filter(e => e.date === selectedDate)
    .sort((a, b) =>
      compareAsc(
        parse(a.time, 'HH:mm', new Date()),
        parse(b.time, 'HH:mm', new Date())
      )
    );

  return (
    <div>
      {selectedDate ? (
        <>
          <h2 className="text-lg font-semibold mb-3">
            Events on {selectedDate}
          </h2>

          {/* Existing events */}
          {eventsForDate.length === 0 ? (
            <p className="text-gray-500 mb-4">No events yet for this date.</p>
          ) : (
            <ul className="mb-4 space-y-3">
              {eventsForDate.map((e, i) => (
                <li key={i} className="border p-2 rounded bg-gray-50">
                  <div className="text-sm font-medium text-green-800">
                    {e.time} - {e.title}
                  </div>
                  <p className="text-sm text-gray-600">{e.description}</p>
                </li>
              ))}
            </ul>
          )}

          {/* Add new event */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
                placeholder="Event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
                placeholder="Event description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Add Event
            </button>
          </form>
        </>
      ) : (
        <p className="text-gray-500 italic">
          Click a date on the calendar to view or add events.
        </p>
      )}
    </div>
  );
};

export default EventForm;
