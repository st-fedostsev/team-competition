import { useMemo, useState } from 'react';
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
import { useChallengesList } from '../../../../hooks/useChallenges';
import { FEED_TABS } from '../../../../constants';
import '../../../../styles/NewsContentManagerPage.css';

interface FeedItem {
  id: string;
  type: 'news' | 'challenge';
  title: string;
  description: string;
}

export function NewsContentManagerPage() {
  const [activeTab, setActiveTab] = useState<ContentManagerFeedTab>('/all');
  const [isCreateNewsOpen, setIsCreateNewsOpen] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsBody, setNewsBody] = useState('');

  const {
    data: newsData,
    isLoading: isNewsLoading,
    isError: isNewsError,
    error: newsError,
  } = useNewsList();

  const {
    data: challengesData,
    isLoading: isChallengesLoading,
    isError: isChallengesError,
    error: challengesError,
  } = useChallengesList();

  const { mutate: createNews, isPending: isCreatingNews } = useCreateNews();

  const newsItems = newsData?.pages.flatMap((page) => page.news) || [];
  const challengeItems =
    challengesData?.pages.flatMap((page) => page.challenges) || [];

  const feedItems = useMemo<FeedItem[]>(() => {
    const mappedNews: FeedItem[] = newsItems.map((news) => ({
      id: `news-${news.id}`,
      type: 'news',
      title: news.title,
      description: news.body,
    }));

    const mappedChallenges: FeedItem[] = challengeItems.map((challenge) => ({
      id: `challenge-${challenge.id}`,
      type: 'challenge',
      title: challenge.title,
      description: challenge.description,
    }));

    return [...mappedNews, ...mappedChallenges];
  }, [newsItems, challengeItems]);

  const filteredFeedItems = useMemo(() => {
    if (activeTab === '/news') {
      return feedItems.filter((item) => item.type === 'news');
    }

    if (activeTab === '/challenges') {
      return feedItems.filter((item) => item.type === 'challenge');
    }

    return feedItems;
  }, [activeTab, feedItems]);

  const handleOpenCreateNewsModal = () => {
    setIsCreateNewsOpen(true);
  };

  const handleCloseCreateNewsModal = () => {
    setIsCreateNewsOpen(false);
    setNewsTitle('');
    setNewsBody('');
  };

  const handleCreateNews = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newsTitle.trim() || !newsBody.trim()) {
      return;
    }

    createNews(
      {
        title: newsTitle.trim(),
        body: newsBody.trim(),
      },
      {
        onSuccess: () => {
          handleCloseCreateNewsModal();
        },
      }
    );
  };

  const isLoading = isNewsLoading || isChallengesLoading;
  const isError = isNewsError || isChallengesError;
  const errorMessage =
    newsError?.message || challengesError?.message || 'Неизвестная ошибка';

  if (isLoading) {
    return (
      <div className="cm-news-page">
        <HeaderContentManager />

        <main className="cm-news-content">
          <div className="cm-news-state">
            Загрузка ленты...
          </div>
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

            <button type="button" onClick={() => window.location.reload()}>
              Повторить
            </button>
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
            onChange={setActiveTab}
          />

          <CreateNewsButton onClick={handleOpenCreateNewsModal} />
        </div>

        <div className="cm-news-list">
          {filteredFeedItems.length === 0 ? (
            <div className="cm-news-empty">
              Нет публикаций
            </div>
          ) : (
            filteredFeedItems.map((item) => (
              <article key={item.id} className="cm-news-card">
                <p className="cm-news-card-title">
                  {item.title}
                </p>

                <p className="cm-news-card-description">
                  {item.description}
                </p>
              </article>
            ))
          )}
        </div>
      </main>

      {isCreateNewsOpen && (
        <div
          className="cm-create-news-overlay"
          onClick={handleCloseCreateNewsModal}
        >
          <div
            className="cm-create-news-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <CreateNewsCloseButton onClick={handleCloseCreateNewsModal} />

            <h2 className="cm-create-news-title">
              Создание новости
            </h2>

            <form
              className="cm-create-news-form"
              onSubmit={handleCreateNews}
            >
              <input
                className="cm-create-news-input"
                type="text"
                placeholder="Введите название"
                value={newsTitle}
                onChange={(event) => setNewsTitle(event.target.value)}
              />

              <textarea
                className="cm-create-news-textarea"
                placeholder="Введите описание"
                value={newsBody}
                onChange={(event) => setNewsBody(event.target.value)}
              />

              <div className="cm-create-news-actions">
                <CreateNewsCancelButton onClick={handleCloseCreateNewsModal} />

                <CreateNewsSubmitButton disabled={isCreatingNews} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}