import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderContentManager as TopMenu } from '../../../components/Header/HeaderContentManager';
import { CreateSletter } from '../../../components/Buttons';
import { SearchContentModal } from '../../../components/SearchContentModal';
import '../../../styles/ProfileContentManagerPage.css';
import { useCurrentUser } from '../../../hooks/useAuth';

interface NewsletterTarget {
  id: number;
  title: string;
  membersCount: number;
}

const NEWSLETTER_TARGETS: NewsletterTarget[] = [
  {
    id: 1,
    title: 'Название',
    membersCount: 3,
  },
  {
    id: 2,
    title: 'Название',
    membersCount: 3,
  },
  {
    id: 3,
    title: 'Название',
    membersCount: 3,
  },
];

export function ProfileContentManagerPage() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'select' | 'message'>('select');

  const [searchValue, setSearchValue] = useState('');
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);

  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [newsletterText, setNewsletterText] = useState('');

  const { data: user, isLoading, isError, error, refetch } = useCurrentUser();

  const filteredTargets = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return NEWSLETTER_TARGETS;
    }

    return NEWSLETTER_TARGETS.filter((target) =>
      target.title.toLowerCase().includes(normalizedSearch)
    );
  }, [searchValue]);

  const isAllSelected =
    filteredTargets.length > 0 &&
    filteredTargets.every((target) => selectedTargetIds.includes(target.id));

  const openModal = () => {
    setModalStep('select');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalStep('select');
    setSearchValue('');
    setSelectedTargetIds([]);
    setNewsletterTitle('');
    setNewsletterText('');
  };

  const toggleTarget = (targetId: number) => {
    setSelectedTargetIds((prev) =>
      prev.includes(targetId)
        ? prev.filter((id) => id !== targetId)
        : [...prev, targetId]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTargetIds((prev) =>
        prev.filter((id) => !filteredTargets.some((target) => target.id === id))
      );

      return;
    }

    const filteredIds = filteredTargets.map((target) => target.id);

    setSelectedTargetIds((prev) =>
      Array.from(new Set([...prev, ...filteredIds]))
    );
  };

  const handleNext = () => {
    if (selectedTargetIds.length === 0) {
      return;
    }

    setModalStep('message');
  };

  const handleSendNewsletter = () => {
    console.log('Рассылка:', {
      recipients: selectedTargetIds,
      title: newsletterTitle,
      text: newsletterText,
    });

    closeModal();
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <TopMenu />

        <div className="profile-content content-manager-profile-content">
          <div className="profile-card content-manager-profile-card">
            <div className="loading">Загрузка профиля...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="profile-container">
        <TopMenu />

        <div className="profile-content content-manager-profile-content">
          <div className="profile-card content-manager-profile-card">
            <div className="error">
              <p>Ошибка загрузки: {error?.message || 'Неизвестная ошибка'}</p>
              <button onClick={() => refetch()}>Повторить</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login-admin', { replace: true });
    return null;
  }

  return (
    <div className="profile-container">
      <TopMenu />

      <div className="profile-content content-manager-profile-content">
        <div className="profile-card content-manager-profile-card">
          <div className="profile-avatar content-manager-profile-avatar">
            <svg width="86" height="86" viewBox="0 0 86 86" fill="none">
              <defs>
                <clipPath id="contentManagerAvatarClip">
                  <circle cx="43" cy="43" r="40" />
                </clipPath>
              </defs>

              <g clipPath="url(#contentManagerAvatarClip)">
                <circle
                  cx="43"
                  cy="31"
                  r="12"
                  stroke="#3B3B3B"
                  strokeWidth="1.5"
                />

                <path
                  d="M15 75c0-16 12.5-28 28-28s28 12 28 28"
                  stroke="#3B3B3B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>

              <circle
                cx="43"
                cy="43"
                r="40"
                stroke="#3B3B3B"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          <div className="profile-info content-manager-profile-info">
            <p className="profile-name">
              {user.login || 'Логин?'}
            </p>

            <p className="profile-role">
              Роль: контент-менеджер
            </p>
          </div>
        </div>

        <div className="create-newsletter">
          <CreateSletter onClick={openModal} />
        </div>
      </div>

      {isModalOpen && modalStep === 'select' && (
        <SearchContentModal closeModal={closeModal}>
          <div className="newsletter-selection-search-wrapper">
            <input
              className="newsletter-selection-search-input"
              type="text"
              placeholder="Введите название"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />

            <span className="newsletter-selection-search-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="9"
                  cy="9"
                  r="6.5"
                  stroke="#333"
                  strokeWidth="1.5"
                />
                <path
                  d="M14 14L18 18"
                  stroke="#333"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>

          <div className="newsletter-selection-header">
            <label className="newsletter-selection-all">
              <span>Выбрать все</span>

              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              />
            </label>

            <div className="newsletter-selection-count">
              Выбрано: {selectedTargetIds.length}
            </div>
          </div>

          <div className="newsletter-selection-list">
            {filteredTargets.map((target) => {
              const isSelected = selectedTargetIds.includes(target.id);

              return (
                <div key={target.id} className="newsletter-selection-card">
                  <div className="newsletter-selection-card-left">
                    <div className="newsletter-selection-avatar">
                      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                        <circle
                          cx="26"
                          cy="20"
                          r="7"
                          stroke="#111"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M10 43c0-8.8 7.2-16 16-16s16 7.2 16 16"
                          stroke="#111"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="26"
                          cy="26"
                          r="24"
                          stroke="#111"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>

                    <div className="newsletter-selection-info">
                      <p className="newsletter-selection-title">
                        {target.title}
                      </p>

                      <p className="newsletter-selection-members">
                        {target.membersCount} участника
                      </p>
                    </div>
                  </div>

                  <button
                    className={`newsletter-selection-card-button ${
                      isSelected ? 'selected' : ''
                    }`}
                    type="button"
                    onClick={() => toggleTarget(target.id)}
                  >
                    {isSelected ? 'Отмена' : 'Выбрать'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="newsletter-selection-footer">
            <button
              className="newsletter-selection-cancel"
              type="button"
              onClick={closeModal}
            >
              Отмена
            </button>

            <button
              className="newsletter-selection-next"
              type="button"
              onClick={handleNext}
              disabled={selectedTargetIds.length === 0}
            >
              Далее
            </button>
          </div>
        </SearchContentModal>
      )}

      {isModalOpen && modalStep === 'message' && (
        <SearchContentModal closeModal={closeModal}>
          <div className="newsletter-message-body">
            <label className="newsletter-message-label">
              Введите заголовок
            </label>

            <input
              className="newsletter-message-input"
              type="text"
              value={newsletterTitle}
              onChange={(event) => setNewsletterTitle(event.target.value)}
            />

            <label className="newsletter-message-label">
              Введите текст рассылки
            </label>

            <textarea
              className="newsletter-message-textarea"
              value={newsletterText}
              onChange={(event) => setNewsletterText(event.target.value)}
            />

            <div className="newsletter-message-footer">
              <button
                className="newsletter-message-cancel"
                type="button"
                onClick={closeModal}
              >
                Отмена
              </button>

              <button
                className="newsletter-message-send"
                type="button"
                onClick={handleSendNewsletter}
              >
                Отправить
              </button>
            </div>
          </div>
        </SearchContentModal>
      )}
    </div>
  );
}