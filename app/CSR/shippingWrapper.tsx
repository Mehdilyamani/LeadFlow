// app/CSR/ShippingModalWrapper.tsx
'use client';
import React from 'react';
import { useCart } from './cartContext';
import { CartProvider } from './cartContext';
import CheckoutStep from './FinalStep'
import './shippingModal.css';


export default function ShippingModalWrapper() {
  const { shippingOpen, closeShipping } = useCart();

  if (!shippingOpen) return null;

  return (
    <div className="shipping-overlay" onMouseDown={closeShipping} role="dialog" aria-modal="true">
      <div className="shipping-panel" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-closebtn" onClick={closeShipping} aria-label="Close">✕</button>
        <CheckoutStep/>
      </div>
    </div>
  );
}
