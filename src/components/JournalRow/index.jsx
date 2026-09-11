import React from 'react';
import Link from '@docusaurus/Link';
import { useContentModel } from '@site/src/lib/content-model';
import styles from './styles.module.css';

export default function JournalRow({ entry }) {
  const { topics } = useContentModel();
  const topicLabels = entry.topics.map(
    (slug) => topics.find((topic) => topic.slug === slug)?.label ?? slug,
  );

  return (
    <article className={styles.row}>
      <p className={styles.meta}>
        <time>{entry.date}</time>
        <span className={styles.separator} aria-hidden="true">
          ·
        </span>
        <span className={styles.type}>{entry.type}</span>
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
