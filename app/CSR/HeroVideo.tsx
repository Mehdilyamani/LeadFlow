'use client';
import React, { useRef, useEffect } from 'react';

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

export default function HeroVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.play().catch(() => {});
    }
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}