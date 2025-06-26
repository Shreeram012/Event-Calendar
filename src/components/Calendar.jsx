import React, { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  format,
  parse,
  compareAsc,
} from 'date-fns';

const Calendar = ({ events, selectedDate, onDateClick }) => {
  const today = new Date();
  const [monthStart, setMonthStart] = useState(startOfMonth(today));

  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePrevMonth = () => {
    setMonthStart(prev => startOfMonth(addDays(prev, -1)));
  };

  const handleNextMonth = () => {
    setMonthStart(prev => startOfMonth(addDays(endOfMonth(prev), 1)));
  };

  const handleToday = () => {
    setMonthStart(startOfMonth(today));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const rows = [];
  let days = [];
  let currentDay = startDate;

  while (currentDay <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dateString = format(currentDay, 'yyyy-MM-dd');
      const isToday = isSameDay(currentDay, today);
      const inMonth = isSameMonth(currentDay, monthStart);
      const isSelected = selectedDate && isSameDay(currentDay, new Date(selectedDate));

      const dayEvents = events
        .filter(e => e.date === dateString)
        .sort((a, b) =>
          compareAsc(
            parse(a.time, 'HH:mm', new Date()),
            parse(b.time, 'HH:mm', new Date())
          )
        );

      days.push(
        <div
          key={dateString}
          onClick={() => onDateClick(dateString)}
          className={`cursor-pointer p-2 border rounded h-28 text-xs flex flex-col hover:bg-blue-50 overflow-hidden ${
            isSelected
              ? 'bg-yellow-200 border-yellow-500 font-semibold'
              : isToday
              ? 'bg-blue-100 font-bold'
              : inMonth
              ? 'bg-white'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          <span className="mb-1 text-sm">{format(currentDay, 'd')}</span>
          <div className="mt-auto space-y-0.5 overflow-y-auto text-[11px] max-h-20 pr-1">
            {dayEvents.slice(0, 3).map((event, i) => (
              <div key={i} className="text-green-800 truncate">
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-gray-400 text-[10px]">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      );

      currentDay = addDays(currentDay, 1);
    }

    rows.push(
      <div key={currentDay} className="grid grid-cols-7 gap-2 mb-1">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <button onClick={handlePrevMonth} className="px-2 py-1 border rounded">{`<`}</button>
          <h2 className="font-bold text-lg">{format(monthStart, 'MMMM yyyy')}</h2>
          <button onClick={handleNextMonth} className="px-2 py-1 border rounded">{`>`}</button>
        </div>
        <button onClick={handleToday} className="px-3 py-1 border rounded text-sm">Today</button>
      </div>

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
