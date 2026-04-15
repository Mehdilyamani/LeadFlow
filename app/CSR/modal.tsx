'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  children: React.ReactNode;
  onClose?: () => void;
  closeOnBackdrop?: boolean; // allow outside click to close
  ariaLabel?: string;
};

export default function Modal({ children, onClose, closeOnBackdrop = true, ariaLabel = 'Modal' }: ModalProps) {
  useEffect(() => {
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  // create portal root if not present (safe)
  let root = document.getElementById('__modal_root');
  if (!root) {
    root = document.createElement('div');
    root.id = '__modal_root';
    document.body.appendChild(root);
  }

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onClick={() => { if (closeOnBackdrop) onClose?.(); }}
      />

      {/* panel */}
      <div
        className="relative z-10 max-w-lg w-full mx-4 bg-white rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(content, root);
}
