import React, { useState } from 'react';
import { TopMenu } from '../components/TopMenu/TopMenu';
import '../styles/CalendarPage.css';

const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

const TIME_SLOTS = [
  '08:00-\n09:00',
  '09:00-\n10:00',
  '10:00-\n11:00',
  '11:00-\n12:00',
  '12:00-\n13:00',
  '13:00-\n14:00',
  '15:00-\n16:00',
  '16:00-\n17:00',
  '17:00-\n18:00',
];

function getWeekDates(weekOffset: number) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=вс, 1=пн...
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + weekOffset * 7);

  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}.${mm}`;
  });
}

export function CalendarPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const dates = getWeekDates(weekOffset);

  return (
    <div className="calendar-container">
      <TopMenu />

      <div className="calendar-content">
        <div className="calendar-wrapper">

          {/* Навигация по неделям */}
          <div className="calendar-nav">
            <button
              className="calendar-nav-btn"
              onClick={() => setWeekOffset((w) => w - 1)}
            >
              ‹
            </button>
            <button
              className="calendar-nav-btn"
              onClick={() => setWeekOffset((w) => w + 1)}
            >
              ›
            </button>
          </div>

          {/* Таблица */}
          <div className="calendar-scroll">
            <table className="calendar-table">
              <thead>
                <tr>
                  {/* Пустая ячейка под время */}
                  <th className="calendar-th-time"></th>
                  {DAYS.map((day, i) => (
                    <th key={day} className="calendar-th-day">
                      <span className="calendar-day-name">{day}</span>
                      <span className="calendar-day-date">{dates[i]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot}>
                    <td className="calendar-td-time">
                      {slot.split('\n').map((line, i) => (
                        <span key={i} className="calendar-time-line">{line}</span>
                      ))}
                    </td>
                    {DAYS.map((day) => (
                      <td key={day} className="calendar-td-cell"></td>
                    ))}
                  </tr>
                ))}
                {/* Пустая строка внизу как в дизайне */}
                <tr>
                  <td className="calendar-td-time"></td>
                  {DAYS.map((day) => (
                    <td key={day} className="calendar-td-cell calendar-td-last"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
