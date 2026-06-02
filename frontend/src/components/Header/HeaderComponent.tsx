import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

interface NotificationItem {
  id: number;
  text: string;
  date: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    text: 'Привет! Урок "Практика. Олимпиадные задачи. Задания 18, 19" прошёл без тебя сегодня. Там было интересно! Сможешь глянуть запись вечером?',
    date: 'Вчера 15:00',
    isRead: false,
  },
  {
    id: 2,
    text: 'Срок сдачи ДЗ по уроку "Практика. Банк. Задание 16" уже близко, а твоя работа еще в пути. Садись сегодня вечером и сделай — мы верим в тебя. Напиши, если что-то непонятно — поможем.',
    date: 'Вчера 08:00',
    isRead: false,
  },
  {
    id: 3,
    text: 'Привет! Урок "Теория. Олимпиадные задачи. Задания 18, 19" прошёл без тебя сегодня. Там было интересно! Сможешь глянуть запись вечером?',
    date: '31 мая 06:00',
    isRead: false,
  },
  {
    id: 4,
    text: 'Привет! Урок "Практика. Банк. Задание 16" прошёл без тебя сегодня. Там было интересно! Сможешь глянуть запись вечером?',
    date: '28 мая 18:00',
    isRead: true,
  },
];

export function TopMenu({ tabs, userMenuItems, userAvatar }: TopMenuProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [activeNotificationMenuId, setActiveNotificationMenuId] = useState<number | null>(null);

  const navigate = useNavigate();

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (showOnlyUnread) {
      return notifications.filter((notification) => !notification.isRead);
    }

    return notifications;
  }, [notifications, showOnlyUnread]);

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
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );

    setIsNotificationsMenuOpen(false);
    setActiveNotificationMenuId(null);
  };

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      )
    );

    setActiveNotificationMenuId(null);
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
          <div className="notifications-wrapper">
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
                  {filteredNotifications.length === 0 ? (
                    <div className="notifications-empty">
                      Нет уведомлений
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          !notification.isRead ? 'unread' : ''
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
                          <p>{notification.text}</p>
                          <span>{notification.date}</span>
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
                                disabled={notification.isRead}
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                {notification.isRead
                                  ? 'Уже прочитано'
                                  : 'Отметить прочитанным'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="user-menu-wrapper">
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