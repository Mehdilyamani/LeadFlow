'use client';
import React from 'react';
import { useCart } from './cartContext';


export default function Buy() {
  const { toggle } = useCart();
  return (
    <button onClick={toggle} style={{ marginLeft: '1rem' }}>
      Buy
    </button>
  );
}
