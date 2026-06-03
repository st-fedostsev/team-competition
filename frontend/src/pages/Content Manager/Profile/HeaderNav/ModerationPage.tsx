import { useMemo, useState } from 'react';
import { HeaderContentManager } from '../../../../components/Header/HeaderContentManager';
import { NavContentManagerModeration } from '../../../../components/Nav/NavNewsContentManager';
import { Modal } from '../../../../components/ModalWindowComponent';
import {
  DetailsButton,
  ModerationDeleteButton,
  ModerationPublishButton,
  EventDeleteButton,
  ReportRejectButton,
  ReportAcceptButton,
  EventDeleteCancelButton,
  EventDeleteConfirmButton,
} from '../../../../components/Buttons';
import { MODERATION_TABS } from '../../../../constants';
import '../../../../styles/NewsContentManagerPage.css';
import '../../../../styles/ModerationContentManagerPage.css';

interface ModerationItem {
  id: number;
  type: string;
  title: string;
  team?: string;
  date?: string;
  description?: string;
  marketType?: string;
}

const MODERATION_ITEMS: ModerationItem[] = [
  {
    id: 1,
    type: '/reports',
    title: 'Название чего-то',
    team: 'Команда',
    date: '01.01.2026',
  },
  {
    id: 2,
    type: '/reports',
    title: 'Название чего-то',
    team: 'Команда',
    date: '01.01.2026',
  },
  {
    id: 3,
    type: '/market',
    title: 'Название объявления',
    description: 'Описание',
    marketType: 'Тип',
  },
  {
    id: 4,
    type: '/events',
    title: 'Название мероприятия',
    description: 'Описание',
  },
  {
    id: 5,
    type: '/events',
    title: 'Название мероприятия',
    description: 'Описание',
  },
];

