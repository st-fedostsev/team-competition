import React, { useState, useEffect } from 'react';
import { JoinButton, CreatePlusButton, CreateButton } from './Buttons';
import { Modal } from './ModalWindowComponent';
import { useSearchTeams, useJoinTeam, useCreateTeam } from '../hooks/useTeam';
import '../styles/SearchTeamModal.css';

interface SearchTeamModalProps {
  closeModal: () => void;
  onSuccess?: () => void;
}

const ITEMS_PER_PAGE = 5;

export function SearchTeamModal({ closeModal, onSuccess }: SearchTeamModalProps) {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const { 
    data, 
    isLoading: isSearching, 
    refetch 
  } = useSearchTeams(searchValue, ITEMS_PER_PAGE, offset);
  
  const { mutate: joinTeam, isPending: isJoining } = useJoinTeam();
  const { mutate: createTeam, isPending: isCreating } = useCreateTeam();

  // Поиск при изменении значения (с debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.trim()) {
        refetch();
        setCurrentPage(1);
      } else {
        // Если поиск пустой, показываем все команды
        refetch();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, refetch]);

  // Загружаем команды при открытии модалки
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleJoinTeam = (inviteCode: string) => {
    joinTeam(
      { secret_code: inviteCode },
      {
        onSuccess: () => {
          onSuccess?.();
          closeModal();
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      refetch();
      setCurrentPage(1);
    }
  };

  const handleCreateTeam = () => {
    if (teamName.trim()) {
      createTeam(
        { name: teamName, description: undefined },
        {
          onSuccess: () => {
            setIsCreateTeamOpen(false);
            closeModal();
            onSuccess?.();
          },
        }
      );
    }
  };

  const teams = data?.result || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      refetch();
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      refetch();
    }
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
              placeholder="Введите название"
              className="search-team-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
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
            {isSearching && (
              <div className="search-team-loading">Поиск команд...</div>
            )}
            
            {!isSearching && teams.length === 0 && searchValue && (
              <div className="search-team-empty">
                <p>Команды не найдены</p>
              </div>
            )}
            
            {!isSearching && teams.length === 0 && !searchValue && (
              <div className="search-team-empty">
                <p>Введите название для поиска</p>
              </div>
            )}

            {teams.map((team) => (
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
                <JoinButton 
                  onClick={() => handleJoinTeam(team.secret_code)}
                  disabled={isJoining}
                />
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="search-team-pagination">
              <button
                className="pagination-nav-btn"
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

      {/* Модалка создания команды поверх */}
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