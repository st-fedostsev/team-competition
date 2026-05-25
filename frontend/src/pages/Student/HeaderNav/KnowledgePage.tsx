import React, { useState } from 'react';
import { HeaderStudent } from '../../../components/Header/HeaderStudent';
import { PostAnnouncementButton, ReplyButton, PublishButton } from '../../../components/Buttons';
import { Modal } from '../../../components/ModalWindowComponent';
import { useKnowledgePosts, useCreateKnowledgePost } from '../../../hooks/useKnowledge';
import '../../../styles/KnowledgePage.css';



export function KnowledgePage() {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'offer' | 'request'>('offer');
  const [tags, setTags] = useState('');
  
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useKnowledgePosts();
  const { mutate: createPost } = useCreateKnowledgePost();

  // Обработчик отправки формы через PublishButton
  const handlePublish = () => {
    if (!title || !description) {
      alert('Заполните название и описание');
      return;
    }
    
    createPost(
      { title, description, type, tags },
      {
        onSuccess: () => {
          setIsPublishModalOpen(false);
          setTitle('');
          setDescription('');
          setTags('');
          setType('offer');
        },
      }
    );
  };

  const allPosts = data?.pages?.flatMap(page => page?.posts || []) || [];

  return (
    <div className="knowledge-container">
      <HeaderStudent
      />
      <div className="knowledge-content">
        <div className="knowledge-header">
          <PostAnnouncementButton onClick={() => setIsPublishModalOpen(true)} />
        </div>

        {/* Список объявлений */}
        <div className="knowledge-list">
          {isLoading ? (
            <div className="loading">Загрузка...</div>
          ) : allPosts.length === 0 ? (
            <div className="empty-posts">Нет объявлений</div>
          ) : (
            allPosts.map((post) => (
              post && (
                <div key={post.id} className="knowledge-card">
                  <div className="knowledge-card-top">
                    <div className="knowledge-card-info">
                      <p className="knowledge-card-title">{post.title}</p>
                      <p className="knowledge-card-description">{post.description}</p>
                      {post.tags && (
                        <div className="knowledge-card-tags">
                          {post.tags.split(',').map((tag:string, idx:number) => (
                            <span key={idx} className="tag">#{tag.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`knowledge-card-type ${post.type}`}>
                      {post.type === 'offer' ? 'Предложение' : 'Запрос'}
                    </span>
                  </div>
                  <div className="knowledge-card-footer">
                    <ReplyButton />
                  </div>
                </div>
              )
            ))
          )}
        </div>

        {hasNextPage && !isLoading && (
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

      {/* Модальное окно публикации объявления */}
      {isPublishModalOpen && (
        <Modal closeModal={() => setIsPublishModalOpen(false)}>
          <div className="publish-modal-body">
            <div className="publish-modal-section">
              <p className="publish-modal-label">Введите название объявления</p>
              <input
                type="text"
                className="publish-modal-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="publish-modal-section">
              <p className="publish-modal-label">Выберите тип</p>
              <div className="publish-modal-select-wrapper">
                <select 
                  className="publish-modal-select"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'offer' | 'request')}
                >
                  <option value="offer">Предложение</option>
                  <option value="request">Запрос</option>
                </select>
              </div>
            </div>

            <div className="publish-modal-section">
              <p className="publish-modal-label">Введите теги (через запятую)</p>
              <input
                type="text"
                className="publish-modal-input"
                placeholder="программирование, дизайн"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="publish-modal-section">
              <p className="publish-modal-label">Введите описание</p>
              <textarea 
                className="publish-modal-textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="publish-modal-footer">
              <PublishButton onClick={handlePublish} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}