export function ModerationPage() {
  const [activeTab, setActiveTab] = useState(MODERATION_TABS[0].value);
  const [selectedReport, setSelectedReport] = useState<ModerationItem | null>(null);
  const [eventForDelete, setEventForDelete] = useState<ModerationItem | null>(null);
  const [deleteComment, setDeleteComment] = useState('');

  const filteredItems = useMemo(() => {
    return MODERATION_ITEMS.filter((item) => item.type === activeTab);
  }, [activeTab]);

  const closeReportModal = () => {
    setSelectedReport(null);
  };

  const closeDeleteEventModal = () => {
    setEventForDelete(null);
    setDeleteComment('');
  };

  const handleReportReject = () => {
    console.log('Отклонить отчет:', selectedReport);
    closeReportModal();
  };

  const handleReportAccept = () => {
    console.log('Принять отчет:', selectedReport);
    closeReportModal();
  };

  const handleDeleteMarketItem = (item: ModerationItem) => {
    console.log('Удалить объявление:', item);
  };

  const handlePublishMarketItem = (item: ModerationItem) => {
    console.log('Опубликовать объявление:', item);
  };

  const handleDeleteEvent = () => {
    console.log('Удалить мероприятие:', {
      event: eventForDelete,
      comment: deleteComment,
    });

    closeDeleteEventModal();
  };

  return (
    <div className="cm-moderation-page">
      <HeaderContentManager />

      <main className="cm-moderation-content">
        <div className="cm-moderation-header">
          <NavContentManagerModeration
            tabs={MODERATION_TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="cm-moderation-list">
          {filteredItems.length === 0 ? (
            <div className="cm-moderation-empty">
              Нет данных для модерации
            </div>
          ) : (
            filteredItems.map((item) => {
              if (item.type === '/market') {
                return (
                  <article key={item.id} className="cm-moderation-market-card">
                    <div className="cm-moderation-market-top">
                      <div className="cm-moderation-market-info">
                        <p className="cm-moderation-market-title">
                          {item.title}
                        </p>

                        <p className="cm-moderation-market-description">
                          {item.description}
                        </p>
                      </div>

                      <span className="cm-moderation-market-type">
                        {item.marketType}
                      </span>
                    </div>

                    <div className="cm-moderation-market-actions">
                      <ModerationDeleteButton
                        onClick={() => handleDeleteMarketItem(item)}
                      />

                      <ModerationPublishButton
                        onClick={() => handlePublishMarketItem(item)}
                      />
                    </div>
                  </article>
                );
              }

              if (item.type === '/events') {
                return (
                  <article key={item.id} className="cm-moderation-event-card">
                    <div className="cm-moderation-event-info">
                      <p className="cm-moderation-event-title">
                        {item.title}
                      </p>

                      <p className="cm-moderation-event-description">
                        {item.description}
                      </p>
                    </div>

                    <EventDeleteButton
                      onClick={() => setEventForDelete(item)}
                    />
                  </article>
                );
              }

              return (
                <article key={item.id} className="cm-moderation-card">
                  <div className="cm-moderation-card-left">
                    <p className="cm-moderation-card-title">
                      {item.title}
                    </p>

                    <div className="cm-moderation-team">
                      <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                        <circle
                          cx="21"
                          cy="16"
                          r="6"
                          stroke="#111"
                          strokeWidth="1.5"
                        />

                        <path
                          d="M8 34c0-7.2 5.8-13 13-13s13 5.8 13 13"
                          stroke="#111"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />

                        <circle
                          cx="21"
                          cy="21"
                          r="19"
                          stroke="#111"
                          strokeWidth="1.5"
                        />
                      </svg>

                      <span>{item.team}</span>
                    </div>
                  </div>

                  <div className="cm-moderation-card-right">
                    <p className="cm-moderation-date">
                      {item.date}
                    </p>

                    <DetailsButton onClick={() => setSelectedReport(item)} />
                  </div>
                </article>
              );
            })
          )}
        </div>
      </main>

      {selectedReport && (
        <Modal closeModal={closeReportModal}>
          <div className="cm-report-modal-body">
            <h2 className="cm-report-modal-title">
              Отчет
            </h2>

            <div className="cm-report-modal-team">
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                <circle
                  cx="21"
                  cy="16"
                  r="6"
                  stroke="#111"
                  strokeWidth="1.5"
                />

                <path
                  d="M8 34c0-7.2 5.8-13 13-13s13 5.8 13 13"
                  stroke="#111"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <circle
                  cx="21"
                  cy="21"
                  r="19"
                  stroke="#111"
                  strokeWidth="1.5"
                />
              </svg>

              <span>{selectedReport.team}</span>
            </div>

            <div className="cm-report-modal-fields">
              <div className="cm-report-modal-field">
                <p className="cm-report-modal-field-title">Поле 1</p>
                <p className="cm-report-modal-field-text">Текст</p>
              </div>

              <div className="cm-report-modal-field">
                <p className="cm-report-modal-field-title">Поле 1</p>
                <p className="cm-report-modal-field-text">Текст</p>
              </div>

              <div className="cm-report-modal-field">
                <p className="cm-report-modal-field-title">Поле 1</p>
                <p className="cm-report-modal-field-text">Текст</p>
              </div>
            </div>

            <div className="cm-report-modal-actions">
              <ReportRejectButton onClick={handleReportReject} />

              <ReportAcceptButton onClick={handleReportAccept} />
            </div>
          </div>
        </Modal>
      )}

      {eventForDelete && (
        <Modal closeModal={closeDeleteEventModal}>
          <div className="cm-event-delete-modal-body">
            <div className="cm-event-delete-info">
              <p className="cm-event-delete-title">
                {eventForDelete.title}
              </p>

              <p className="cm-event-delete-description">
                {eventForDelete.description}
              </p>
            </div>

            <label className="cm-event-delete-label">
              Введите комментарий
            </label>

            <textarea
              className="cm-event-delete-textarea"
              value={deleteComment}
              onChange={(event) => setDeleteComment(event.target.value)}
            />

            <div className="cm-event-delete-actions">
              <EventDeleteCancelButton onClick={closeDeleteEventModal} />

              <EventDeleteConfirmButton onClick={handleDeleteEvent} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}