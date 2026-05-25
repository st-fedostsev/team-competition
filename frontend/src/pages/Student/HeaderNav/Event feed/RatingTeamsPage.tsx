// pages/Student/HeaderNav/RatingTeamsPage.tsx

import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavRating } from '../../../../components/Nav/NavRating';
import { RATING_TABS } from '../../../../constants';
import '../../../../styles/RatingPage.css';

export function RatingTeamsPage() {
  return (
    <div className="rating-page">
      <HeaderStudent />

      <main className="rating-main">
        <div className="rating-switch">
          <NavRating tabs={RATING_TABS} />
        </div>

        <div className="rating-search">
          <input
            className="rating-search-input"
            placeholder="Введите команду или лигу"
          />
        </div>

        <label className="rating-top">
          <input type="checkbox" />
          <span>Топ-10</span>
        </label>

        <div className="rating-table">
          <div className="rating-row rating-header">
            <div>Позиция</div>
            <div>Команда</div>
            <div>Лига</div>
            <div>Балл</div>
          </div>

          <div className="rating-row">
            <div>1</div>
            <div>Название</div>
            <div>Название</div>
            <div>1</div>
          </div>

          <div className="rating-row">
            <div></div>
            <div>Название</div>
            <div>Название</div>
            <div>1</div>
          </div>

          <div className="rating-row">
            <div></div>
            <div>Название</div>
            <div>Название</div>
            <div>1</div>
          </div>
        </div>
      </main>
    </div>
  );
}