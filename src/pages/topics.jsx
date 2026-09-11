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
      description="Technologies and concepts across ColorfulLife projects and journal entries."
    >
      <main className="container margin-vert--lg">
        <h1>Topics</h1>
        <p>
          Technologies and concepts that show up across projects and journal
          entries. Topics are a discovery path, not a category: one topic can
          connect many unrelated projects.
        </p>

        {topics.length === 0 && <p>No topics yet.</p>}

        {topics.map((topic) => (
          <section key={topic.slug} id={topic.slug} className={styles.topic}>
            <h2 className={styles.title}>{topic.label}</h2>
            <p className={styles.counts}>
              {topic.projects.length}{' '}
              {topic.projects.length === 1 ? 'project' : 'projects'} ·{' '}
              {topic.journal.length}{' '}
              {topic.journal.length === 1 ? 'journal entry' : 'journal entries'}
            </p>
            {(topic.projects.length > 0 || topic.journal.length > 0) && (
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
                      <span className={styles.date}> — {entry.date}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </main>
    </Layout>
  );
}
