import React from 'react';
import Link from '@docusaurus/Link';
import TopicTag from '@site/src/components/TopicTag';
import styles from './styles.module.css';

export default function JournalCard({ entry }) {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        {entry.date && <time>{entry.date}</time>}
        <span className={styles.type}>{entry.type}</span>
        {entry.projectTitle && <span>{entry.projectTitle}</span>}
      </div>
      <h3 className={styles.title}>
        <Link to={entry.permalink}>{entry.title}</Link>
      </h3>
      <p className={styles.description}>{entry.description}</p>
      {entry.topics.length > 0 && (
        <div className={styles.topics}>
          {entry.topics.map((slug) => (
            <TopicTag key={slug} slug={slug} />
          ))}
        </div>
      )}
    </article>
  );
}
