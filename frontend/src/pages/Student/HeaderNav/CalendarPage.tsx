import { useState, useEffect } from 'react';
import { HeaderStudent } from '../../../components/Header/HeaderStudent';
import { useCalendarEvents } from '../../../hooks/useEvents';
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

    return {
      dateStr: `${dd}.${mm}`,
      fullDate: `${yyyy}-${mm}-${dd}`,
      dateObj: d,
    };
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
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<number[]>([]);

  // Получаем даты текущей недели
  const weekDates = getWeekDates(weekOffset);
  
  // Получаем start_date (понедельник) и end_date (воскресенье) для API
  const startDate = weekDates[0]?.fullDate || null;
  const endDate = weekDates[6]?.fullDate || null;
  
  // Используем хук для получения мероприятий в диапазоне дат
  const { data: eventsInRange, isLoading, isError, error, refetch } = useCalendarEvents(startDate, endDate);

  // Группируем мероприятия по датам и часам
  const eventsByDateAndHour: Record<string, Record<number, EventItem[]>> = {};

  if (eventsInRange && Array.isArray(eventsInRange)) {
    eventsInRange.forEach((event) => {
      // Парсим дату из API (предполагаем формат ISO или уже готовую дату)
      const eventDate: Date = new Date(event.date);
      
      const dateKey = eventDate.toISOString().split('T')[0];
      const hour = eventDate.getHours();
      const time = eventDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

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
      } as EventItem);
    });
  }

  const DESCRIPTION_LIMIT = 248;
  const currentEvent = selectedEvents[currentEventIndex];

  const getEventsAtSlot = (fullDate: string, hour: number) => {
    return eventsByDateAndHour[fullDate]?.[hour] || [];
  };

  const handleSlotClick = (
    fullDate: string,
    dateStr: string,
    slotHour: number,
    slotLabel: string
  ) => {
    const events = getEventsAtSlot(fullDate, slotHour);

    if (events.length > 0) {
      setSelectedDate(dateStr);
      setSelectedTimeSlot(slotLabel);
      setSelectedEvents(events);
      setCurrentEventIndex(0);
      setExpandedDescriptions([]);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setSelectedEvents([]);
    setCurrentEventIndex(0);
    setExpandedDescriptions([]);
  };

  const goToNextEvent = () => {
    setExpandedDescriptions([]);
    setCurrentEventIndex((prevIndex) =>
      prevIndex === selectedEvents.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevEvent = () => {
    setExpandedDescriptions([]);
    setCurrentEventIndex((prevIndex) =>
      prevIndex === 0 ? selectedEvents.length - 1 : prevIndex - 1
    );
  };

  const toggleDescription = (eventId: number) => {
    setExpandedDescriptions((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const isDescriptionExpanded = (eventId: number) => {
    return expandedDescriptions.includes(eventId);
  };

  const getDescriptionText = (event: EventItem) => {
    const description = event.description || '';
    const isExpanded = isDescriptionExpanded(event.id);

    if (isExpanded || description.length <= DESCRIPTION_LIMIT) {
      return description;
    }

    return `${description.slice(0, DESCRIPTION_LIMIT)}...`;
  };

  const getModalTitle = () => {
    if (!selectedDate) return 'Мероприятия';
    if (!selectedTimeSlot) return `Мероприятия на ${selectedDate}`;

    return `Мероприятия на ${selectedDate}`;
  };

  // При изменении недели обновляем данные
  useEffect(() => {
    if (startDate && endDate) {
      refetch();
    }
  }, [weekOffset, startDate, endDate, refetch]);

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

  return (
    <div className="calendar-container">
      <HeaderStudent />

      <div className="calendar-content">
        <div className="calendar-wrapper">
          <div className="calendar-nav">
            <button
              className="calendar-nav-btn"
              onClick={() => setWeekOffset((w) => w - 1)}
            >
              ‹
            </button>

            <span className="calendar-week-range">
              {weekDates[0]?.dateStr} - {weekDates[6]?.dateStr}
            </span>

            <button
              className="calendar-nav-btn"
              onClick={() => setWeekOffset((w) => w + 1)}
            >
              ›
            </button>
          </div>

          <div className="calendar-scroll">
            <table className="calendar-table">
              <thead>
                <tr>
                  <th className="calendar-th-time"></th>

                  {DAYS.map((day, i) => (
                    <th key={day} className="calendar-th-day">
                      <span className="calendar-day-name">{day}</span>
                      <span className="calendar-day-date">
                        {weekDates[i].dateStr}
                      </span>
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
                          <span key={i} className="calendar-time-line">
                            {line}
                          </span>
                        ))}
                      </td>

                      {DAYS.map((day, dayIndex) => {
                        const fullDate = weekDates[dayIndex].fullDate;
                        const eventsInSlot = getEventsAtSlot(fullDate, slotHour);
                        const hasEvents = eventsInSlot.length > 0;

                        return (
                          <td
                            key={day}
                            className={`calendar-td-cell ${
                              hasEvents ? 'has-events' : ''
                            }`}
                            onClick={() =>
                              hasEvents &&
                              handleSlotClick(
                                fullDate,
                                weekDates[dayIndex].dateStr,
                                slotHour,
                                slot
                              )
                            }
                          >
                            {hasEvents && (
                              <div className="event-in-cell">
                                <div className="event-titles">
                                  {eventsInSlot.slice(0, 2).map((event) => (
                                    <div
                                      key={event.id}
                                      className="event-title-cell"
                                    >
                                      {event.title}
                                    </div>
                                  ))}

                                  {eventsInSlot.length > 2 && (
                                    <div className="event-more">
                                      +{eventsInSlot.length - 2}
                                    </div>
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
            <div className="calendar-modal-header">
              <h2>{getModalTitle()}</h2>
              <p>Список мероприятий на выбранное время</p>
            </div>

            {selectedEvents.length === 0 || !currentEvent ? (
              <div className="calendar-empty-events">
                Нет мероприятий
              </div>
            ) : (
              <>
                <div className="calendar-event-card calendar-event-card-single">
                  <div className="calendar-event-top">
                    <div className="calendar-event-time">
                      {currentEvent.time}
                    </div>

                    <h3 className="calendar-event-title">
                      {currentEvent.title}
                    </h3>
                  </div>

                  <div
                    className={`calendar-event-description ${
                      isDescriptionExpanded(currentEvent.id) ? 'expanded' : ''
                    }`}
                  >
                    <div className="calendar-event-description-text">
                      {getDescriptionText(currentEvent)}
                    </div>

                    {(currentEvent.description || '').length > DESCRIPTION_LIMIT && (
                      <button
                        className="calendar-description-more"
                        type="button"
                        onClick={() => toggleDescription(currentEvent.id)}
                      >
                        {isDescriptionExpanded(currentEvent.id)
                          ? 'Скрыть'
                          : 'Подробнее...'}
                      </button>
                    )}
                  </div>

                  <div className="calendar-event-tags">
                    {currentEvent.is_official && (
                      <span className="calendar-event-tag official">
                        Официальное
                      </span>
                    )}

                    <span className="calendar-event-tag format">
                      {currentEvent.format === 'offline'
                        ? 'Офлайн'
                        : 'Онлайн'}
                    </span>
                  </div>
                </div>

                {selectedEvents.length > 1 && (
                  <div className="calendar-event-navigation">
                    <button
                      className="calendar-event-nav-button"
                      type="button"
                      onClick={goToPrevEvent}
                    >
                      ‹
                    </button>

                    <span className="calendar-event-counter">
                      {currentEventIndex + 1} / {selectedEvents.length}
                    </span>

                    <button
                      className="calendar-event-nav-button"
                      type="button"
                      onClick={goToNextEvent}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}