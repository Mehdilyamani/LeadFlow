'use client';
import React from 'react';

export default function NotificationButton() {
  const handleClick = async () => {
    try {
      const payload = {
        message: 'Daily sales: 3 orders, revenue: $120',
        name: 'Mehdi',
      };

      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (!res.ok) {
        alert(`Error: ${res.status} - ${text}`);
        return;
      }

      alert('WhatsApp message triggered! Check n8n logs.');
    } catch (err) {
      console.error(err);
      alert('Error triggering webhook, see console');
    }
  };

  return <button onClick={handleClick}>Notify</button>;
}
