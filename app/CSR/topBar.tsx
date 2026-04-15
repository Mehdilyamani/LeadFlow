'use client';

import React from 'react';
import { useUser } from './userProvider';

export default function Topbar() {
  const { user, toggleShipping, showShipping } = useUser();

   const handleClick = () => {
   if (!user || user.name === 'guest') {
    showShipping(); // open modal (no navigation, no scroll)
    return;
   }
    toggleShipping(); // for signed-in users
  };

  return (
    <div className="navbar" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className="nav-left" />
      <img
        src="/Ever_Shaw.jpg"
        className="logo"
        alt="Logo"
        style={{ height: '35px', width: 'auto' }}
      />
      <div style={{ marginLeft: 'auto' }}>
        {user && user.name !== 'guest' ? (
          <button
            className="Signup signed-in"
            onClick={handleClick}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              background: '#1f6feb',
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            }}
            title={`Signed in as ${user.name}`}
          >
            {user.name}
          </button>
        ) : (
          <button
            className="Signup"
            onClick={handleClick}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              background: 'transparent',
              border: '1px solid #ddd',
            }}
          >
            Sign Up
          </button>
        )}
      </div>
    </div>
  );
}
