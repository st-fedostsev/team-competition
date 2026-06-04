import React, { useState } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavLenta } from '../../../../components/Nav/NavEvents';
import { SendReportButton } from '../../../../components/Buttons';
import { Modal } from '../../../../components/ModalWindowComponent';
import { useChallengesList, useSendChallengeReport } from '../../../../hooks/useChallenges';
import { useUploadFile } from '../../../../hooks/useFiles';
import { useCurrentUser } from '../../../../hooks/useAuth';
import { TABS } from '../../../../constants';
import '../../../../styles/ChallengesPage.css';

// Тип для ошибки API
interface ApiErrorResponse {
  msg?: string;
  message?: string;
  detail?: string;
}

// Тип для axios ошибки
interface AxiosErrorType extends Error {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
}

// Type guard для проверки axios ошибки
function isAxiosError(error: Error): error is AxiosErrorType {
  return 'response' in error && error.response !== null && typeof error.response === 'object';
}

// Функция для форматирования даты и времени
const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return 'Дата не указана';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Неверная дата';
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export function ChallengesPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [fileDescription, setFileDescription] = useState('');
  const [isFileDescriptionOpen, setIsFileDescriptionOpen] = useState(false);
    
  const { data: user } = useCurrentUser();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useChallengesList();
  const { mutate: sendReport, isPending: isSending } = useSendChallengeReport();
  const { mutateAsync: uploadFile, isPending: isUploadPending } = useUploadFile();

  const canSendReport = user?.role === 'student';

  const handleOpenReportModal = (challengeId: number) => {
    setSelectedChallengeId(challengeId);
    setIsReportModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 10 * 1024 * 1024) {
        alert('Файл не должен превышать 10MB');
        return;
      }

      setSelectedFile(file);
      setFileDescription('');
      setIsFileDescriptionOpen(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileDescription('');
    setIsFileDescriptionOpen(false);
  };

  const handleSendReport = async () => {
    if (!selectedChallengeId) return;
    if (!comment.trim()) {
      alert('Введите комментарий');
      return;
    }
    if (!selectedFile) {
      alert('Прикрепите файл с отчётом');
      return;
    }

    setIsUploading(true);
    
    try {
      // ✅ Загружаем файл на сервер и получаем ID
      const uploadResponse = await uploadFile(selectedFile);
      const fileId = uploadResponse.data.id;
      
      // ✅ Формируем URL для скачивания
      const fileUrl = `http://localhost:8000/files/download/${fileId}`;
      
      sendReport({
        challengeId: selectedChallengeId,
        comment: comment,
        fileUrl: fileUrl,
      }, {
        onSuccess: () => {
          setIsReportModalOpen(false);
          setComment('');
          setSelectedFile(null);
          setFileDescription('');
          setIsFileDescriptionOpen(false);
          setSelectedChallengeId(null);
          alert('Отчёт успешно отправлен!');
        },
        onError: (error: Error) => {
          let message = 'Ошибка отправки отчёта';
          
          if (isAxiosError(error) && error.response?.data) {
            const data = error.response.data;
            message = data.msg || data.message || data.detail || message;
          } else if (error.message) {
            message = error.message;
          }
          
          alert(message);
        },
      });
    } catch {
      alert('Ошибка загрузки файла');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="challenges-container">
        <HeaderStudent />
        <div className="challenges-content">
          <div className="loading">Загрузка челленджей...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="challenges-container">
        <HeaderStudent />
        <div className="challenges-content">
          <div className="error">
            <p>Ошибка загрузки: {error?.message || 'Неизвестная ошибка'}</p>
            <button onClick={() => window.location.reload()}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }

  const allChallenges = data?.pages.flatMap(page => page.challenges) || [];

  return (
    <div className="challenges-container">
      <HeaderStudent />

      <div className="challenges-content">
        <div className="challenges-header">
          <NavLenta tabs={TABS} />
        </div>

        <div className="challenges-list">
          {allChallenges.length === 0 ? (
            <div className="empty-challenges">
              <p>Нет доступных челленджей</p>
            </div>
          ) : (
            allChallenges.map((challenge) => (
              <div key={challenge.id} className="challenges-card">
                <div className="challenges-card-header">
                  <p className="challenges-card-title">{challenge.title}</p>
                  <span className="challenge-date">{formatDateTime(challenge.deadline)}</span>
                </div>
                <p className="challenges-card-description">{challenge.description}</p>
                <div className="challenges-card-footer">
                  {canSendReport && (
                    <SendReportButton onClick={() => handleOpenReportModal(challenge.id)} />
                  )}
                </div>
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

      {/* Модальное окно отправки отчёта */}
      {isReportModalOpen && (
        <Modal closeModal={() => setIsReportModalOpen(false)}>
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
                      <p className="selected-file-name">{selectedFile.name}</p>

                      {fileDescription.trim() ? (
                        <p className="selected-file-description">{fileDescription}</p>
                      ) : (
                        <p className="selected-file-placeholder">
                          Описание не добавлено
                        </p>
                      )}
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
                      onClick={() => setIsFileDescriptionOpen((prev) => !prev)}
                    >
                      <span className="file-description-icon"></span>
                      Редактировать описание
                    </button>

                    {isFileDescriptionOpen && (
                      <div className="file-description-popover">
                        <p className="file-description-title">Описание к файлу</p>

                        <input
                          className="file-description-input"
                          value={fileDescription}
                          onChange={(e) => setFileDescription(e.target.value)}
                          placeholder="Напишите описание файла..."
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
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            <div className="report-footer">
              <button 
                className="button button-small drop-shadow" 
                onClick={handleSendReport}
                disabled={isSending || isUploading || isUploadPending || !selectedFile || !comment.trim()}
              >
                <p className="button-text button-text-small">
                  {isUploading || isUploadPending ? 'Загрузка файла...' : isSending ? 'Отправка...' : 'Отправить'}
                </p>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}