import React from 'react';
import Link from '@docusaurus/Link';
import { useContentModel } from '@site/src/lib/content-model';
import styles from './styles.module.css';

function formatDate(date) {
  if (!date) {
    return '';
  }
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatJournalType(type) {
  return type ? type.replace(/-/g, ' ').toUpperCase() : '';
}

export default function JournalRow({ entry }) {
  const { topics } = useContentModel();
  const topicLabels = entry.topics.map(
    (slug) => topics.find((topic) => topic.slug === slug)?.label ?? slug,
  );

  return (
    <article className={styles.row}>
      <p className={styles.meta}>
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
        <span className={styles.separator} aria-hidden="true">
          ·
        </span>
        <span className={styles.type}>{formatJournalType(entry.type)}</span>
      </p>
      <h3 className={styles.title}>
        <Link to={entry.permalink}>{entry.title}</Link>
      </h3>
      <p className={styles.description}>{entry.description}</p>
      {(entry.projectTitle || topicLabels.length > 0) && (
        <p className={styles.context}>
          {entry.projectTitle}
          {entry.projectTitle && topicLabels.length > 0 && ' · '}
          {topicLabels.join(', ')}
        </p>
      )}
    </article>
  );
}
