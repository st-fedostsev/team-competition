import React from 'react';
import '../../styles/Modal.css'; // Путь к стилям

interface ModalProps {
  closeModal: () => void; // Функция для закрытия окна
  children?: React.ReactNode; // Это позволяет передавать любой контент в модальное окно
}

export function Modal({ closeModal, children }: ModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Крестик для закрытия модального окна */}
        <button className="close-btn" onClick={closeModal}>
          &times;
        </button>
        {/* Контент модального окна */}
        <div className="modal-body">
          {children} {/* Этот контент будет передан через props */}
        </div>
      </div>
    </div>  
  );
}