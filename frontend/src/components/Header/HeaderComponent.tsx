import { useMemo, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications, useDismissNotification } from '../../hooks/useNotifications';
import '../../styles/TopMenu.css';

interface TabItem {
  label: string;
  path: string;
}

interface UserMenuItem {
  label: string;
  path?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

interface TopMenuProps {
  tabs: TabItem[];
  userMenuItems: UserMenuItem[];
  userAvatar?: string;
}

export function TopMenu({ tabs, userMenuItems, userAvatar }: TopMenuProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [activeNotificationMenuId, setActiveNotificationMenuId] = useState<number | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  // Получаем уведомления из API
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications();
  const { mutate: dismissNotification } = useDismissNotification();

  // Все уведомления из всех страниц
  const allNotifications = useMemo(() => {
  return data?.pages?.flatMap(page => page?.notifications || []) || [];
}, [data?.pages]);

  const unreadCount = useMemo(() => {
    return allNotifications.filter((notification) => !notification.dismissed).length;
  }, [allNotifications]);

  const filteredNotifications = useMemo(() => {
    if (showOnlyUnread) {
      return allNotifications.filter((notification) => !notification.dismissed);
    }
    return allNotifications;
  }, [allNotifications, showOnlyUnread]);

  // Загружаем следующие уведомления при скролле (если нужно)
  useEffect(() => {
    const handleScroll = () => {
      if (!isNotificationsOpen) return;
      const dropdown = document.querySelector('.notifications-dropdown');
      if (!dropdown) return;
      
      const { scrollTop, scrollHeight, clientHeight } = dropdown;
      if (scrollTop + clientHeight >= scrollHeight - 50 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    const dropdown = document.querySelector('.notifications-dropdown');
    if (dropdown) {
      dropdown.addEventListener('scroll', handleScroll);
      return () => dropdown.removeEventListener('scroll', handleScroll);
    }
  }, [isNotificationsOpen, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
  if (!isNotificationsOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setIsNotificationsOpen(false);
        setIsNotificationsMenuOpen(false);
        setActiveNotificationMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleMenuItemClick = (item: UserMenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
    setIsUserMenuOpen(false);
  };

  const handleBellClick = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsUserMenuOpen(false);
    setIsNotificationsMenuOpen(false);
    setActiveNotificationMenuId(null);
  };

  const handleUserButtonClick = () => {
    setIsUserMenuOpen((prev) => !prev);
    setIsNotificationsOpen(false);
    setIsNotificationsMenuOpen(false);
    setActiveNotificationMenuId(null);
  };

  const markAllAsRead = () => {
    // Массовое удаление всех уведомлений (если есть API)
    allNotifications.forEach(notification => {
      if (!notification.dismissed) {
        dismissNotification(notification.id);
      }
    });
    setIsNotificationsMenuOpen(false);
    setActiveNotificationMenuId(null);
  };

  const markNotificationAsRead = (notificationId: number) => {
    dismissNotification(notificationId);
    setActiveNotificationMenuId(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return `Сегодня ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `Вчера ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days < 7) {
      return `${days} дня назад`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="top-menu-container">
      <div className="top-menu">
        <div className="tabs">
          {tabs.map((tab) => (
            <Link key={tab.path} to={tab.path} className="tab">
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="user-settings">
          <div className="notifications-wrapper" ref={notificationsRef}>
            <button
              className={`bell-button ${isNotificationsOpen ? 'active' : ''}`}
              type="button"
              onClick={handleBellClick}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>

              {unreadCount > 0 && (
                <span className="bell-badge">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Уведомления</h3>

                  <div className="notifications-header-menu-wrapper">
                    <button
                      className="notifications-more-button"
                      type="button"
                      onClick={() => {
                        setIsNotificationsMenuOpen((prev) => !prev);
                        setActiveNotificationMenuId(null);
                      }}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </button>

                    {isNotificationsMenuOpen && (
                      <div className="notifications-header-menu">
                        <button type="button" onClick={markAllAsRead}>
                          Отметить все прочитанными
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="notifications-divider"></div>

                <label className="notifications-filter">
                  <input
                    type="checkbox"
                    checked={showOnlyUnread}
                    onChange={(event) => setShowOnlyUnread(event.target.checked)}
                  />

                  <span className="notifications-switch"></span>

                  <span className="notifications-filter-text">
                    Показать только непрочитанные
                  </span>
                </label>

                <div className="notifications-list">
                  {isLoading && allNotifications.length === 0 ? (
                    <div className="notifications-empty">Загрузка уведомлений...</div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="notifications-empty">
                      {showOnlyUnread ? 'Нет непрочитанных уведомлений' : 'Нет уведомлений'}
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          !notification.dismissed ? 'unread' : ''
                        } ${
                          activeNotificationMenuId === notification.id ? 'active' : ''
                        }`}
                      >
                        <div className="notification-status-dot"></div>

                        <div className="notification-icon">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7eadeb"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                          </svg>
                        </div>

                        <div className="notification-content">
                          <p className="notification-title">{notification.title}</p>
                          <p className="notification-body">{notification.body}</p>
                          <span className="notification-date">{formatDate(notification.created_at)}</span>
                        </div>

                        <div className="notification-item-menu-wrapper">
                          <button
                            className="notification-item-more-button"
                            type="button"
                            onClick={() => {
                              setActiveNotificationMenuId((prev) =>
                                prev === notification.id ? null : notification.id
                              );
                              setIsNotificationsMenuOpen(false);
                            }}
                          >
                            <span></span>
                            <span></span>
                            <span></span>
                          </button>

                          {activeNotificationMenuId === notification.id && (
                            <div className="notification-item-menu">
                              <button
                                type="button"
                                disabled={notification.dismissed}
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                {notification.dismissed
                                  ? 'Уже прочитано'
                                  : 'Отметить прочитанным'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {isFetchingNextPage && (
                    <div className="notifications-loading">Загрузка...</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="user-menu-wrapper" ref={userMenuRef}>
            <button
              className="user-button"
              type="button"
              onClick={handleUserButtonClick}
            >
              {userAvatar ? (
                <img src={userAvatar} alt="User" className="user-avatar" />
              ) : (
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="#333"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <defs>
                    <clipPath id="userCircleClip">
                      <circle cx="16" cy="16" r="15" />
                    </clipPath>
                  </defs>

                  <g clipPath="url(#userCircleClip)">
                    <circle cx="16" cy="11" r="5" />
                    <path d="M6 27c0-5.5 4.5-9 10-9s10 3.5 10 9" />
                  </g>

                  <circle cx="16" cy="16" r="15" />
                </svg>
              )}
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">
                {userMenuItems.map((item, index) =>
                  item.path ? (
                    <Link
                      key={index}
                      to={item.path}
                      className="user-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={index}
                      className="user-dropdown-item"
                      type="button"
                      onClick={() => handleMenuItemClick(item)}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}