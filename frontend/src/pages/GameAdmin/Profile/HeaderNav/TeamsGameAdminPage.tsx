import { useState } from 'react';
import { HeaderGameAdmin } from '../../../../components/Header/HeaderGameAdmin';
import '../../../../styles/GameAdminTeamsPage.css';

const TEAMS_PER_PAGE = 5;

type MockLeague = 'novice' | 'pro' | 'legend';

interface MockTeam {
  id: number;
  name: string;
  members: number[];
  league: MockLeague;
}

const MOCK_TEAMS: MockTeam[] = [
  {
    id: 1,
    name: 'Лига',
    members: [1, 2, 3],
    league: 'novice',
  },
  {
    id: 2,
    name: 'Команда Альфа',
    members: [1, 2, 3, 4],
    league: 'pro',
  },
  {
    id: 3,
    name: 'Звёзды знаний',
    members: [1, 2],
    league: 'novice',
  },
  {
    id: 4,
    name: 'Кибер Легенды',
    members: [1, 2, 3, 4, 5],
    league: 'legend',
  },
  {
    id: 5,
    name: 'Умники',
    members: [1],
    league: 'novice',
  },
  {
    id: 6,
    name: 'Профи Тим',
    members: [1, 2, 3],
    league: 'pro',
  },
  {
    id: 7,
    name: 'Феникс',
    members: [1, 2, 3, 4],
    league: 'legend',
  },
  {
    id: 8,
    name: 'Новая волна',
    members: [1, 2],
    league: 'novice',
  },
  {
    id: 9,
    name: 'Победители',
    members: [1, 2, 3, 4, 5],
    league: 'pro',
  },
  {
    id: 10,
    name: 'Вектор',
    members: [1, 2, 3],
    league: 'novice',
  },
];

function TeamAvatar() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" stroke="#111111" strokeWidth="1.2" />
      <circle cx="20" cy="15" r="5" stroke="#111111" strokeWidth="1.2" />
      <path
        d="M8 34c0-6.6 5.37-12 12-12s12 5.4 12 12"
        stroke="#111111"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M16.2 16.2L21 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getMembersText(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${count} участник`;
  }

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return `${count} участника`;
  }

  return `${count} участников`;
}

function getLeagueText(league: MockLeague) {
  switch (league) {
    case 'novice':
      return 'Новички';
    case 'pro':
      return 'Профи';
    case 'legend':
      return 'Легенды';
    default:
      return 'Лига';
  }
}

export function TeamsGameAdminPage() {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTeams = MOCK_TEAMS.filter((team) => {
    const search = searchValue.trim().toLowerCase();

    if (!search) {
      return true;
    }

    return team.name.toLowerCase().includes(search);
  });

  const totalPages = Math.ceil(filteredTeams.length / TEAMS_PER_PAGE);
  const startIndex = (currentPage - 1) * TEAMS_PER_PAGE;
  const currentTeams = filteredTeams.slice(startIndex, startIndex + TEAMS_PER_PAGE);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  return (
    <div className="game-admin-teams-page">
      <HeaderGameAdmin />

      <main className="game-admin-teams-main">
        <div className="game-admin-teams-search">
          <input
            className="game-admin-teams-search-input"
            type="text"
            placeholder="Введите название"
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
              setCurrentPage(1);
            }}
          />

          <span className="game-admin-teams-search-icon">
            <SearchIcon />
          </span>
        </div>

        <div className="game-admin-teams-list">
          {currentTeams.length === 0 ? (
            <div className="game-admin-teams-status">
              Команды не найдены
            </div>
          ) : (
            currentTeams.map((team) => (
              <article className="game-admin-team-card" key={team.id}>
                <div className="game-admin-team-info">
                  <div className="game-admin-team-avatar">
                    <TeamAvatar />
                  </div>

                  <div className="game-admin-team-text">
                    <h3 className="game-admin-team-title">
                      {team.name}
                    </h3>

                    <p className="game-admin-team-members">
                      {getMembersText(team.members.length)}
                    </p>

                    <p className="game-admin-team-league">
                      {getLeagueText(team.league)}
                    </p>
                  </div>
                </div>

                <button
                  className="game-admin-team-more-button"
                  type="button"
                  onClick={() => {
                    console.log('Подробнее о команде:', team);
                  }}
                >
                  Подробнее
                </button>
              </article>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="game-admin-teams-pagination">
            <button
              className="game-admin-teams-pagination-button"
              type="button"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              ‹
            </button>

            <span className="game-admin-teams-pagination-counter">
              {currentPage} / {totalPages}
            </span>

            <button
              className="game-admin-teams-pagination-button"
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </main>
    </div>
  );
}