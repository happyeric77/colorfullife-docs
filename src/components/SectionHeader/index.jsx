import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function SectionHeader({
  title,
  subtitle,
  to,
  actionLabel,
}) {
  return (
    <div className={styles.header}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {to && actionLabel && (
        <Link className={styles.action} to={to}>
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
