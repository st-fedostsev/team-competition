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
    <div className="nav-student-outer">
      <div className="nav-student-container">

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
                              <div className="achievement-icon">
                                    <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M37.1937 24.3011C40.078 17.1108 41.5201 13.5156 43.9999 13.5156C46.4798 13.5156 47.9219 17.1108 50.8061 24.3011L50.9404 24.6359C52.5699 28.6981 53.3846 30.7292 55.045 31.9637C56.7055 33.1983 58.8852 33.3935 63.2445 33.7839L64.0326 33.8545C71.1673 34.4934 74.7346 34.8129 75.4979 37.0825C76.2612 39.3521 73.612 41.7624 68.3135 46.5829L66.5451 48.1917C63.8629 50.632 62.5219 51.8521 61.8968 53.4512C61.7802 53.7495 61.6833 54.0552 61.6066 54.3661C61.1957 56.0332 61.5885 57.8032 62.3739 61.3433L62.6184 62.4452C64.0618 68.9511 64.7836 72.204 63.5234 73.6071C63.0525 74.1315 62.4405 74.5089 61.7607 74.6945C59.9413 75.1909 57.3582 73.0861 52.192 68.8764C48.7997 66.1122 47.1036 64.73 45.1562 64.4191C44.3902 64.2968 43.6097 64.2968 42.8437 64.4191C40.8963 64.73 39.2001 66.1122 35.8078 68.8764C30.6417 73.0861 28.0586 75.1909 26.2392 74.6945C25.5593 74.5089 24.9473 74.1315 24.4765 73.6071C23.2163 72.204 23.938 68.9511 25.3815 62.4452L25.626 61.3433C26.4114 57.8032 26.8041 56.0332 26.3933 54.3661C26.3166 54.0552 26.2197 53.7495 26.1031 53.4512C25.478 51.8521 24.1369 50.632 21.4547 48.1917L19.6864 46.5829C14.3879 41.7624 11.7386 39.3521 12.5019 37.0825C13.2653 34.8129 16.8326 34.4934 23.9672 33.8545L24.7553 33.7839C29.1147 33.3935 31.2944 33.1983 32.9548 31.9637C34.6153 30.7292 35.43 28.6981 37.0594 24.6359L37.1937 24.3011Z" fill="#FFD675" stroke="#FFD675" />
                                      <path d="M53.375 63.7083H34.625" stroke="#33363F" strokeLinecap="round" /><path d="M44.5 59.5417C44.5 59.8179 44.2761 60.0417 44 60.0417C43.7239 60.0417 43.5 59.8179 43.5 59.5417H44H44.5ZM44 59.5417H43.5V54.3334H44H44.5V59.5417H44Z" fill="#33363F" /><path d="M40.875 40.7917H47.125" stroke="#33363F" strokeLinecap="round" />
                                      <path d="M30.4584 51.2084C30.4584 51.2084 26.2917 48.0834 26.2917 42.8751C26.2917 41.2043 26.2917 39.748 26.2917 38.5404C26.2917 36.6557 26.2917 35.7133 26.8775 35.1275C27.4633 34.5417 28.4061 34.5417 30.2917 34.5417H30.6251C32.5107 34.5417 33.4535 34.5417 34.0393 35.1275C34.6251 35.7133 34.6251 36.6561 34.6251 38.5417V40.7917" stroke="#33363F" strokeLinecap="round" /><path d="M57.5416 51.2084C57.5416 51.2084 61.7083 48.0834 61.7083 42.8751C61.7083 41.2043 61.7083 39.748 61.7083 38.5404C61.7083 36.6557 61.7083 35.7133 61.1225 35.1275C60.5367 34.5417 59.5939 34.5417 57.7083 34.5417H57.3749C55.4893 34.5417 54.5465 34.5417 53.9607 35.1275C53.3749 35.7133 53.3749 36.6561 53.3749 38.5417V40.7917" stroke="#33363F" strokeLinecap="round" /><path d="M53.375 46.9842V34.4583C53.375 33.3537 52.4796 32.4583 51.375 32.4583H36.625C35.5204 32.4583 34.625 33.3537 34.625 34.4583V46.9842C34.625 48.3216 35.2934 49.5705 36.4062 50.3124L43.4453 55.0051C43.7812 55.229 44.2188 55.229 44.5547 55.0051L51.5938 50.3124C52.7066 49.5705 53.375 48.3216 53.375 46.9842Z" stroke="#33363F" />
                                    </svg>
                              </div>
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
                              <div className="achievement-icon">
                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M34.375 42.7083H15.625" stroke="#33363F" strokeLinecap="round" />
                                  <path d="M25.5 38.5417C25.5 38.8179 25.2761 39.0417 25 39.0417C24.7239 39.0417 24.5 38.8179 24.5 38.5417H25H25.5ZM25 38.5417H24.5V33.3334H25H25.5V38.5417H25Z" fill="#33363F" />
                                  <path d="M21.875 19.7917H28.125" stroke="#33363F" strokeLinecap="round" />
                                  <path d="M11.4584 30.2084C11.4584 30.2084 7.29175 27.0834 7.29175 21.8751C7.29175 20.2043 7.29175 18.748 7.29175 17.5404C7.29175 15.6557 7.29175 14.7133 7.87753 14.1275C8.46332 13.5417 9.40613 13.5417 11.2917 13.5417H11.6251C13.5107 13.5417 14.4535 13.5417 15.0393 14.1275C15.6251 14.7133 15.6251 15.6561 15.6251 17.5417V19.7917" stroke="#33363F" strokeLinecap="round" />
                                  <path d="M38.5416 30.2084C38.5416 30.2084 42.7083 27.0834 42.7083 21.8751C42.7083 20.2043 42.7083 18.748 42.7083 17.5404C42.7083 15.6557 42.7083 14.7133 42.1225 14.1275C41.5367 13.5417 40.5939 13.5417 38.7083 13.5417H38.3749C36.4893 13.5417 35.5465 13.5417 34.9607 14.1275C34.3749 14.7133 34.3749 15.6561 34.3749 17.5417V19.7917" stroke="#33363F" strokeLinecap="round" />
                                  <path d="M34.375 25.9842V13.4583C34.375 12.3537 33.4796 11.4583 32.375 11.4583H17.625C16.5204 11.4583 15.625 12.3537 15.625 13.4583V25.9842C15.625 27.3216 16.2934 28.5705 17.4062 29.3124L24.4453 34.0051C24.7812 34.229 25.2188 34.229 25.5547 34.0051L32.5938 29.3124C33.7066 28.5705 34.375 27.3216 34.375 25.9842Z" stroke="#33363F" />
                                </svg>
                              </div>
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
              <div className="reiting-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFD675" strokeWidth="2" strokeLinecap="round" style={{marginRight: 6, verticalAlign: 'middle'}}>
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span>Позиция</span>
            </div>
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
    </div>
  );
}