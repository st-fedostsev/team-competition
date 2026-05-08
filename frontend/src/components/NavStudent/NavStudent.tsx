import React, { useState } from 'react';
import '../../styles/NavStudent.css';

export function NavStudent() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'rating'>('achievements');

  return (
    <div className="nav-student-container">
      <div className="nav">
        <button
          className={`student-nav-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Достижения
        </button>

        <button
          className={`student-nav-button ${activeTab === 'rating' ? 'active' : ''}`}
          onClick={() => setActiveTab('rating')}
        >
          Рейтинг
        </button>
      </div>
    </div>
  );
}