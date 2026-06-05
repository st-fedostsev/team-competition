import { useState, useEffect, useRef, useCallback } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavLenta } from '../../../../components/Nav/NavEvents';
import { useNewsList } from '../../../../hooks/useNews';
import { TABS } from '../../../../constants';
import '../../../../styles/LentaPage.css';

const ITEMS_PER_PAGE = 1;

export function AnnouncementsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  
  const scrollPositionRef = useRef(0);
  const isRestoringScrollRef = useRef(false);
  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useNewsList(ITEMS_PER_PAGE, offset);

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

  const allNews = data?.result || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
      <div className="announcements-container">
        <HeaderStudent />
        <div className="announcements-content">
          <div className="loading">Загрузка новостей...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="announcements-container">
        <HeaderStudent />
        <div className="announcements-content">
          <div className="error">
            <p>Ошибка загрузки: {error?.message || 'Неизвестная ошибка'}</p>
            <button onClick={() => refetch()}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }

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
  
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPageInput(e.target.value);
    };

  return (
    <div className="announcements-container">
      <HeaderStudent />
      <div className="announcements-content">
        <div className="announcements-header">
          <NavLenta tabs={TABS} />
        </div>
        <div className="announcements-list">
          {allNews.length === 0 ? (
            <div className="empty-announcements">
              <p>Нет новостей</p>
            </div>
          ) : (
            allNews.map((news) => (
              <div key={news.id} className="announcements-card">
                <p className="announcements-card-title">{news.title}</p>
                <p className="announcements-card-description">{news.body}</p>
              </div>
            ))
          )}
        </div>

        {/* Пагинация */}
        {/* Пагинация */}
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
      </div>
    </div>
  );
}