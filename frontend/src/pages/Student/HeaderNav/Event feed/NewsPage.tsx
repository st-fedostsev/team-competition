import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavLenta } from '../../../../components/Nav/NavEvents';
import { useNewsList } from '../../../../hooks/useNews';
import '../../../../styles/LentaPage.css';
import { TABS } from '../../../../constants';

export function AnnouncementsPage() {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useNewsList();

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
            <button onClick={() => window.location.reload()}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }

  const allNews = data?.pages.flatMap(page => page.news) || [];

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
    </div>
  );
}
