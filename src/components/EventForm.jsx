import React, { useState, useEffect } from 'react';
import { parse, compareAsc } from 'date-fns';

const recurrenceDefaults = {
  type: 'none', 
  daysOfWeek: [], 
  interval: 1, 
  unit: 'day', 
  endDate: '', 
};

const EventForm = ({ selectedDate, events, onAdd, onDelete, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [warning, setWarning] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [recurrence, setRecurrence] = useState(recurrenceDefaults);

  useEffect(() => {
    setTitle('');
    setDescription('');
    setTime('');
    setWarning('');
    setEditingIndex(null);
    setRecurrence(recurrenceDefaults);
  }, [selectedDate]);

  const eventsForDate = events
    .filter(e => e.date === selectedDate)
    .sort((a, b) =>
      compareAsc(
        parse(a.time, 'HH:mm', new Date()),
        parse(b.time, 'HH:mm', new Date())
      )
    );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !time || !selectedDate) {
      setWarning('All fields are required.');
      return;
    }

    const isDuplicateTime = eventsForDate.some((e, idx) =>
      e.time === time && idx !== editingIndex
    );

    if (isDuplicateTime) {
      setWarning(`An event already exists at ${time}.`);
      return;
    }

    const newEvent = { date: selectedDate, title, description, time, recurrence };

    if (editingIndex !== null) {
      const originalEvent = eventsForDate[editingIndex];
      const globalIndex = events.findIndex(
        e =>
          e.date === selectedDate &&
          e.title === originalEvent.title &&
          e.time === originalEvent.time &&
          e.description === originalEvent.description
      );
      if (globalIndex !== -1) {
        onUpdate(globalIndex, newEvent);
      }
    } else {
      onAdd(newEvent);
    }

    setTitle('');
    setDescription('');
    setTime('');
    setWarning('');
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    const e = eventsForDate[index];
    setTitle(e.title);
    setDescription(e.description);
    setTime(e.time);
    setRecurrence(e.recurrence || recurrenceDefaults);
    setEditingIndex(index);
    setWarning('');
  };

  const handleDelete = (index) => {
    const eventToDelete = eventsForDate[index];
    const globalIndex = events.findIndex(
      e =>
        e.date === selectedDate &&
        e.title === eventToDelete.title &&
        e.time === eventToDelete.time &&
        e.description === eventToDelete.description
    );
    if (globalIndex !== -1) {
      onDelete(globalIndex);
    }
    if (editingIndex === index) {
      setTitle('');
      setDescription('');
      setTime('');
      setEditingIndex(null);
    }
  };

  return (
    <div>
      {selectedDate ? (
        <>
          <h2 className="text-lg font-semibold mb-3">
            Events on {selectedDate}
          </h2>

          {eventsForDate.length === 0 ? (
            <p className="text-gray-500 mb-4">No events yet for this date.</p>
          ) : (
            <ul className="mb-4 space-y-3">
              {eventsForDate.map((e, i) => (
                <li key={i} className="border p-2 rounded bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-green-800">
                        {e.time} - {e.title}
                      </div>
                      <p className="text-sm text-gray-600">{e.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className="text-blue-600 text-xs underline"
                        onClick={() => handleEdit(i)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 text-xs underline"
                        onClick={() => handleDelete(i)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {warning && (
              <div className="text-red-600 text-sm font-medium">{warning}</div>
            )}

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

            <div>
              <label className="block text-sm font-medium mb-1">Recurrence</label>
              <select
                className="w-full border px-3 py-2 rounded text-sm"
                value={recurrence.type}
                onChange={e =>
                  setRecurrence({ ...recurrence, type: e.target.value, daysOfWeek: [], interval: 1, unit: 'day' })
                }
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {recurrence.type === 'weekly' && (
              <div>
                <label className="block text-xs mb-1">Repeat on:</label>
                <div className="flex gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, idx) => (
                    <label key={d} className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={recurrence.daysOfWeek.includes(idx)}
                        onChange={() => {
                          const days = recurrence.daysOfWeek.includes(idx)
                            ? recurrence.daysOfWeek.filter(i => i !== idx)
                            : [...recurrence.daysOfWeek, idx];
                          setRecurrence({ ...recurrence, daysOfWeek: days });
                        }}
                      />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {recurrence.type === 'monthly' && (
              <div className="text-xs text-gray-600">
                Repeats on day {selectedDate ? Number(selectedDate.split('-')[2]) : ''}
              </div>
            )}
            {recurrence.type === 'custom' && (
              <div className="flex gap-2 items-center">
                <span className="text-xs">Every</span>
                <input
                  type="number"
                  min={1}
                  value={recurrence.interval}
                  onChange={e => setRecurrence({ ...recurrence, interval: Number(e.target.value) })}
                  className="w-14 border px-1 py-0.5 rounded text-xs"
                />
                <select
                  value={recurrence.unit}
                  onChange={e => setRecurrence({ ...recurrence, unit: e.target.value })}
                  className="border px-1 py-0.5 rounded text-xs"
                >
                  <option value="day">day(s)</option>
                  <option value="week">week(s)</option>
                  <option value="month">month(s)</option>
                </select>
              </div>
            )}
            {(recurrence.type !== 'none') && (
              <div>
                <label className="block text-xs mb-1">End date (optional)</label>
                <input
                  type="date"
                  value={recurrence.endDate}
                  onChange={e => setRecurrence({ ...recurrence, endDate: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              {editingIndex !== null ? 'Update Event' : 'Add Event'}
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
