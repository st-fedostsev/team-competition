import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import type { FormEvent } from 'react';
import { HeaderContentManager } from '../../../../components/Header/HeaderContentManager';
import {
  NavContentManagerFeed,
  type ContentManagerFeedTab,
} from '../../../../components/Nav/NavNewsContentManager';
import {
  CreateNewsButton,
  CreateNewsCloseButton,
  CreateNewsCancelButton,
  CreateNewsSubmitButton,
} from '../../../../components/Buttons';
import { useNewsList, useCreateNews } from '../../../../hooks/useNews';
import { useChallengesList, useCreateChallenge } from '../../../../hooks/useChallenges';
import { useEventsList, useCreateEvent } from '../../../../hooks/useEvents';
import { FEED_TABS } from '../../../../constants';
import '../../../../styles/NewsContentManagerPage.css';


const ITEMS_PER_PAGE = 1;

interface FeedItem {
  id: string;
  type: 'news' | 'challenge' | 'event';
  title: string;
  description: string;
}

export function NewsContentManagerPage() {
  const [activeTab, setActiveTab] = useState<ContentManagerFeedTab>('/events');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  
  // Форма для новостей и челленджей
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formFormat, setFormFormat] = useState<'offline' | 'online'>('offline');
  const [formIsOfficial, setFormIsOfficial] = useState(false);
  
  // Форма для мероприятий
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventFormat, setEventFormat] = useState<'offline' | 'online'>('offline');
  
  const scrollPositionRef = useRef(0);
  const isRestoringScrollRef = useRef(false);
  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  // Получаем данные в зависимости от вкладки
  const { 
    data: newsData, 
    isLoading: isNewsLoading, 
    isError: isNewsError, 
    error: newsError,
    refetch: refetchNews
  } = useNewsList(activeTab === '/news' ? ITEMS_PER_PAGE : 1, activeTab === '/news' ? offset : 0);
  
  const { 
    data: challengesData, 
    isLoading: isChallengesLoading, 
    isError: isChallengesError, 
    error: challengesError,
    refetch: refetchChallenges
  } = useChallengesList(activeTab === '/challenges' ? ITEMS_PER_PAGE : 1, activeTab === '/challenges' ? offset : 0);
  
  const { 
    data: eventsData, 
    isLoading: isEventsLoading, 
    isError: isEventsError, 
    error: eventsError,
    refetch: refetchEvents
  } = useEventsList(activeTab === '/events' ? ITEMS_PER_PAGE : 1, activeTab === '/events' ? offset : 0);


  
  // Мутации для создания
  const { mutate: createNews, isPending: isCreatingNews } = useCreateNews();
  const { mutate: createChallenge, isPending: isCreatingChallenge } = useCreateChallenge();
  const { mutate: createEvent, isPending: isCreatingEvent } = useCreateEvent();

  const saveScrollPosition = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
  }, []);

  useEffect(() => {
    const isLoading = (activeTab === '/news' && isNewsLoading) ||
                      (activeTab === '/challenges' && isChallengesLoading) ||
                      (activeTab === '/events' && isEventsLoading);
    
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
  }, [isNewsLoading, isChallengesLoading, isEventsLoading, activeTab, currentPage]);

  // Данные для текущей вкладки
  const currentData = activeTab === '/news' ? newsData :
                      activeTab === '/challenges' ? challengesData :
                      eventsData;
  
  const currentItems = useMemo(() => {
  return currentData?.result || [];
}, [currentData]);

  const totalCount = currentData?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  
  const isLoading = (activeTab === '/news' && isNewsLoading) ||
                    (activeTab === '/challenges' && isChallengesLoading) ||
                    (activeTab === '/events' && isEventsLoading);
  
  const isError = (activeTab === '/news' && isNewsError) ||
                  (activeTab === '/challenges' && isChallengesError) ||
                  (activeTab === '/events' && isEventsError);
  
  const errorMessage = activeTab === '/news' ? newsError?.message :
                       activeTab === '/challenges' ? challengesError?.message :
                       eventsError?.message || 'Неизвестная ошибка';

  // Формируем ленту
  const feedItems = useMemo<FeedItem[]>(() => {
    if (activeTab === '/news') {
      return currentItems.map((item: any) => ({
        id: `news-${item.id}`,
        type: 'news',
        title: item.title,
        description: item.body,
      }));
    }
    if (activeTab === '/challenges') {
      return currentItems.map((item: any) => ({
        id: `challenge-${item.id}`,
        type: 'challenge',
        title: item.title,
        description: item.description,
      }));
    }
    if (activeTab === '/events') {
      return currentItems.map((item: any) => ({
        id: `event-${item.id}`,
        type: 'event',
        title: item.title,
        description: item.description,
      }));
    }
    return [];
  }, [activeTab, currentItems]);

  const createButtonLabel = useMemo(() => {
    if (activeTab === '/news') return 'Создать новость';
    if (activeTab === '/challenges') return 'Создать челлендж';
    if (activeTab === '/events') return 'Создать мероприятие';
    return 'Создать';
  }, [activeTab]);

  const createModalTitle = useMemo(() => {
    if (activeTab === '/news') return 'Создание новости';
    if (activeTab === '/challenges') return 'Создание челленджа';
    if (activeTab === '/events') return 'Создание мероприятия';
    return 'Создание';
  }, [activeTab]);

  const handleOpenCreateModal = () => {
    // Сбрасываем все поля
    setFormTitle('');
    setFormDescription('');
    setFormDate('');
    setFormFormat('offline');
    setFormIsOfficial(false);
    setEventTitle('');
    setEventDescription('');
    setEventDate('');
    setEventFormat('offline');
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Обработчик для новостей
  const handleCreateNews = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    createNews(
      { title: formTitle.trim(), body: formDescription.trim() },
      { onSuccess: () => { handleCloseCreateModal(); refetchNews(); } }
    );
  };

  // Обработчик для челленджей
  const handleCreateChallenge = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    createChallenge(
      { 
        title: formTitle.trim(), 
        description: formDescription.trim(),
        deadline: formDate,
        points: 0
      },
      { onSuccess: () => { handleCloseCreateModal(); refetchChallenges(); } }
    );
  };

  // Обработчик для мероприятия
  const handleCreateEvent = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDescription.trim() || !eventDate) return;

    createEvent(
      {
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        date: eventDate,
        format: eventFormat,
        is_official: false
      },
      { 
        onSuccess: () => { 
          handleCloseCreateModal(); 
          refetchEvents(); 
        } 
      }
    );
  };

  const handleTabChange = (tab: string) => {
    saveScrollPosition();
    setActiveTab(tab as ContentManagerFeedTab);
    setCurrentPage(1);
    setPageInput('');
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      saveScrollPosition();
      setCurrentPage(prev => prev + 1);
      setPageInput('');
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      saveScrollPosition();
      setCurrentPage(prev => prev - 1);
      setPageInput('');
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const pageNumber = parseInt(pageInput);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        saveScrollPosition();
        setCurrentPage(pageNumber);
        setPageInput('');
      } else {
        alert(`Введите число от 1 до ${totalPages}`);
      }
    }
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="cm-news-page">
        <HeaderContentManager />
        <main className="cm-news-content">
          <div className="cm-news-state">Загрузка ленты...</div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cm-news-page">
        <HeaderContentManager />
        <main className="cm-news-content">
          <div className="cm-news-state">
            <p>Ошибка загрузки: {errorMessage}</p>
            <button type="button" onClick={() => window.location.reload()}>Повторить</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cm-news-page">
      <HeaderContentManager />

      <main className="cm-news-content">
        <div className="cm-news-header">
          <NavContentManagerFeed
            tabs={FEED_TABS}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
          <CreateNewsButton label={createButtonLabel} onClick={handleOpenCreateModal} />
        </div>

        <div className="cm-news-list">
          {feedItems.length === 0 ? (
            <div className="cm-news-empty">Нет публикаций</div>
          ) : (
            feedItems.map((item) => (
              <article key={item.id} className="cm-news-card">
                <p className="cm-news-card-title">{item.title}</p>
                <p className="cm-news-card-description">{item.description}</p>
              </article>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="users-pagination">
            <button
              className="pagination-btn"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              ‹
            </button>

            <div className="pagination-page-input-wrapper">
              <input
                type="number"
                className="pagination-page-input"
                value={pageInput}
                onChange={handlePageInputChange}
                onKeyDown={handlePageInputKeyDown}
                placeholder={`${currentPage}`}
                min={1}
                max={totalPages}
              />

              <span className="pagination-total">
                {' '}
                / {totalPages}
              </span>
            </div>

            <button
              className="pagination-btn"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </main>

      {/* Модалка создания для новостей */}
      {isCreateModalOpen && activeTab === '/news' && (
        <div className="cm-create-news-overlay" onClick={handleCloseCreateModal}>
          <div className="cm-create-news-modal" onClick={(e) => e.stopPropagation()}>
            <CreateNewsCloseButton onClick={handleCloseCreateModal} />
            <h2 className="cm-create-news-title">{createModalTitle}</h2>
            <form className="cm-create-news-form" onSubmit={handleCreateNews}>
              <input
                className="cm-create-news-input"
                type="text"
                placeholder="Введите название"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
              <textarea
                className="cm-create-news-textarea"
                placeholder="Введите описание"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
              <div className="cm-create-news-actions">
                <CreateNewsCancelButton onClick={handleCloseCreateModal} />
                <CreateNewsSubmitButton disabled={isCreatingNews} />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модалка создания для челленджей */}
      {isCreateModalOpen && activeTab === '/challenges' && (
        <div className="cm-create-news-overlay" onClick={handleCloseCreateModal}>
          <div className="cm-create-news-modal" onClick={(e) => e.stopPropagation()}>
            <CreateNewsCloseButton onClick={handleCloseCreateModal} />
            <h2 className="cm-create-news-title">{createModalTitle}</h2>
            <form className="cm-create-news-form" onSubmit={handleCreateChallenge}>
              <input
                className="cm-create-news-input"
                type="text"
                placeholder="Введите название"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
              <textarea
                className="cm-create-news-textarea"
                placeholder="Введите описание"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
              <input
                type="datetime-local"
                className="cm-create-news-input"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
              <div className="cm-create-news-actions">
                <CreateNewsCancelButton onClick={handleCloseCreateModal} />
                <CreateNewsSubmitButton disabled={isCreatingChallenge} />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модалка создания для мероприятий */}
      {isCreateModalOpen && activeTab === '/events' && (
        <div className="modal-overlay" onClick={handleCloseCreateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Создание мероприятия</h2>
            <form onSubmit={handleCreateEvent}>
              <input
                type="text"
                placeholder="Название мероприятия"
                className="modal-input"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Описание мероприятия"
                className="modal-textarea"
                rows={4}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
              />
              <input
                type="datetime-local"
                className="modal-input"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
              <select
                className="modal-select"
                value={eventFormat}
                onChange={(e) => setEventFormat(e.target.value as 'offline' | 'online')}
              >
                <option value="offline">Офлайн</option>
                <option value="online">Онлайн</option>
              </select>
              <label className="modal-checkbox">
                {/* Чекбокс закомментирован, как в вашем примере */}
              </label>
              <div className="modal-buttons">
                <button type="button" onClick={handleCloseCreateModal} className="cancel-button">Отмена</button>
                <button type="submit" disabled={isCreatingEvent} className="create-button">
                  {isCreatingEvent ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}