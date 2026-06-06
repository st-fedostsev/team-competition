import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { HeaderStudent } from '../../../components/Header/HeaderStudent';
import { PostAnnouncementButton } from '../../../components/Buttons';
import { Modal } from '../../../components/ModalWindowComponent';
import { NavKnowledge } from '../../../components/Nav/NavKnowledge';
import '../../../styles/KnowledgePage.css';

interface ResponseTeamMock {
  id: number;
  name: string;
  membersCount: number;
}

interface MyKnowledgeAnnouncementMock {
  id: number;
  title: string;
  description: string;
  date: string;
  responseTeams: ResponseTeamMock[];
}

const TEAMS_PAGE_SIZE = 1;

const MY_ANNOUNCEMENTS_MOCK: MyKnowledgeAnnouncementMock[] = [
  {
    id: 1,
    title: 'страница',
    description: 'вававав',
    date: '04.06.2026 10:20',
    responseTeams: [
      {
        id: 1,
        name: 'Команда 1',
        membersCount: 3,
      },
      {
        id: 2,
        name: 'Команда 2',
        membersCount: 4,
      },
    ],
  },
  {
    id: 2,
    title: 'страница2',
    description: 'апапап',
    date: '05.06.2026 11:40',
    responseTeams: [
      {
        id: 3,
        name: 'Команда 3',
        membersCount: 2,
      },
    ],
  },
];

type TeamDecisionStatus = 'accepted' | 'rejected';

export function MyKnowledgeAnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<MyKnowledgeAnnouncementMock | null>(null);

  const [teamStatuses, setTeamStatuses] = useState<
    Record<number, TeamDecisionStatus>
  >({});

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

  const teamsTotalPages = selectedAnnouncement
    ? Math.ceil(selectedAnnouncement.responseTeams.length / TEAMS_PAGE_SIZE)
    : 1;

  const paginatedTeams = selectedAnnouncement
    ? selectedAnnouncement.responseTeams.slice(
        (currentPage - 1) * TEAMS_PAGE_SIZE,
        currentPage * TEAMS_PAGE_SIZE
      )
    : [];

  const openDetailsModal = (announcement: MyKnowledgeAnnouncementMock) => {
    setSelectedAnnouncement(announcement);
    setCurrentPage(1);
    setPageInput('1');
  };

  const closeDetailsModal = () => {
    setSelectedAnnouncement(null);
    setCurrentPage(1);
    setPageInput('1');
  };

  const rejectTeam = (teamId: number) => {
    setTeamStatuses((currentStatuses) => ({
      ...currentStatuses,
      [teamId]: 'rejected',
    }));
  };

  const acceptTeam = (teamId: number) => {
    setTeamStatuses((currentStatuses) => ({
      ...currentStatuses,
      [teamId]: 'accepted',
    }));
  };

  const goToPrevPage = () => {
    setCurrentPage((page) => {
      const newPage = Math.max(page - 1, 1);
      setPageInput(String(newPage));
      return newPage;
    });
  };

  const goToNextPage = () => {
    setCurrentPage((page) => {
      const newPage = Math.min(page + 1, teamsTotalPages);
      setPageInput(String(newPage));
      return newPage;
    });
  };

  const handlePageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPageInput(event.target.value);
  };

  const applyPageInput = () => {
    const parsedPage = Number(pageInput);

    if (!Number.isFinite(parsedPage) || parsedPage < 1) {
      setCurrentPage(1);
      setPageInput('1');
      return;
    }

    if (parsedPage > teamsTotalPages) {
      setCurrentPage(teamsTotalPages);
      setPageInput(String(teamsTotalPages));
      return;
    }

    setCurrentPage(parsedPage);
    setPageInput(String(parsedPage));
  };

  const handlePageInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      applyPageInput();
    }
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
          {MY_ANNOUNCEMENTS_MOCK.length === 0 ? (
            <div className="empty-posts">У вас пока нет объявлений</div>
          ) : (
            MY_ANNOUNCEMENTS_MOCK.map((post) => (
              <div key={post.id} className="knowledge-card">
                <div className="knowledge-card-top">
                  <div className="knowledge-card-info">
                    <p className="knowledge-card-title">{post.title}</p>

                    <p className="knowledge-card-description">
                      {post.description}
                    </p>
                  </div>

                  <span className="knowledge-card-date">{post.date}</span>
                </div>

                <div className="knowledge-card-footer">
                  <button
                    className="button button-small drop-shadow"
                    type="button"
                    onClick={() => openDetailsModal(post)}
                  >
                    <p className="button-text button-text-small">Подробнее</p>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedAnnouncement && (
        <Modal closeModal={closeDetailsModal}>
          <div className="knowledge-teams-modal">
            <h2 className="knowledge-teams-modal-title">
              Отклики на объявление
            </h2>

            <div className="knowledge-teams-list">
              {selectedAnnouncement.responseTeams.length === 0 ? (
                <p className="knowledge-teams-empty">
                  На это объявление пока никто не откликнулся
                </p>
              ) : (
                paginatedTeams.map((team) => {
                  const status = teamStatuses[team.id];

                  return (
                    <div key={team.id} className="knowledge-team-card">
                      <div className="knowledge-team-left">
                        <div className="knowledge-team-avatar">
                          <span />
                        </div>

                        <div className="knowledge-team-info">
                          <p className="knowledge-team-name">{team.name}</p>

                          <p className="knowledge-team-members">
                            {team.membersCount} участника
                          </p>
                        </div>
                      </div>

                      <div className="knowledge-team-actions">
                        {status === 'accepted' && (
                          <span className="knowledge-team-status accepted">
                            Подтверждено
                          </span>
                        )}

                        {status === 'rejected' && (
                          <span className="knowledge-team-status rejected">
                            Отклонено
                          </span>
                        )}

                        {!status && (
                          <>
                            <button
                              className="knowledge-team-reject"
                              type="button"
                              onClick={() => rejectTeam(team.id)}
                            >
                              Отклонить
                            </button>

                            <button
                              className="knowledge-team-accept"
                              type="button"
                              onClick={() => acceptTeam(team.id)}
                            >
                              Подтвердить
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {teamsTotalPages > 1 && (
              <div className="preview-pagination knowledge-teams-pagination">
                <button
                  className="pagination-btn"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  type="button"
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
                    onBlur={applyPageInput}
                    placeholder={`${currentPage}`}
                    min={1}
                    max={teamsTotalPages}
                  />

                  <span className="pagination-total">
                    {' '}
                    / {teamsTotalPages}
                  </span>
                </div>

                <button
                  className="pagination-btn"
                  onClick={goToNextPage}
                  disabled={currentPage === teamsTotalPages}
                  type="button"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}