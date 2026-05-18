import React, { useState } from 'react';
import { TopMenu } from '../components/TopMenu/TopMenu';
import { PostAnnouncementButton, ReplyButton, PublishButton } from '../components/Button/Button';
import { Modal } from '../components/cards/card';
import '../styles/KnowledgePage.css';

interface Announcement {
  id: number;
  title: string;
  description: string;
  type: string;
}

const mockAnnouncements: Announcement[] = [
  { id: 1, title: 'Название объявления', description: 'Описание', type: 'Тип' },
  { id: 2, title: 'Название объявления', description: 'Описание', type: 'Тип' },
];

export function KnowledgePage() {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  return (
    <div className="knowledge-container">
      <TopMenu />

      <div className="knowledge-content">
        <div className="knowledge-header">
          <PostAnnouncementButton onClick={() => setIsPublishModalOpen(true)} />
        </div>

        {/* Список объявлений */}
        <div className="knowledge-list">
          {mockAnnouncements.map((item) => (
            <div key={item.id} className="knowledge-card">
              <div className="knowledge-card-top">
                <div className="knowledge-card-info">
                  <p className="knowledge-card-title">{item.title}</p>
                  <p className="knowledge-card-description">{item.description}</p>
                </div>
                <span className="knowledge-card-type">{item.type}</span>
              </div>
              <div className="knowledge-card-footer">
                <ReplyButton />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно публикации объявления */}
      {isPublishModalOpen && (
        <Modal closeModal={() => setIsPublishModalOpen(false)}>
          <div className="publish-modal-body">

            <div className="publish-modal-section">
              <p className="publish-modal-label">Введите название объявления</p>
              <input
                type="text"
                className="publish-modal-input"
              />
            </div>

            <div className="publish-modal-section">
              <p className="publish-modal-label">Выберите тип</p>
              <div className="publish-modal-select-wrapper">
                <select className="publish-modal-select">
                  <option value=""></option>
                  <option value="offer">Предложение</option>
                  <option value="request">Запрос</option>
                </select>
              </div>
            </div>

            <div className="publish-modal-section">
              <p className="publish-modal-label">Введите описание</p>
              <textarea className="publish-modal-textarea" />
            </div>

            <div className="publish-modal-footer">
              <PublishButton />
            </div>

          </div>
        </Modal>
      )}
    </div>
  );
}
