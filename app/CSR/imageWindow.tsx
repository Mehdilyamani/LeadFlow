'use client';

import React, { useEffect, useRef, useState } from 'react';

type ImageWindowProps = {
  images: string[];           // array of strings pointing to files in /public, e.g. "/img1.jpg"
  initialIndex?: number;
  className?: string;
  showThumbnails?: boolean;
};

export default function ImageWindow({
  images,
  initialIndex = 0,
  className = '',
  showThumbnails = true,
}: ImageWindowProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(initialIndex);
  const total = images?.length || 0;
  const containerRef = useRef<HTMLDivElement | null>(null);

  // keep index in bounds when initialIndex or images change
  useEffect(() => {
    setIndex(() => Math.max(0, Math.min(initialIndex, total - 1)));
  }, [initialIndex, total]);

  // helpers
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);
  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  // keyboard shortcuts for lightbox
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, total]);

  // preload neighbors
  useEffect(() => {
    if (!images || images.length === 0) return;
    if (images[index + 1]) new Image().src = images[index + 1];
    if (images[index - 1]) new Image().src = images[index - 1];
  }, [index, images]);

  if (!images || images.length === 0) {
    return (
      <div className={`rounded-xl border border-gray-200 p-6 text-center ${className}`}>
        <p className="text-sm text-gray-500">No images to display.</p>
      </div>
    );
  }

  // simple alt text derived from filename for accessibility
  const altFrom = (src: string, i: number) => {
    const name = src.split('/').pop() ?? `image-${i + 1}`;
    return name.replace(/[-_0-9]+/g, ' ').replace(/\.\w+$/, '').trim() || `Image ${i + 1}`;
  };

  return (
    <div className={`image-window ${className}`}>
      {/* thumbnails grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => openAt(i)}
            className="relative overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-200 focus:outline-none"
            aria-label={`Open image ${i + 1}`}
          >
            <img
              src={src}
              alt={altFrom(src, i)}
              className="w-full h-40 object-cover transform hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={containerRef}
            className="relative max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ minHeight: 420 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-3 border-b">
              <div className="text-sm text-gray-600">
                {index + 1} / {total}
              </div>
              <div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="relative bg-black/90 flex items-center justify-center p-4">
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none"
                aria-label="Previous"
              >
                ‹
              </button>

              <img
                src={images[index]}
                alt={altFrom(images[index], index)}
                className="max-h-[70vh] object-contain transition-opacity duration-200"
                draggable={false}
              />

              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none"
                aria-label="Next"
              >
                ›
              </button>
            </div>

            {showThumbnails && (
              <div className="p-3">
                <div className="flex gap-2 overflow-x-auto py-1">
                  {images.map((src, i) => (
                    <button
                      key={`thumb-${i}-${src}`}
                      onClick={() => setIndex(i)}
                      className={`flex-shrink-0 rounded-md overflow-hidden border-2 ${i === index ? 'border-indigo-500' : 'border-transparent'} focus:outline-none`}
                      aria-label={`Show image ${i + 1}`}
                    >
                      <img src={src} alt={altFrom(src, i)} className="h-16 w-24 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
