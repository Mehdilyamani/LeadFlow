// app/CSR/CartUI.tsx
'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './cartContext';
import './cartUI.css'; // ensure the styles we created earlier are loaded

export default function CartUI() {
  const { cart, isOpen, close, openShipping } = useCart();
  const router = useRouter();

  // ref to the drawer DOM node
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // helper to run closing animation then call close()
  const closeWithAnimation = (after?: () => void) => {
    const el = drawerRef.current;
    if (!el) {
      // fallback: if no ref, just close immediately and call callback
      close();
      if (after) after();
      return;
    }

    if (isClosing) return; // prevent double-trigger
    setIsClosing(true);
    el.classList.add('closing');

    const onEnd = () => {
      el.removeEventListener('animationend', onEnd);
      setIsClosing(false);
      // finally call the context close() which will unmount the drawer
      close();
      // then run the optional callback (navigate / open shipping etc.)
      if (after) after();
    };

    el.addEventListener('animationend', onEnd);
  };

  if (!isOpen) return null;

  return (
    <div className='CartUI' ref={drawerRef}>
      <button
        onClick={() => closeWithAnimation()}
        className='close'
        aria-label="Close cart"
      >
        ×
      </button>
      <h2 className='title' style={{fontSize:"1.5em"}}>Your Bag</h2>

      {(!cart || cart.length === 0) ? (
        <p style={{ color: 'black', textAlign: 'center' }}>Your bag is empty.</p>
      ) : (
        <>
          <ul className='the_ul'>
            {cart.map((item: any, index: number) => {
              // parse options safely (handle stringified JSON or object)
              let opts: Record<string, any> = {};
              try {
                if (typeof item.options === 'string') {
                  opts = JSON.parse(item.options);
                } else if (typeof item.options === 'object' && item.options !== null) {
                  opts = item.options;
                }
              } catch (err) {
                opts = {};
              }

              // determine quantity (prefer options.quantity, fallback to item.quantity/qty, default 1)
              const rawQty = opts?.quantity ?? item?.quantity ?? item?.qty ?? 1;
              const qtyNum = Number(rawQty);
              const qty = Number.isFinite(qtyNum) && qtyNum > 0 ? qtyNum : 1;

              const priceNum = Number(item?.price ?? 0);
              const itemTotal = (Number.isFinite(priceNum) ? priceNum : 0) * qty;

              return (
                <li key={index} className='list'>
                  <div className='item-div'>
                    {/* short name */}
                    <span style={{ fontWeight: 700 }}>{item.short_name ?? item.name}</span>

                    {/* selected options */}
                    <div style={{ marginTop: 6 }}>
                      {Object.entries(opts).length === 0 ? (
                        <div style={{ fontSize: '0.9rem', color: 'black' }}>No options</div>
                      ) : (
                        Object.entries(opts).map(([k, v]: [string, any]) => (
                          <div key={k} style={{ fontSize: '0.9rem', color: 'black' }}>
                            <strong style={{ textTransform: 'capitalize' }}>{k}:</strong> {String(v)}
                          </div>
                        ))
                      )}
                    </div>

                    {/* total for this item */}
                    <div style={{ marginTop: 6, fontWeight: 700 }}>
                      ${itemTotal.toFixed(2)}
                    </div>
                  </div>

                  {/* view button (kept on the right via inline style) */}
                  <button
                    className='view'
                    style={{ order: 0 }}
                    onClick={() => {
                      // animate close, then navigate
                      closeWithAnimation(() => {
                        router.push(`/article/${item.id}`);
                      });
                    }}
                  >
                    View
                  </button>

                  <hr />
                </li>
              );
            })}
          </ul>

          {/* Confirm button: closes cart drawer and opens shipping modal */}
          <div className='confirm_div'>
            <button
              onClick={() => {
                // animate close, then open shipping modal
                closeWithAnimation(() => {
                  openShipping();
                });
              }}
              className='confirm'
            >
              Confirm
            </button>
          </div>
        </>
      )}
    </div>
  );
}
