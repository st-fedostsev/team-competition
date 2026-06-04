import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderTechAdmin } from '../../../../components/Header/HeaderTechAdmin';
import { EditIcon } from '../../../../components/EditIcon';
import { SearchIcon } from '../../../../components/SearchIcon';
import '../../../../styles/RatingTechPage.css'

interface TeamRatingItem {
  id: number;
  position: number | null;
  team: string;
  league: string;
  score: number;
}

const TEAM_RATING: TeamRatingItem[] = [
  {
    id: 1,
    position: 1,
    team: 'Название',
    league: 'Название',
    score: 1,
  },
  {
    id: 2,
    position: 2,
    team: 'Название',
    league: 'Название',
    score: 1,
  },
  {
    id: 3,
    position: null,
    team: 'Название',
    league: 'Название',
    score: 1,
  },
];

export function RatingTechPage() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [showTop, setShowTop] = useState(false);

  const normalizedSearchValue = searchValue.trim().toLowerCase();

  const filteredTeams = TEAM_RATING.filter((item) => {
    const searchableText = `${item.team} ${item.league}`.toLowerCase();
    return searchableText.includes(normalizedSearchValue);
  });

  const teamsToShow = showTop ? filteredTeams.slice(0, 10) : filteredTeams;

  return (
    <div className="tech-rating-page">
      <HeaderTechAdmin />

      <main className="tech-rating-main">
        <div className="tech-rating-control-row">
          <div className="tech-rating-tabs">
            <button
              className="tech-rating-tab"
              type="button"
              onClick={() => navigate('/admin/rating/students')}
            >
              Студенты
            </button>

            <button
              className="tech-rating-tab active"
              type="button"
              onClick={() => navigate('/admin/rating/teams')}
            >
              Команды
            </button>
          </div>
        </div>

        <div className="tech-rating-search">
          <input
            className="tech-rating-search-input"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Введите название команды"
          />

          <button className="tech-rating-search-button" type="button" aria-label="Поиск">
            <SearchIcon />
          </button>
        </div>

        <label className="tech-rating-top-checkbox">
          <input
            checked={showTop}
            type="checkbox"
            onChange={(event) => setShowTop(event.target.checked)}
          />
          <span>Топ-10</span>
        </label>

        <div className="tech-rating-table">
          <div className="tech-rating-row tech-rating-header tech-rating-teams-row">
            <div>Позиция</div>
            <div>Команда</div>
            <div>Лига</div>
            <div>Балл</div>
            <div></div>
          </div>

          {teamsToShow.map((item) => (
            <div className="tech-rating-row tech-rating-teams-row" key={item.id}>
              <div>{item.position ?? ''}</div>
              <div>{item.team}</div>
              <div>{item.league}</div>
              <div>{item.score}</div>
              <div>
                <button
                  className="tech-rating-edit-button"
                  type="button"
                  aria-label="Редактировать"
                >
                  <EditIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}