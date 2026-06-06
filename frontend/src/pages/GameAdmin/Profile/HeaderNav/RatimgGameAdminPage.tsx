import { useMemo, useState } from 'react';
import { HeaderGameAdmin } from '../../../../components/Header/HeaderGameAdmin';
import { NavRating } from '../../../../components/Nav/NavRating';
import { EditIcon } from '../../../../components/EditIcon';
import { SearchIcon } from '../../../../components/SearchIcon';
import { GAME_ADMIN_RATING_TABS } from '../../../../constants';
import '../../../../styles/GameAdminRatingPage.css';

type RatingView = 'students' | 'teams';

type StudentRatingRow = {
  id: number;
  position: string;
  fullName: string;
  team: string;
  score: number;
};

type TeamRatingRow = {
  id: number;
  position: string;
  team: string;
  league: string;
  score: number;
};

const studentsMock: StudentRatingRow[] = [
  {
    id: 1,
    position: '1',
    fullName: 'Иванов Иван Иванович',
    team: 'Название',
    score: 1,
  },
  {
    id: 2,
    position: '2',
    fullName: 'Иванов Иван Иванович',
    team: 'Название',
    score: 1,
  },
  {
    id: 3,
    position: '',
    fullName: 'Иванов Иван Иванович',
    team: 'Название',
    score: 1,
  },
];

const teamsMock: TeamRatingRow[] = [
  {
    id: 1,
    position: '1',
    team: 'Название',
    league: 'Название',
    score: 1,
  },
  {
    id: 2,
    position: '2',
    team: 'Название',
    league: 'Название',
    score: 1,
  },
  {
    id: 3,
    position: '',
    team: 'Название',
    league: 'Название',
    score: 1,
  },
];

function SettingsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="game-admin-rating-settings-icon"
    >
      <path
        d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2.06 2.06 0 1 1-2.91 2.91l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.35 1.1V21a2.06 2.06 0 0 1-4.12 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2.06 2.06 0 1 1-2.91-2.91l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.35H3a2.06 2.06 0 0 1 0-4.12h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2.06 2.06 0 1 1 2.91-2.91l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .35-1.1V3a2.06 2.06 0 0 1 4.12 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2.06 2.06 0 1 1 2.91 2.91l-.06.06A1.7 1.7 0 0 0 19.4 9c.11.36.32.7.6 1 .3.25.7.37 1.1.35H21a2.06 2.06 0 0 1 0 4.12h-.09a1.7 1.7 0 0 0-1.51.53Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface RatingGameAdminPageProps {
  view?: RatingView;
}

