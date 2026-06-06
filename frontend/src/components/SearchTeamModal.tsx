import React, { useState, useEffect, useCallback } from 'react';
import { JoinButton, CreatePlusButton, CreateButton } from './Buttons';
import { Modal } from './ModalWindowComponent';
import { 
  useSearchTeams, 
  useCreateTeam, 
  useRequestJoin,
  useCancelJoinRequest,
  useAwaitingRequest,
  useRequestedTeam
} from '../hooks/useTeam';
import { useQueryClient } from '@tanstack/react-query';
import { teamKeys } from '../hooks/useTeam';
import '../styles/SearchTeamModal.css';
import { CancelRequestButton } from '../components/Buttons';

interface SearchTeamModalProps {
  closeModal: () => void;
  onSuccess?: () => void;
}

const ITEMS_PER_PAGE = 1;

export function SearchTeamModal({ closeModal, onSuccess }: SearchTeamModalProps) {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
    const [pageInput, setPageInput] = useState('');
  
  // Сохраняем значение для поиска отдельно
  const [searchQuery, setSearchQuery] = useState('');
  const [shouldSearch, setShouldSearch] = useState(false);
  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  // Получаем информацию об ожидающей заявке
  const { data: awaitingRequest, isLoading: isLoadingRequest, refetch: refetchAwaitingRequest } = useAwaitingRequest();
  const { data: requestedTeam, refetch: refetchRequestedTeam } = useRequestedTeam();
  const { mutate: cancelRequest, isPending: isCancelling } = useCancelJoinRequest();
  
  // Используем searchQuery для запроса
  const { 
    data, 
    isLoading: isSearching, 
    refetch: refetchSearch 
  } = useSearchTeams(searchQuery, ITEMS_PER_PAGE, offset);
  
  const { mutate: createTeam, isPending: isCreating } = useCreateTeam();
  const { mutate: requestJoin, isPending: isRequesting } = useRequestJoin();

  // Функция для полного сброса данных о заявке
  const resetRequestData = useCallback(() => {
    // Сбрасываем кеш запросов
    queryClient.removeQueries({ queryKey: teamKeys.awaitingRequest() });
    queryClient.removeQueries({ queryKey: ['team', 'requested'] });
    queryClient.removeQueries({ queryKey: teamKeys.joinRequests() });
    
    // Делаем refetch для обновления
    setTimeout(() => {
      refetchAwaitingRequest();
      refetchRequestedTeam();
    }, 100);
  }, [queryClient, refetchAwaitingRequest, refetchRequestedTeam]);

  // Выполняем поиск только при нажатии Enter
  const performSearch = useCallback(() => {
    setSearchQuery(searchValue);
    setShouldSearch(true);
    setCurrentPage(1);
  }, [searchValue]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  // Загружаем команды при открытии модалки (показываем все команды)
  useEffect(() => {
    if (!shouldSearch && !searchQuery) {
      setSearchQuery('');
      setShouldSearch(true);
    }
  }, []);

  // При изменении пагинации или поискового запроса обновляем результаты
  useEffect(() => {
    if (shouldSearch) {
      refetchSearch();
    }
  }, [offset, searchQuery, refetchSearch, shouldSearch]);

  const handleRequestJoin = (teamId: number) => {
    requestJoin(teamId, {
      onSuccess: () => {
        // После подачи заявки просто обновляем данные
        refetchAwaitingRequest();
        refetchRequestedTeam();
        refetchSearch();
      },
    });
  };

  const handleCancelRequest = () => {
    cancelRequest(undefined, {
      onSuccess: () => {
        // После отмены заявки полностью сбрасываем данные
        resetRequestData();
        refetchSearch();
      },
    });
  };

  const handleCreateTeam = () => {
    if (teamName.trim()) {
      createTeam(
        { name: teamName, description: undefined },
        {
          onSuccess: () => {
            setIsCreateTeamOpen(false);
            refetchSearch();
            onSuccess?.();
          },
        }
      );
    }
  };

  const allTeams = data?.result || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Проверяем, есть ли активная заявка
  const hasActiveRequest = !!awaitingRequest && !!requestedTeam;

  // Показываем загрузку
  const showLoading = (isSearching || isLoadingRequest) && !allTeams.length;

    const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const pageNumber = parseInt(pageInput);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
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
    <>
      <div className="modal-overlay" onClick={closeModal}>
        <div className="search-team-modal" onClick={(e) => e.stopPropagation()}>
          <button className="search-team-close-btn" onClick={closeModal}>
            ⊗
          </button>

          <div className="search-team-input-wrapper">
            <input
              type="text"
              placeholder="Введите название и нажмите Enter"
              className="search-team-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              disabled={isSearching}
            />
            <span className="search-team-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6.5" stroke="#999" strokeWidth="1.5" />
                <path d="M14 14L18 18" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          <div className="search-team-list">
            {showLoading && (
              <div className="search-team-loading">Загрузка команд...</div>
            )}
            
            {!showLoading && allTeams.length === 0 && searchQuery && (
              <div className="search-team-empty">
                <p>Команды не найдены</p>
              </div>
            )}
            
            {!showLoading && allTeams.length === 0 && !searchQuery && !shouldSearch && (
              <div className="search-team-empty">
                <p>Введите название и нажмите Enter для поиска</p>
              </div>
            )}

            {!showLoading && allTeams.length === 0 && !searchQuery && shouldSearch && (
              <div className="search-team-empty">
                <p>Нет доступных команд</p>
              </div>
            )}

            {allTeams.map((team) => {
              // Проверяем, есть ли активная заявка для этой команды
              const isRequestedTeam = hasActiveRequest && requestedTeam && team.id === requestedTeam.id;
              
              return (
                <div key={team.id} className="search-team-card">
                  <div className="search-team-card-left">
                    <div className="search-team-avatar">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <circle cx="18" cy="14" r="6" stroke="#999" strokeWidth="1.5" />
                        <path
                          d="M6 30c0-6.627 5.373-12 12-12s12 5.373 12 12"
                          stroke="#999"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="search-team-info">
                      <p className="search-team-name">{team.name}</p>
                      <p className="search-team-members">{team.members?.length || 0} участника</p>
                    </div>
                  </div>
                  
                  {isRequestedTeam ? (
                    <CancelRequestButton
                      onClick={handleCancelRequest}
                      disabled={isCancelling}
                      isCancelling={isCancelling}
                    />
                  ) : (
                    <JoinButton 
                      onClick={() => handleRequestJoin(team.id)}
                      disabled={isRequesting}
                    >
                      Отправить заявку
                    </JoinButton>
                  )}
                </div>
              );
            })}
          </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="preview-pagination">
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
                  <span className="pagination-total"> / {totalPages}</span>
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
          
          <div className="search-team-footer">
            <CreatePlusButton onClick={() => setIsCreateTeamOpen(true)} />
          </div>
        </div>
      </div>

      {/* Модалка создания команды */}
      {isCreateTeamOpen && (
        <Modal closeModal={() => setIsCreateTeamOpen(false)}>
          <div className="create-team-body">
            <p className="create-team-label">Введите название команды</p>
            <input
              type="text"
              className="create-team-input"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
              autoFocus
              disabled={isCreating}
            />
            <div className="create-team-footer">
              <CreateButton onClick={handleCreateTeam} disabled={isCreating} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}