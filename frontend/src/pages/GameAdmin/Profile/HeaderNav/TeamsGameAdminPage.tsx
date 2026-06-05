<<<<<<< Updated upstream
import { useMemo, useState } from 'react';
import { HeaderGameAdmin } from '../../../../components/Header/HeaderGameAdmin';
import '../../../../styles/GameAdminTeamsPage.css';
=======
// import { useEffect, useMemo, useState } from 'react';
// import { HeaderGameAdmin } from '../../../../components/Header/HeaderGameAdmin';
// import { useSearchTeam } from '../../../../hooks/useTeam';
// import type { Team } from '../../../../types/team.types';
// import '../../../../styles/GameAdminTeamsPage.css';
>>>>>>> Stashed changes

// const TEAMS_PER_PAGE = 5;

<<<<<<< Updated upstream
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
    members: [4, 5, 6, 7],
    league: 'pro',
  },
  {
    id: 3,
    name: 'Звёзды знаний',
    members: [8, 9],
    league: 'novice',
  },
  {
    id: 4,
    name: 'Кибер Легенды',
    members: [10, 11, 12, 13, 14],
    league: 'legend',
  },
  {
    id: 5,
    name: 'Умники',
    members: [15],
    league: 'novice',
  },
  {
    id: 6,
    name: 'Профи Тим',
    members: [16, 17, 18],
    league: 'pro',
  },
  {
    id: 7,
    name: 'Феникс',
    members: [19, 20, 21, 22],
    league: 'legend',
  },
  {
    id: 8,
    name: 'Новая волна',
    members: [23, 24],
    league: 'novice',
  },
  {
    id: 9,
    name: 'Победители',
    members: [25, 26, 27, 28, 29],
    league: 'pro',
  },
  {
    id: 10,
    name: 'Вектор',
    members: [30, 31, 32],
    league: 'novice',
  },
  {
    id: 11,
    name: 'Максимум',
    members: [33, 34, 35, 36],
    league: 'legend',
  },
  {
    id: 12,
    name: 'Север',
    members: [37, 38],
    league: 'pro',
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
=======
// function TeamAvatar() {
//   return (
//     <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
//       <circle cx="20" cy="20" r="18.5" stroke="#111111" strokeWidth="1.2" />
//       <circle cx="20" cy="15" r="5" stroke="#111111" strokeWidth="1.2" />
//       <path
//         d="M8 34c0-6.6 5.37-12 12-12s12 5.4 12 12"
//         stroke="#111111"
//         strokeWidth="1.2"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

// function SearchIcon() {
//   return (
//     <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//       <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
//       <path d="M16.2 16.2L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//     </svg>
//   );
// }
>>>>>>> Stashed changes

// function getMembersText(count: number) {
//   const lastDigit = count % 10;
//   const lastTwoDigits = count % 100;

//   if (lastDigit === 1 && lastTwoDigits !== 11) {
//     return `${count} участник`;
//   }

<<<<<<< Updated upstream
  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return `${count} участника`;
  }
=======
//   if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
//     return `${count} участника`;
//   }
>>>>>>> Stashed changes

//   return `${count} участников`;
// }

<<<<<<< Updated upstream
function getLeagueText(league?: MockLeague) {
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

  const filteredTeams = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return MOCK_TEAMS;
    }

    return MOCK_TEAMS.filter((team) => {
      return team.name.toLowerCase().includes(normalizedSearch);
    });
  }, [searchValue]);

  const totalPages = Math.ceil(filteredTeams.length / TEAMS_PER_PAGE);
  const startIndex = (currentPage - 1) * TEAMS_PER_PAGE;
  const currentTeams = filteredTeams.slice(startIndex, startIndex + TEAMS_PER_PAGE);
=======
// function getLeagueText(league?: Team['league']) {
//   switch (league) {
//     case 'novice':
//       return 'Новички';
//     case 'pro':
//       return 'Профи';
//     case 'legend':
//       return 'Легенды';
//     default:
//       return 'Лига';
//   }
// }

// export function TeamsGameAdminPage() {
//   const [searchValue, setSearchValue] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const {
//     mutate: searchTeam,
//     data: searchResponse,
//     isPending: isSearching,
//     isError,
//   } = useSearchTeam();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchValue.trim());
//       setCurrentPage(1);
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchValue]);

//   useEffect(() => {
//     searchTeam({ query: debouncedSearch, limit: 100, offset: 0 });
//   }, [debouncedSearch, searchTeam]);

//   const teams = useMemo<Team[]>(() => searchResponse?.data || [], [searchResponse?.data]);

//   const totalPages = Math.ceil(teams.length / TEAMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * TEAMS_PER_PAGE;
//   const currentTeams = teams.slice(startIndex, startIndex + TEAMS_PER_PAGE);
>>>>>>> Stashed changes

//   const goToPrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((page) => page - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((page) => page + 1);
//     }
//   };

<<<<<<< Updated upstream
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setCurrentPage(1);
  };

  const handleDetailsClick = (team: MockTeam) => {
    console.log('Открыть подробнее по команде:', team);
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
            onChange={handleSearchChange}
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
                  onClick={() => handleDetailsClick(team)}
                >
                  Подробнее
                </button>
              </article>
            ))
          )}
        </div>
=======
//   return (
//     <div className="game-admin-teams-page">
//       <HeaderGameAdmin />

//       <main className="game-admin-teams-main">
//         <div className="game-admin-teams-search">
//           <input
//             className="game-admin-teams-search-input"
//             type="text"
//             placeholder="Введите название"
//             value={searchValue}
//             onChange={(event) => setSearchValue(event.target.value)}
//           />
//           <span className="game-admin-teams-search-icon">
//             <SearchIcon />
//           </span>
//         </div>

//         <div className="game-admin-teams-list">
//           {isSearching && currentTeams.length === 0 ? (
//             <div className="game-admin-teams-status">Загрузка команд...</div>
//           ) : isError ? (
//             <div className="game-admin-teams-status">Ошибка загрузки команд</div>
//           ) : currentTeams.length === 0 ? (
//             <div className="game-admin-teams-status">Команды не найдены</div>
//           ) : (
//             currentTeams.map((team: Team) => (
//               <article className="game-admin-team-card" key={team.id}>
//                 <div className="game-admin-team-info">
//                   <div className="game-admin-team-avatar">
//                     <TeamAvatar />
//                   </div>

//                   <div className="game-admin-team-text">
//                     <h3 className="game-admin-team-title">{team.name}</h3>
//                     <p className="game-admin-team-members">
//                       {getMembersText(team.members?.length || 0)}
//                     </p>
//                     <p className="game-admin-team-league">{getLeagueText(team.league)}</p>
//                   </div>
//                 </div>

//                 <button className="game-admin-team-more-button" type="button">
//                   Подробнее
//                 </button>
//               </article>
//             ))
//           )}
//         </div>
>>>>>>> Stashed changes

//         {totalPages > 1 && (
//           <div className="game-admin-teams-pagination">
//             <button
//               className="game-admin-teams-pagination-button"
//               type="button"
//               onClick={goToPrevPage}
//               disabled={currentPage === 1}
//             >
//               ‹
//             </button>

//             <span className="game-admin-teams-pagination-counter">
//               {currentPage} / {totalPages}
//             </span>

<<<<<<< Updated upstream
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
=======
//             <button
//               className="game-admin-teams-pagination-button"
//               type="button"
//               onClick={goToNextPage}
//               disabled={currentPage === totalPages}
//             >
//               ›
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
>>>>>>> Stashed changes
