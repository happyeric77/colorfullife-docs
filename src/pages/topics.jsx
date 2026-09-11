import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useContentModel } from '@site/src/lib/content-model';
import styles from './topics.module.css';

export default function Topics() {
  const { topics } = useContentModel();

  return (
    <Layout
      title="Topics"
      description="Technologies and concepts across Eric Lee's projects and journal entries."
    >
      <main className={styles.page}>
        <div className="container">
          <header className={styles.header} data-reveal>
            <p className={styles.eyebrow}>Index</p>
            <h1 className={styles.title}>Topics</h1>
            <p className={styles.subtitle}>
              Technologies and concepts connecting projects and journal entries.
            </p>
          </header>

          {topics.length === 0 ? (
            <p className={styles.empty}>No topics yet.</p>
          ) : (
            <div className={styles.list}>
              {topics.map((topic) => (
                <section
                  key={topic.slug}
                  id={topic.slug}
                  className={styles.topic}
                  data-reveal
                >
                  <h2 className={styles.topicTitle}>{topic.label}</h2>
                  <p className={styles.counts}>
                    {topic.projects.length}{' '}
                    {topic.projects.length === 1 ? 'project' : 'projects'} ·{' '}
                    {topic.journal.length}{' '}
                    {topic.journal.length === 1
                      ? 'journal entry'
                      : 'journal entries'}
                  </p>
                  <ul className={styles.links}>
                    {topic.projects.map((project) => (
                      <li key={project.permalink}>
                        <Link to={project.permalink}>{project.title}</Link>
                      </li>
                    ))}
                    {topic.journal.map((entry) => (
                      <li key={entry.permalink}>
                        <Link to={entry.permalink}>{entry.title}</Link>
                        {entry.date && (
                          <span className={styles.date}>{entry.date}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
