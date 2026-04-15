'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  email?: string;
  id?: string;
  // any other fields you use
};

type UserContextType = {
  user: User;
  setUser: (u: User) => void;
  shippingVisible: boolean;
  showShipping: () => void;
  hideShipping: () => void;
  toggleShipping: () => void;
  refresh: () => Promise<void>;
};

const defaultUser: User = { name: 'guest' };

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(defaultUser);
  const [shippingVisible, setShippingVisible] = useState(false);
  const router = useRouter();

  // read initial user from localStorage or from API
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        // try localStorage first (fast)
        const fromLs = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
        if (fromLs) {
          const parsed = JSON.parse(fromLs);
          if (mounted && parsed?.name) {
            setUserState(parsed);
          }
        }
        // then try to fetch authoritative value from server
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          if (mounted && data?.name) {
            setUserState(data);
            // persist locally for faster subsequent loads
            try { localStorage.setItem('currentUser', JSON.stringify(data)); } catch {}
          }
        }
      } catch (err) {
        console.warn('could not fetch /api/me', err);
      }
    };
    init();
    return () => { mounted = false; };
  }, [router]);

  const setUser = (u: User) => {
    setUserState(u);
    try { localStorage.setItem('currentUser', JSON.stringify(u)); } catch {}
  };

  const showShipping = () => setShippingVisible(true);
  const hideShipping = () => setShippingVisible(false);
  const toggleShipping = () => setShippingVisible((s) => !s);

  const refresh = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        setUserState(data);
        try { localStorage.setItem('currentUser', JSON.stringify(data)); } catch {}
      }
    } catch (e) {
      console.warn('refresh user failed', e);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, shippingVisible, showShipping, hideShipping, toggleShipping, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
