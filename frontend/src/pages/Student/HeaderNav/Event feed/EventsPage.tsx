import React, { useState } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavLenta } from '../../../../components/Nav/NavEvents';
import { CreateEventButton } from '../../../../components/Buttons';
import { useEventsList, useCreateEvent } from '../../../../hooks/useEvents';
import { useCurrentUser } from '../../../../hooks/useAuth';
import '../../../../styles/LentaPage.css';
import { TABS } from '../../../../constants';


// Модальное окно создания мероприятия
function CreateEventModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user } = useCurrentUser();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useEventsList();

  const canCreateEvent = !!user;

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
            <button onClick={() => window.location.reload()}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }

  const allEvents = data?.pages?.flatMap(page => page?.events || []) || [];

  return (
    <div className="lenta-container">
      <HeaderStudent />

      <div className="lenta-content">
        <div className="lenta-header">
          <NavLenta 
            tabs = {TABS}
          />
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

        {hasNextPage && (
          <div className="load-more-container">
            <button 
              className="load-more-button" 
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Загрузка...' : 'Загрузить ещё 5'}
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