import React, { useState, useEffect } from 'react';

const EventForm = ({ selectedDate, events, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setTitle('');
    setDescription('');
  }, [selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !selectedDate) return;
    onAdd({ title, description, date: selectedDate });
    setTitle('');
    setDescription('');
  };

  const eventsForDate = events.filter(e => e.date === selectedDate);

  return (
    <div>
      {selectedDate ? (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Events on {selectedDate}
          </h2>

          {eventsForDate.length === 0 ? (
            <p className="text-gray-500 mb-2">No events yet for this date.</p>
          ) : (
            <ul className="mb-4 space-y-2">
              {eventsForDate.map((e, i) => (
                <li key={i} className="border rounded p-2 bg-gray-50">
                  <h3 className="font-semibold">{e.title}</h3>
                  <p className="text-sm text-gray-600">{e.description}</p>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block mb-1 font-medium text-sm">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
                placeholder="Event title"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded text-sm"
                placeholder="Event description"
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
