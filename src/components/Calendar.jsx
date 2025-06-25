import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  format,
} from 'date-fns';

const Calendar = ({ events }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dateString = format(day, 'yyyy-MM-dd');
      const event = events.find(e => e.date === dateString);
      const isToday = isSameDay(day, today);
      const inMonth = isSameMonth(day, monthStart);

      days.push(
        <div
          key={day}
          className={`p-2 border rounded h-24 text-sm flex flex-col ${
            isToday ? 'bg-blue-100 font-bold' : inMonth ? 'bg-white' : 'bg-gray-200 text-gray-500'
          }`}
        >
          <span>{format(day, 'd')}</span>
          {event && <span className="mt-auto text-xs text-green-600">{event.title}</span>}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day} className="grid grid-cols-7 gap-2 mb-1">
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white p-4 rounded shadow w-3/4">
        <button>{`<`}</button>
        <button>Today</button>
        <button>{`>`}</button>
      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {weekDays.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      {rows}
    </div>
  );
};

export default Calendar;
