import React, { useState } from 'react';
import { TopMenu } from '../components/TopMenu/TopMenu';
import { NavLenta } from '../components/NavLenta/NavLenta';
import { CreateChallengeButton, SendReportButton } from '../components/Button/Button';
import { Modal } from '../components/cards/card';
import '../styles/ChallengesPage.css';

interface Challenge {
  id: number;
  title: string;
  description: string;
}

const mockChallenges: Challenge[] = [
  { id: 1, title: 'Название челленджа', description: 'Описание' },
  { id: 2, title: 'Название челленджа', description: 'Описание' },
];

export function ChallengesPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="challenges-container">
      <TopMenu />

      <div className="challenges-content">
        <div className="challenges-header">
          <NavLenta />
          <CreateChallengeButton />
        </div>

        <div className="challenges-list">
          {mockChallenges.map((challenge) => (
            <div key={challenge.id} className="challenges-card">
              <p className="challenges-card-title">{challenge.title}</p>
              <p className="challenges-card-description">{challenge.description}</p>
              <div className="challenges-card-footer">
                <SendReportButton onClick={() => setIsReportModalOpen(true)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно отправки отчёта */}
      {isReportModalOpen && (
        <Modal closeModal={() => setIsReportModalOpen(false)}>
          <div className="report-modal-body">
            <div className="report-section">
              <p className="report-label">Прикрепите отчет</p>
              <label className="report-upload-btn">
                <span className="report-upload-icon">📎</span>
                загрузить файл
                <input type="file" hidden />
              </label>
            </div>

            <div className="report-section">
              <p className="report-label">Ваш комментарий</p>
              <textarea className="report-textarea" placeholder="" />
            </div>

            <div className="report-footer">
              <button className="button button-small drop-shadow">
                <p className="button-text button-text-small">Отправить</p>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
