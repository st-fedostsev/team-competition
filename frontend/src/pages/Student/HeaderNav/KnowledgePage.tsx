import { useState, useRef, useCallback, useEffect } from 'react';
import { HeaderStudent } from '../../../components/Header/HeaderStudent';
import { PostAnnouncementButton, ReplyButton, PublishButton } from '../../../components/Buttons';
import { Modal } from '../../../components/ModalWindowComponent';
import { useKnowledgePosts, useCreateKnowledgePost } from '../../../hooks/useKnowledge';
import '../../../styles/KnowledgePage.css';

const ITEMS_PER_PAGE = 1;

export function KnowledgePage() {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'offer' | 'request'>('offer');
  const [tags, setTags] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState('');
  
  const scrollPositionRef = useRef(0);
  const isRestoringScrollRef = useRef(false);
  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const { data, isLoading, isError, error, refetch } = useKnowledgePosts(ITEMS_PER_PAGE, offset);
  const { mutate: createPost, isPending } = useCreateKnowledgePost();

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

  const allPosts = data?.result || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      saveScrollPosition();
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      saveScrollPosition();
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="knowledge-container">
        <HeaderStudent />
        <div className="knowledge-content">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="knowledge-container">
        <HeaderStudent />
        <div className="knowledge-content">
          <div className="error">
            <p>Ошибка загрузки: {error?.message || 'Неизвестная ошибка'}</p>
            <button onClick={() => refetch()}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }


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
  
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPageInput(e.target.value);
    };

  return (
    <div className="knowledge-container">
      <HeaderStudent />

      <div className="knowledge-content">
        <div className="knowledge-header">
          <PostAnnouncementButton onClick={() => setIsPublishModalOpen(true)} />
        </div>

        <div className="knowledge-list">
          {allPosts.length === 0 ? (
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
                          {post.tags.split(',').map((tag: string, idx: number) => (
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

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="users-pagination">
            <button
              className="pagination-btn"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              ‹
            </button>

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

              <span className="pagination-total">
                {' '}
                / {totalPages}
              </span>
            </div>

            <button
              className="pagination-btn"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </div>

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
              <PublishButton onClick={handlePublish} disabled={isPending} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}