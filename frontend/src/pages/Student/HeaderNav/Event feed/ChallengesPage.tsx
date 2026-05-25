import React, { useState } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavLenta } from '../../../../components/Nav/NavEvents';
import { SendReportButton } from '../../../../components/Buttons';
import { Modal } from '../../../../components/ModalWindowComponent';
import { useChallengesList, useSendChallengeReport } from '../../../../hooks/useChallenges';
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
  
  const { data: user } = useCurrentUser();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useChallengesList();
  const { mutate: sendReport, isPending: isSending } = useSendChallengeReport();

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
    }
  };

  // Функция для загрузки файла на сервер (TODO: заменить на реальный эндпоинт)
  const uploadFile = async (file: File): Promise<string> => {
    // TODO: Реализовать загрузку файла на сервер
    // Пока возвращаем временный URL
    console.log('Загрузка файла:', file.name);
    return URL.createObjectURL(file);
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
      // Загружаем файл и получаем URL
      const fileUrl = await uploadFile(selectedFile);
      
      sendReport({
        challengeId: selectedChallengeId,
        comment: comment,
        fileUrl: fileUrl,
      }, {
        onSuccess: () => {
          setIsReportModalOpen(false);
          setComment('');
          setSelectedFile(null);
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
              <label className="report-upload-btn">
                <span className="report-upload-icon">📎</span>
                {selectedFile ? selectedFile.name : 'загрузить файл'}
                <input type="file" hidden onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.jpg,.png" />
              </label>
              {selectedFile && (
                <div className="file-info">
                  <span>Файл: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                  <button 
                    className="remove-file-btn" 
                    onClick={() => setSelectedFile(null)}
                  >
                    ❌
                  </button>
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
                disabled={isSending || isUploading || !selectedFile || !comment.trim()}
              >
                <p className="button-text button-text-small">
                  {isUploading ? 'Загрузка файла...' : isSending ? 'Отправка...' : 'Отправить'}
                </p>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}