export function RatingGameAdminPage({ view = 'students' }: RatingGameAdminPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [topOnly, setTopOnly] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const [formulaSettings, setFormulaSettings] = useState({
    baseRatingOne: '',
    baseRatingTwo: '',
    baseRatingThree: '',
    });

  const isStudents = view === 'students';

  const handleFormulaChange = (
    field: keyof typeof formulaSettings,
    value: string
    ) => {
    setFormulaSettings((prev) => ({
        ...prev,
        [field]: value,
    }));
    };

    const handleConfirmFormulaSettings = () => {
    console.log('Настройки формулы КР:', formulaSettings);
    setIsSettingsModalOpen(false);
    };

  const filteredStudents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const result = studentsMock.filter((student) => {
      if (!normalizedQuery) return true;
      return `${student.fullName} ${student.team}`.toLowerCase().includes(normalizedQuery);
    });

    return topOnly ? result.slice(0, 10) : result;
  }, [searchQuery, topOnly]);

  const filteredTeams = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const result = teamsMock.filter((team) => {
      if (!normalizedQuery) return true;
      return `${team.team} ${team.league}`.toLowerCase().includes(normalizedQuery);
    });

    return topOnly ? result.slice(0, 10) : result;
  }, [searchQuery, topOnly]);

  return (
    <div className="game-admin-rating-page">
      <HeaderGameAdmin />

      <main className="game-admin-rating-main">
        <div className="game-admin-rating-control-row">
          <NavRating tabs={GAME_ADMIN_RATING_TABS} />

            <button
            className="game-admin-rating-settings-button"
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            >
            <SettingsIcon />
            <span>Настройки</span>
            </button>
        </div>

        <div className="game-admin-rating-search">
          <input
            className="game-admin-rating-search-input"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Введите название"
          />

          <button className="game-admin-rating-search-button" type="button" aria-label="Поиск">
            <SearchIcon />
          </button>
        </div>

        <label className="game-admin-rating-top-checkbox">
          <input
            type="checkbox"
            checked={topOnly}
            onChange={(event) => setTopOnly(event.target.checked)}
          />
          <span>Топ-10</span>
        </label>

        <div className="game-admin-rating-table">
          {isStudents ? (
            <>
              <div className="game-admin-rating-row game-admin-rating-header game-admin-rating-students-row">
                <div>Позиция</div>
                <div>ФИО</div>
                <div>Команда</div>
                <div>Балл</div>
                <div></div>
              </div>

              {filteredStudents.map((student) => (
                <div
                  className="game-admin-rating-row game-admin-rating-students-row"
                  key={student.id}
                >
                  <div>{student.position}</div>
                  <div>{student.fullName}</div>
                  <div>{student.team}</div>
                  <div>{student.score}</div>
                  <div>
                    <button
                      className="game-admin-rating-edit-button"
                      type="button"
                      aria-label="Редактировать"
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="game-admin-rating-row game-admin-rating-header game-admin-rating-teams-row">
                <div>Позиция</div>
                <div>Команда</div>
                <div>Лига</div>
                <div>Балл</div>
                <div></div>
              </div>

              {filteredTeams.map((team) => (
                <div
                  className="game-admin-rating-row game-admin-rating-teams-row"
                  key={team.id}
                >
                  <div>{team.position}</div>
                  <div>{team.team}</div>
                  <div>{team.league}</div>
                  <div>{team.score}</div>
                  <div>
                    <button
                      className="game-admin-rating-edit-button"
                      type="button"
                      aria-label="Редактировать"
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {isSettingsModalOpen && (
        <div
            className="game-admin-rating-settings-backdrop"
            onClick={() => setIsSettingsModalOpen(false)}
        >
            <div
            className="game-admin-rating-settings-modal"
            onClick={(event) => event.stopPropagation()}
            >
            <h2 className="game-admin-rating-settings-title">
                Настройка формулы КР
            </h2>

            <div className="game-admin-rating-settings-content">
                <div className="game-admin-rating-settings-fields">
                <label className="game-admin-rating-settings-field">
                    <span>Базовый рейтинг</span>
                    <input
                    type="number"
                    value={formulaSettings.baseRatingOne}
                    onChange={(event) =>
                        handleFormulaChange('baseRatingOne', event.target.value)
                    }
                    />
                </label>

                <label className="game-admin-rating-settings-field">
                    <span>Базовый рейтинг</span>
                    <input
                    type="number"
                    value={formulaSettings.baseRatingTwo}
                    onChange={(event) =>
                        handleFormulaChange('baseRatingTwo', event.target.value)
                    }
                    />
                </label>

                <label className="game-admin-rating-settings-field">
                    <span>Базовый рейтинг</span>
                    <input
                    type="number"
                    value={formulaSettings.baseRatingThree}
                    onChange={(event) =>
                        handleFormulaChange('baseRatingThree', event.target.value)
                    }
                    />
                </label>
                </div>

                <div className="game-admin-rating-settings-sum">
                <span>Сумма</span>
                <strong>100%</strong>
                </div>
            </div>

            <div className="game-admin-rating-settings-actions">
                <button
                className="game-admin-rating-settings-confirm"
                type="button"
                onClick={handleConfirmFormulaSettings}
                >
                Подтвердить
                </button>
            </div>
            </div>
        </div>
        )}
      </main>
    </div>
  );
}

export function RatingGameAdminTeamsPage() {
  return <RatingGameAdminPage view="teams" />;
}
