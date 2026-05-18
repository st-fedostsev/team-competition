import React from 'react';
import { TopMenu } from '../components/TopMenu/TopMenu';
import { NavLenta } from '../components/NavLenta/NavLenta';
import { CreateEventButton } from '../components/Button/Button';
import '../styles/LentaPage.css';

interface Event {
  id: number;
  title: string;
  description: string;
}

const mockEvents: Event[] = [
  { id: 1, title: 'Название мероприятия', description: 'Описание' },
  { id: 2, title: 'Название мероприятия', description: 'Описание' },
];

export function LentaPage() {
  return (
    <div className="lenta-container">
      <TopMenu />

      <div className="lenta-content">
        <div className="lenta-header">
          <NavLenta />
          <CreateEventButton />
        </div>

        <div className="lenta-list">
          {mockEvents.map((event) => (
            <div key={event.id} className="lenta-card">
              <p className="lenta-card-title">{event.title}</p>
              <p className="lenta-card-description">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
