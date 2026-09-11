import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  to,
  actionLabel,
}) {
  return (
    <div className={styles.header}>
      <div className={styles.heading}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <span className={styles.rule} aria-hidden="true" />
      {to && actionLabel && (
        <Link className={styles.action} to={to}>
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
