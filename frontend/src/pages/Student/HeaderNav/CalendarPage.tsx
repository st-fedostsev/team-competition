import { useState } from 'react';
import { HeaderStudent } from '../../../components/Header/HeaderStudent';
import { useAllEvents } from '../../../hooks/useEvents';
import { Modal } from '../../../components/ModalWindowComponent';
import '../../../styles/CalendarPage.css';
import { DAYS, TIME_SLOTS } from '../../../constants';

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  hour: number;
  format: string;
  is_official: boolean;
}

function getWeekDates(weekOffset: number) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + weekOffset * 7);

  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return { dateStr: `${dd}.${mm}`, fullDate: `${yyyy}-${mm}-${dd}`, dateObj: d };
  });
}

const getHourFromSlot = (slot: string) => {
  return parseInt(slot.split(':')[0]);
};

export function CalendarPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<EventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Используем хук для получения всех событий
  const { data: allEvents, isLoading, isError, error, refetch } = useAllEvents();

  // Группируем события по датам и часам
  const eventsByDateAndHour: Record<string, Record<number, EventItem[]>> = {};

  if (allEvents) {
    allEvents.forEach((event) => {
      const eventDate = new Date(event.date);
      const dateKey = eventDate.toISOString().split('T')[0];
      const hour = eventDate.getHours();
      const time = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (!eventsByDateAndHour[dateKey]) {
        eventsByDateAndHour[dateKey] = {};
      }
      if (!eventsByDateAndHour[dateKey][hour]) {
        eventsByDateAndHour[dateKey][hour] = [];
      }
      eventsByDateAndHour[dateKey][hour].push({
        ...event,
        time,
        hour,
      });
    });
  }

  const weekDates = getWeekDates(weekOffset);

  const getEventsAtSlot = (fullDate: string, hour: number) => {
    return eventsByDateAndHour[fullDate]?.[hour] || [];
  };

  const handleSlotClick = (fullDate: string, dateStr: string, slotHour: number, slotLabel: string) => {
    const events = getEventsAtSlot(fullDate, slotHour);
    if (events.length > 0) {
      setSelectedDate(dateStr);
      setSelectedTimeSlot(slotLabel);
      setSelectedEvents(events);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setSelectedEvents([]);
  };

  if (isLoading) {
    return (
      <div className="calendar-container">
        <HeaderStudent />
        <div className="calendar-content">
          <div className="loading">Загрузка календаря...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="calendar-container">
        <HeaderStudent />
        <div className="calendar-content">
          <div className="error">
            <p>Ошибка загрузки: {error?.message || 'Неизвестная ошибка'}</p>
            <button onClick={() => refetch()}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }

  const getModalTitle = () => {
  if (!selectedDate) return 'Мероприятия';
  if (!selectedTimeSlot) return `Мероприятия на ${selectedDate}`;
  const [startRaw, end] = selectedTimeSlot.split('\n');
  const start = startRaw.replace('-', ''); // убираем дефис
  return `Мероприятия на ${selectedDate} (${start} - ${end})`;
};

  return (
    <div className="calendar-container">
      <HeaderStudent />

      <div className="calendar-content">
        <div className="calendar-wrapper">
          <div className="calendar-nav">
            <button className="calendar-nav-btn" onClick={() => setWeekOffset((w) => w - 1)}>‹</button>
            <button className="calendar-nav-btn" onClick={() => setWeekOffset((w) => w + 1)}>›</button>
          </div>

          <div className="calendar-scroll">
            <table className="calendar-table">
              <thead>
                <tr>
                  <th className="calendar-th-time"></th>
                  {DAYS.map((day, i) => (
                    <th key={day} className="calendar-th-day">
                      <span className="calendar-day-name">{day}</span>
                      <span className="calendar-day-date">{weekDates[i].dateStr}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => {
                  const slotHour = getHourFromSlot(slot);
                  return (
                    <tr key={slot}>
                      <td className="calendar-td-time">
                        {slot.split('\n').map((line, i) => (
                          <span key={i} className="calendar-time-line">{line}</span>
                        ))}
                      </td>
                      {DAYS.map((day, dayIndex) => {
                        const fullDate = weekDates[dayIndex].fullDate;
                        const eventsInSlot = getEventsAtSlot(fullDate, slotHour);
                        const hasEvents = eventsInSlot.length > 0;
                        return (
                          <td 
                            key={day} 
                            className={`calendar-td-cell ${hasEvents ? 'has-events' : ''}`}
                            onClick={() => hasEvents && handleSlotClick(fullDate, weekDates[dayIndex].dateStr, slotHour, slot)}
                          >
                            {hasEvents && (
                              <div className="event-in-cell">
                                <div className="event-titles">
                                  {eventsInSlot.slice(0, 2).map((event) => (
                                    <div key={event.id} className="event-title-cell">
                                      {event.title}
                                    </div>
                                  ))}
                                  {eventsInSlot.length > 2 && (
                                    <div className="event-more">+{eventsInSlot.length - 2}</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal closeModal={closeModal}>
          <div className="calendar-modal-body">
          <h2>{getModalTitle()}</h2>
            <div className="calendar-events-list">
              {selectedEvents.length === 0 ? (
                <p className="no-events">Нет мероприятий</p>
              ) : (
                selectedEvents.map((event) => (
                  <div key={event.id} className="calendar-event-card">
                    <div className="calendar-event-time">
                      <span className="time-icon">🕐</span>
                      {event.time}
                    </div>
                    <div className="calendar-event-info">
                      <p className="calendar-event-title">{event.title}</p>
                      <p className="calendar-event-description">{event.description}</p>
                      <div className="calendar-event-tags">
                        {event.is_official && <span className="official-tag">Официальное</span>}
                        <span className="format-tag">{event.format === 'offline' ? '📍 Офлайн' : '💻 Онлайн'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}