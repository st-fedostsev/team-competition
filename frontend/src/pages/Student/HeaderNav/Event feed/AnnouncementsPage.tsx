import React from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavLenta } from '../../../../components/Nav/NavEvents';
import '../../../../styles/LentaPage.css';
import { TABS } from '../../../../constants';

interface Announcement {
  id: number;
  title: string;
  description: string;
}

const mockAnnouncements: Announcement[] = [
  { id: 1, title: 'Название анонса', description: 'Описание' },
  { id: 2, title: 'Название анонса', description: 'Описание' },
];

export function AnnouncementsPage() {
  return (
    <div className="announcements-container">
      <HeaderStudent />
      <div className="announcements-content">
        <div className="announcements-header">
          <NavLenta tabs={TABS} />
        </div>
        <div className="announcements-list">
          {mockAnnouncements.map((announcement) => (
            <div key={announcement.id} className="announcements-card">
              <p className="announcements-card-title">{announcement.title}</p>
              <p className="announcements-card-description">{announcement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
