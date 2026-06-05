import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
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
import { useChallengeReports, useModerateChallengeReport } from '../../../../hooks/useContentManager';
import { useTeamsByIds } from '../../../../hooks/useTeam';
import { useChallengesList } from '../../../../hooks/useChallenges';
import { useFileInfo, useDownloadFile } from '../../../../hooks/useFiles';
import { MODERATION_TABS } from '../../../../constants';
import '../../../../styles/NewsContentManagerPage.css';
import '../../../../styles/ModerationContentManagerPage.css';

const ITEMS_PER_PAGE = 1;

interface ModerationItem {
  id: number;
  type: string;
  title: string;
  team?: string;
  team_id?: number;
  challenge_id?: number;
  date?: string;
  description?: string;
  comment?: string;
  file_url?: string;
  file_id?: number;
  status?: string;
  marketType?: string;
}

export function ModerationPage() {
  const [activeTab, setActiveTab] = useState(MODERATION_TABS[0].value);
  const [selectedReport, setSelectedReport] = useState<ModerationItem | null>(null);
  const [eventForDelete, setEventForDelete] = useState<ModerationItem | null>(null);
  const [marketItemForDelete, setMarketItemForDelete] = useState<ModerationItem | null>(null);
  const [deleteComment, setDeleteComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');
  
  // Состояния для модального окна отклонения
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [reportToReject, setReportToReject] = useState<ModerationItem | null>(null);

  const scrollPositionRef = useRef(0);
  const isRestoringScrollRef = useRef(false);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Получаем отчёты из API
  const { 
    data: reportsData, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useChallengeReports(ITEMS_PER_PAGE, offset);

  // Получаем челленджи для названий
  const { data: challengesData } = useChallengesList(1000, 0);
  const challengesMap = new Map();
  challengesData?.result?.forEach((challenge: any) => {
    challengesMap.set(challenge.id, challenge.title);
  });

  const reports = reportsData?.result || [];

  // Извлекаем ID файлов из URL
  const extractFileIdFromUrl = (url: string) => {
    const match = url?.match(/\/files\/download\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  // Получаем названия команд через готовый хук
  const teamIds = [...new Set(reports.map(report => report.team_id).filter(Boolean))] as number[];
  const teamQueries = useTeamsByIds(teamIds);
  
  const teamNameMap = new Map();
  teamQueries.forEach((query, index) => {
    if (query.data?.name) {
      teamNameMap.set(teamIds[index], query.data.name);
    }
  });

  // Получаем информацию о файле для выбранного отчёта
  const fileId = selectedReport?.file_url ? extractFileIdFromUrl(selectedReport.file_url) : null;
  const { data: fileInfo, isLoading: isFileLoading } = useFileInfo(fileId);
  const { mutate: downloadFile, isPending: isDownloading } = useDownloadFile();

  const { mutate: moderateReport, isPending: isModerating } = useModerateChallengeReport();

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

  // Формируем список отчётов
  const moderationItems = useMemo(() => {
    return reports.map((report) => ({
      id: report.id,
      type: '/reports',
      title: challengesMap.get(report.challenge_id) || `Челлендж ${report.challenge_id}`,
      team: teamNameMap.get(report.team_id) || `Команда ${report.team_id}`,
      team_id: report.team_id,
      challenge_id: report.challenge_id,
      date: report.created_at ? new Date(report.created_at).toLocaleDateString() : '—',
      comment: report.comment,
      file_url: report.file_url,
      file_id: extractFileIdFromUrl(report.file_url),
      status: report.status,
    }));
  }, [reports, challengesMap, teamNameMap]);

  const totalCount = reportsData?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const filteredItems = useMemo(() => {
    if (activeTab === '/reports') {
      return moderationItems;
    }
    return [];
  }, [activeTab, moderationItems]);

  const closeReportModal = () => {
    setSelectedReport(null);
    setDeleteComment('');
  };

  const closeDeleteEventModal = () => {
    setEventForDelete(null);
    setDeleteComment('');
  };

  const closeDeleteMarketModal = () => {
    setMarketItemForDelete(null);
    setDeleteComment('');
  };

  // Закрытие модального окна отклонения
  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectComment('');
    setReportToReject(null);
  };

  // Обработка одобрения (без модального окна)
  const handleReportAccept = () => {
    if (selectedReport) {
      moderateReport({
        id: selectedReport.id,
        new_status: 'approved',
        moderation_comment: 'Одобрено модератором',
      }, {
        onSuccess: () => {
          closeReportModal();
          refetch();
        }
      });
    }
  };

  // Открытие модального окна для отклонения
  const handleRejectClick = () => {
    if (selectedReport) {
      setReportToReject(selectedReport);
      setIsRejectModalOpen(true);
    }
  };

  // Подтверждение отклонения с комментарием
  const handleConfirmReject = () => {
    if (reportToReject && rejectComment.trim()) {
      moderateReport({
        report_id: reportToReject.id,
        status: 'rejected',
        moderator_comment: rejectComment,
      }, {
        onSuccess: () => {
          closeRejectModal();
          closeReportModal();
          refetch();
        }
      });
    }
  };

  const handleDownloadFile = () => {
    if (fileId) {
      downloadFile(fileId, {
        onSuccess: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileInfo?.display_name || 'report';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        onError: (err) => {
          alert('Ошибка скачивания файла: ' + err.message);
        },
      });
    }
  };

  const handleDeleteMarketItem = (item: ModerationItem) => {
    setMarketItemForDelete(item);
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

  const handleConfirmDeleteMarketItem = () => {
    console.log('Удалить объявление:', {
      marketItem: marketItemForDelete,
      comment: deleteComment,
    });
    closeDeleteMarketModal();
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

  if (isLoading) {
    return (
      <div className="cm-moderation-page">
        <HeaderContentManager />
        <main className="cm-moderation-content">
          <div className="loading">Загрузка отчётов...</div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cm-moderation-page">
        <HeaderContentManager />
        <main className="cm-moderation-content">
          <div className="error">
            <p>Ошибка загрузки: {(error as any)?.message || 'Неизвестная ошибка'}</p>
            <button onClick={() => refetch()}>Повторить</button>
          </div>
        </main>
      </div>
    );
  }

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
            filteredItems.map((item) => (
              <article key={item.id} className="cm-moderation-card">
                <div className="cm-moderation-card-left">
                  <p className="cm-moderation-card-title">
                    {item.title}
                  </p>

                  <div className="cm-moderation-team">
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                      <circle cx="21" cy="16" r="6" stroke="#111" strokeWidth="1.5" />
                      <path d="M8 34c0-7.2 5.8-13 13-13s13 5.8 13 13" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="21" cy="21" r="19" stroke="#111" strokeWidth="1.5" />
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
            ))
          )}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="cm-moderation-pagination">
            <button className="pagination-nav-btn" onClick={goToPrevPage} disabled={currentPage === 1}>‹</button>
            
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
              <span className="pagination-total"> / {totalPages}</span>
            </div>
            
            <button className="pagination-nav-btn" onClick={goToNextPage} disabled={currentPage === totalPages}>›</button>
          </div>
        )}
      </main>

      {/* Модальное окно отчёта */}
      {selectedReport && (
        <Modal closeModal={closeReportModal}>
          <div className="cm-report-modal-body">
            <h2 className="cm-report-modal-title">
              {`Отчёт по челленджу\n«${selectedReport.title}»`}
            </h2>

            <div className="cm-report-modal-team">
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                <circle cx="21" cy="16" r="6" stroke="#111" strokeWidth="1.5" />
                <path d="M8 34c0-7.2 5.8-13 13-13s13 5.8 13 13" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="21" cy="21" r="19" stroke="#111" strokeWidth="1.5" />
              </svg>
              <span>{selectedReport.team}</span>
            </div>

            <div className="cm-report-modal-fields">


              <div className="cm-report-modal-field">
                <p className="cm-report-modal-field-title">Комментарий</p>
                <p className="cm-report-modal-field-text">{selectedReport.comment}</p>
              </div>

              <div className="cm-report-modal-field">
                <p className="cm-report-modal-field-title"></p>

                {isFileLoading ? (
                  <div className="cm-report-file-loading">
                    Загрузка информации...
                  </div>
                ) : fileInfo ? (
                  <div className="cm-report-file-card">
                    <div className="cm-report-file-icon">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M7 3h7l5 5v13H7V3Z"
                          stroke="#555"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 3v5h5"
                          stroke="#555"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="cm-report-file-info">
                      <p className="cm-report-file-name">
                        {fileInfo.display_name}
                      </p>

                      <p className="cm-report-file-size">
                        Размер: {(fileInfo.size / 1024).toFixed(2)} KB
                      </p>
                    </div>

                    <button
                      className="cm-report-file-download"
                      type="button"
                      onClick={handleDownloadFile}
                      disabled={isDownloading}
                    >
                      {isDownloading ? 'Скачивание...' : 'Скачать'}
                    </button>
                  </div>
                ) : (
                  <div className="cm-report-file-empty">
                    Файл не найден
                  </div>
                )}
              </div>
            </div>

            <div className="cm-report-modal-actions">
              <ReportRejectButton onClick={handleRejectClick} disabled={isModerating} />
              <ReportAcceptButton onClick={handleReportAccept} disabled={isModerating} />
            </div>
          </div>
        </Modal>
      )}

      {/* Модальное окно для отклонения с комментарием */}
      {isRejectModalOpen && reportToReject && (
        <Modal closeModal={closeRejectModal}>
          <div className="cm-event-delete-modal-body">
            <div className="cm-event-delete-info">
              <p className="cm-event-delete-title">Отклонение отчёта</p>
              <p className="cm-event-delete-description">
                Челлендж: {reportToReject.title}<br />
                Команда: {reportToReject.team}
              </p>
            </div>

            <label className="cm-event-delete-label">Введите причину отклонения (комментарий)</label>
            <textarea
              className="cm-event-delete-textarea"
              value={rejectComment}
              onChange={(event) => setRejectComment(event.target.value)}
              placeholder="Укажите причину отклонения отчёта..."
              rows={4}
            />

            <div className="cm-event-delete-actions">
              <EventDeleteCancelButton onClick={closeRejectModal} />
              <EventDeleteConfirmButton 
                onClick={handleConfirmReject} 
                disabled={!rejectComment.trim() || isModerating}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Модалка удаления мероприятия */}
      {eventForDelete && (
        <Modal closeModal={closeDeleteEventModal}>
          <div className="cm-event-delete-modal-body">
            <div className="cm-event-delete-info">
              <p className="cm-event-delete-title">{eventForDelete.title}</p>
              <p className="cm-event-delete-description">{eventForDelete.description}</p>
            </div>

            <label className="cm-event-delete-label">Введите комментарий</label>
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

      {/* Модалка удаления объявления */}
      {marketItemForDelete && (
        <Modal closeModal={closeDeleteMarketModal}>
          <div className="cm-event-delete-modal-body">
            <div className="cm-event-delete-info">
              <p className="cm-event-delete-title">{marketItemForDelete.title}</p>
              <p className="cm-event-delete-description">{marketItemForDelete.description}</p>
            </div>

            <label className="cm-event-delete-label">Введите комментарий</label>
            <textarea
              className="cm-event-delete-textarea"
              value={deleteComment}
              onChange={(event) => setDeleteComment(event.target.value)}
            />

            <div className="cm-event-delete-actions">
              <EventDeleteCancelButton onClick={closeDeleteMarketModal} />
              <EventDeleteConfirmButton onClick={handleConfirmDeleteMarketItem} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}