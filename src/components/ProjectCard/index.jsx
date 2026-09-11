import React from 'react';
import Link from '@docusaurus/Link';
import TopicTag from '@site/src/components/TopicTag';
import styles from './styles.module.css';

export default function ProjectCard({ project }) {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.status}>{project.status}</span>
        <span>{project.type}</span>
      </div>
      <h3 className={styles.title}>
        <Link to={project.permalink}>{project.title}</Link>
      </h3>
      <p className={styles.description}>{project.description}</p>
      {project.stack.length > 0 && (
        <ul className={styles.stack}>
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {project.topics.length > 0 && (
        <div className={styles.topics}>
          {project.topics.map((slug) => (
            <TopicTag key={slug} slug={slug} />
          ))}
        </div>
      )}
    </article>
  );
}
