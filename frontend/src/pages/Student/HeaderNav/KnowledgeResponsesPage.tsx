import { ChangeEvent, useState } from 'react';
import { HeaderStudent } from '../../../components/Header/HeaderStudent';
import { PostAnnouncementButton } from '../../../components/Buttons';
import { Modal } from '../../../components/ModalWindowComponent';
import { NavKnowledge } from '../../../components/Nav/NavKnowledge';
import '../../../styles/KnowledgePage.css';

type ResponseStatus = 'pending' | 'accepted' | 'rejected';

interface KnowledgeResponseMock {
  id: number;
  title: string;
  description: string;
  date: string;
  status: ResponseStatus;
}

const PAGE_SIZE = 2;

const KNOWLEDGE_RESPONSES_MOCK: KnowledgeResponseMock[] = [
  {
    id: 1,
    title: 'балалла',
    description: 'Нужно',
    date: '02.06.2026 12:00',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Дввава',
    description: 'вававава',
    date: '03.06.2026 15:30',
    status: 'accepted',
  },
  {
    id: 3,
    title: 'Ксмсмсмс',
    description: 'смсмсм',
    date: '04.06.2026 18:10',
    status: 'rejected',
  },
];

const getStatusText = (status: ResponseStatus) => {
  if (status === 'pending') return 'В ожидании';
  if (status === 'accepted') return 'Принято';
  return 'Отклонено';
};

const getButtonText = (status: ResponseStatus) => {
  if (status === 'pending') return 'Отменить запрос';
  if (status === 'accepted') return 'Отправить отчет';
  return 'Отклонено';
};

export function KnowledgeResponsesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedReportResponse, setSelectedReportResponse] =
    useState<KnowledgeResponseMock | null>(null);

  const [reportComment, setReportComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [isFileNameOpen, setIsFileNameOpen] = useState(false);

  const totalPages = Math.ceil(KNOWLEDGE_RESPONSES_MOCK.length / PAGE_SIZE);

  const paginatedResponses = KNOWLEDGE_RESPONSES_MOCK.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPrevPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const openReportModal = (response: KnowledgeResponseMock) => {
    if (response.status !== 'accepted') return;

    setSelectedReportResponse(response);
    setReportComment('');
    setSelectedFile(null);
    setFileName('');
    setIsFileNameOpen(false);
  };

  const closeReportModal = () => {
    setSelectedReportResponse(null);
    setReportComment('');
    setSelectedFile(null);
    setFileName('');
    setIsFileNameOpen(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > 10 * 1024 * 1024) {
        alert('Файл не должен превышать 10MB');
        return;
      }

    setSelectedFile(file);
    setFileName(file.name);
    setIsFileNameOpen(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName('');
    setIsFileNameOpen(false);
  };

  const handleSendReport = () => {
    closeReportModal();
  };

  return (
    <div className="knowledge-container">
      <HeaderStudent />

      <div className="knowledge-content">
        <div className="knowledge-header">
          <NavKnowledge />

          <PostAnnouncementButton onClick={() => {}} />
        </div>

        <div className="knowledge-list">
          {paginatedResponses.length === 0 ? (
            <div className="empty-posts">У вас пока нет откликов</div>
          ) : (
            paginatedResponses.map((response) => (
              <div key={response.id} className="knowledge-card">
                <div className="knowledge-card-top">
                  <div className="knowledge-card-info">
                    <p className="knowledge-card-title">{response.title}</p>

                    <p className="knowledge-card-description">
                      {response.description}
                    </p>
                  </div>

                  <span className="knowledge-card-date">{response.date}</span>
                </div>

                <div className="knowledge-card-status">
                  Статус: {getStatusText(response.status)}
                </div>

                <div className="knowledge-card-footer">
                  <button
                    className="button button-small drop-shadow"
                    type="button"
                    disabled={response.status === 'rejected'}
                    onClick={() => openReportModal(response)}
                  >
                    <p className="button-text button-text-small">
                      {getButtonText(response.status)}
                    </p>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="knowledge-pagination">
            <button
              className="pagination-nav-btn"
              type="button"
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
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>

      {selectedReportResponse && (
        <Modal closeModal={closeReportModal}>
          <div className="report-modal-body">
            <div className="report-section">
              <p className="report-label">Прикрепите отчет</p>

              {!selectedFile && (
                <label className="report-upload-btn">
                  Выбор файла
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png,.zip,.rar,.7z"
                  />
                </label>
              )}

                {selectedFile && (
                <div className="selected-file-card">
                    <div className="selected-file-main">
                    <div className="selected-file-text">
                        <p className="selected-file-name">
                        {fileName || selectedFile.name}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="remove-file-btn"
                        onClick={handleRemoveFile}
                        aria-label="Удалить файл"
                    >
                        <svg
                        className="remove-file-icon"
                        viewBox="0 0 448 512"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            fill="#191919"
                            d="M432,32H312l-9.4-18.7C298.5,5.1,290.2,0,281.1,0H166.8c-9.1,0-17.4,5.1-21.4,13.3L136,32H16
                            C7.2,32,0,39.2,0,48v32c0,8.8,7.2,16,16,16h416c8.8,0,16-7.2,16-16V48C448,39.2,440.8,32,432,32z M53.2,467
                            c1.6,25.3,22.6,45,47.9,45h245.8c25.3,0,46.3-19.7,47.9-45L416,128H32L53.2,467z"
                        />
                        </svg>
                    </button>
                    </div>

                    <div className="file-description-area">
                    <button
                        type="button"
                        className="file-description-button"
                        onClick={() => setIsFileNameOpen((prev) => !prev)}
                    >
                        <span className="file-description-icon" />
                        Редактировать название
                    </button>

                    {isFileNameOpen && (
                        <div className="file-description-popover">
                        <p className="file-description-title">
                            Название файла
                        </p>

                        <input
                            className="file-description-input"
                            value={fileName}
                            onChange={(event) => setFileName(event.target.value)}
                            placeholder="Введите название файла..."
                            autoFocus
                        />
                        </div>
                    )}
                    </div>
                </div>
                )}
            </div>

            <div className="report-section">
              <p className="report-label">Ваш комментарий</p>

              <textarea
                className="report-textarea"
                placeholder="Опишите, что было сделано..."
                value={reportComment}
                onChange={(event) => setReportComment(event.target.value)}
                rows={4}
              />
            </div>

            <div className="report-footer">
              <button
                className="button button-small drop-shadow"
                type="button"
                onClick={handleSendReport}
                disabled={!selectedFile || !reportComment.trim()}
              >
                <p className="button-text button-text-small">Отправить</p>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}