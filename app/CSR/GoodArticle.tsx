'use client';
import React from 'react';
import './goodArticle.css';
import type { ArticleType } from '../lib/types';
import { useCart } from './cartContext';
import { useRouter } from 'next/navigation';

export type ArticleProps = { article: ArticleType };

export default function GoodArticle({ article }: ArticleProps) {
  const router = useRouter();

  const goToArticle = () => {
    router.push(`article/${article.id}`);
  };

  // safe read and typed as string[]
  const colors = (article.options_options?.color ?? []) as string[];

  return (
    <article
      className="good_articleCard"
      role="link"
      tabIndex={0}
      onClick={goToArticle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToArticle();
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <img className="img" src={article.imgs[0]} alt={article.name} />

      {/* color dots */}
      <div style={{ marginTop: 8, marginLeft: 8}}>
        {colors.map((color: string, idx: number) => (
          <span
            key={idx}
            title={color}
            aria-label={color}
            style={{
              backgroundColor: color,        // pass the string value, not an object
              width: 17,
              height: 17,
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: 6,
              verticalAlign: 'middle',
              border: '1px solid #ccc'
            }}
          />
        ))}
      </div>

      <h2>{article.short_name}</h2>
    </article>
  );
}
