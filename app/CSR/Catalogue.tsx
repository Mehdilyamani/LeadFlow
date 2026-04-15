import React from 'react';
import styles from './Catalogue.module.css';

type Props = { title?: string };

export default function CatalogHeader({ title = 'Our Catalogue' }: Props) {
  return (
    <header className={styles.header} role="banner" aria-label="Catalog heading">
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.lineWrap} aria-hidden="true">
        <span className={styles.line} />
      </div>
    </header>
  );
}
