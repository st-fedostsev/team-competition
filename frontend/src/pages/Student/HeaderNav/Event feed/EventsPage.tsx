import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavLenta } from '../../../../components/Nav/NavEvents';
import { CreateEventButton } from '../../../../components/Buttons';
import { useEventsList, useCreateEvent } from '../../../../hooks/useEvents';
import { useCurrentUser } from '../../../../hooks/useAuth';
import '../../../../styles/LentaPage.css';
import { TABS } from '../../../../constants';

const ITEMS_PER_PAGE = 1;

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [format, setFormat] = useState<'offline' | 'online'>('offline');
  const [isOfficial, setIsOfficial] = useState(false);
  const { mutate: createEvent, isPending } = useCreateEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent(
      { title, description, date, format, is_official: isOfficial },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
          setTitle('');
          setDescription('');
          setDate('');
          setFormat('offline');
          setIsOfficial(false);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Создание мероприятия</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Название мероприятия"
            className="modal-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Описание мероприятия"
            className="modal-textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="modal-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <select
            className="modal-select"
            value={format}
            onChange={(e) => setFormat(e.target.value as 'offline' | 'online')}
          >
            <option value="offline">Офлайн</option>
            <option value="online">Онлайн</option>
          </select>
          <label className="modal-checkbox">
            {/* <input
              type="checkbox"
              checked={isOfficial}
              onChange={(e) => setIsOfficial(e.target.checked)}
            />
            Официальное мероприятие */}
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">Отмена</button>
            <button type="submit" disabled={isPending} className="create-button">
              {isPending ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LentaPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: user } = useCurrentUser();
  
  const scrollPositionRef = useRef(0);
  const isRestoringScrollRef = useRef(false);
  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch
  } = useEventsList(ITEMS_PER_PAGE, offset);

  const saveScrollPosition = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
  }, []);

  useEffect(() => {
    if (!isLoading && scrollPositionRef.current > 0 && !isRestoringScrollRef.current) {
      isRestoringScrollRef.current = true;
      const restoreScroll = () => {
        window.scrollTo(0, scrollPositionRef.current);
      };
      restoreScroll();
      setTimeout(restoreScroll, 50);
      setTimeout(restoreScroll, 100);
      setTimeout(() => {
        isRestoringScrollRef.current = false;
      }, 150);
    }
  }, [isLoading, currentPage]);

  // Все мероприятия из текущей страницы
  const allEvents = data?.events || [];
  const totalCount = data?.total || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const canCreateEvent = !!user;

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      saveScrollPosition();
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      saveScrollPosition();
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="lenta-container">
        <HeaderStudent />
        <div className="lenta-content">
          <div className="loading">Загрузка мероприятий...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="lenta-container">
        <HeaderStudent />
        <div className="lenta-content">
          <div className="error">
            <p>Ошибка загрузки: {error?.message || 'Неизвестная ошибка'}</p>
            <button onClick={() => refetch()}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lenta-container">
      <HeaderStudent />

      <div className="lenta-content">
        <div className="lenta-header">
          <NavLenta tabs={TABS} />
          {canCreateEvent && (
            <CreateEventButton onClick={() => setIsModalOpen(true)} />
          )}
        </div>

        <div className="lenta-list">
          {allEvents.length === 0 ? (
            <div className="empty-events">
              <p>Нет мероприятий</p>
            </div>
          ) : (
            allEvents.map((event) => (
              event && (
                <div key={event.id} className="lenta-card">
                  <p className="lenta-card-title">{event.title}</p>
                  <p className="lenta-card-description">{event.description}</p>
                </div>
              )
            ))
          )}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="lenta-pagination">
            <button
              className="pagination-nav-btn"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            <span className="pagination-counter">
              {currentPage} / {totalPages}
            </span>
            
            <button
              className="pagination-nav-btn"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </div>
  );
}