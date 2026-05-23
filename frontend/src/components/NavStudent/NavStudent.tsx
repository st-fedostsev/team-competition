import { useState } from 'react';
import { useAchievementsWithStatus } from '../../hooks/useAchievements';
import { useUserRatingPosition } from '../../hooks/useRating';
import { useCurrentUser } from '../../hooks/useAuth';
import '../../styles/NavStudent.css';

export function NavStudent() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'rating'>('achievements');
  
  // Получаем достижения
  const { data: achievements, isLoading: achievementsLoading } = useAchievementsWithStatus();
  
  // Получаем рейтинг и позицию пользователя
  const { position, total, rating, isLoading: ratingLoading } = useUserRatingPosition();
  const { data: user } = useCurrentUser();

  const receivedAchievements = achievements?.filter(a => a.is_received) || [];
  const notReceivedAchievements = achievements?.filter(a => !a.is_received) || [];

  return (
    <div className="nav-student-container">
      {/* Навигация */}
      <div className="nav">
        <div
          className={`student-nav-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Достижения
        </div>

        <div
          className={`student-nav-button ${activeTab === 'rating' ? 'active' : ''}`}
          onClick={() => setActiveTab('rating')}
        >
          Рейтинг
        </div>
      </div>

      {/* Достижения */}
      {activeTab === 'achievements' && (
        <div className="achievements-wrapper">
          <div className="achievements-container">
            {achievementsLoading ? (
              <div className="loading">Загрузка достижений...</div>
            ) : (
              <>
                {/* Полученные достижения */}
                {receivedAchievements.length > 0 && (
                  <>
                    <ul className="achievements-list">
                      {receivedAchievements.map((achievement) => (
                        <li key={achievement.key} className="achievement-card received">
                          <div className="achievement-left">
                            <div className="achievement-icon">🏆</div>
                            <div className="achievement-info">
                              <div className="achievement-title">{achievement.title}</div>
                              <div className="achievement-description">{achievement.description}</div>
                            </div>
                          </div>
                          <div className="achievement-right">
                            <div className="achievement-status">Получено</div>
                            <div className="achievement-date">{achievement.earned_at_formatted}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Доступные достижения */}
                {notReceivedAchievements.length > 0 && (
                  <>
                    <ul className="achievements-list">
                      {notReceivedAchievements.map((achievement) => (
                        <li key={achievement.key} className="achievement-card">
                          <div className="achievement-left">
                            <div className="achievement-icon">🏆</div>
                            <div className="achievement-info">
                              <div className="achievement-title">{achievement.title}</div>
                              <div className="achievement-description">{achievement.description}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {achievements?.length === 0 && (
                  <div className="empty">Нет достижений</div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Рейтинг */}
{activeTab === 'rating' && (
  <div className="raiting-card">
    <div className="reiting-position">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFD675" strokeWidth="2" strokeLinecap="round" style={{marginRight: 6, verticalAlign: 'middle'}}>
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
      Позиция
      {ratingLoading ? (
        <p className="reiting-value">Загрузка...</p>
      ) : position ? (
        <p className="reiting-value">{position}/{total}</p>
      ) : (
        <p className="reiting-value">—</p>
      )}
    </div>
    <div className="reiting-divider" />
    <div className="reiting-number">
      <span className="reiting-label">Средний балл</span>
      {ratingLoading ? (
        <p className="reiting-value">Загрузка...</p>
      ) : (rating || user?.personal_rating) ? (
        <p className="reiting-value">{rating || user?.personal_rating}</p>
      ) : (
        <p className="reiting-value">—</p>
      )}
    </div>
  </div>
)}
    </div>
  );
}