import type { ReactNode } from 'react';
import '../styles/SearchContentModal.css';

interface SearchContentModalProps {
  closeModal: () => void;
  children: ReactNode;
}

export function SearchContentModal({
  closeModal,
  children,
}: SearchContentModalProps) {
  return (
    <div className="content-modal-overlay" onClick={closeModal}>
      <div
        className="search-content-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="search-content-close-btn"
          type="button"
          onClick={closeModal}
        >
          ⊗
        </button>

        {children}
      </div>
    </div>
  );
}