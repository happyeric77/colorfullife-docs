import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { useContentModel } from '@site/src/lib/content-model';
import { groups, repositories } from '@site/src/data/opensource';
import styles from './opensource.module.css';

function RepoMeta({ repo }) {
  const { projects } = useContentModel();
  const related = repo.relatedProject
    ? projects.find((project) => project.id === repo.relatedProject)
    : undefined;
  const basics = [repo.language, repo.license].filter(Boolean).join(' · ');

  if (!basics && !related) {
    return null;
  }

  return (
    <p className={styles.meta}>
      {basics}
      {basics && related && <span aria-hidden="true"> · </span>}
      {related && (
        <Link to={related.permalink}>
          {related.title} <span aria-hidden="true">→</span>
        </Link>
      )}
    </p>
  );
}

function RepoRow({ repo }) {
  return (
    <div className={styles.row}>
      <h3 className={styles.rowTitle}>
        <a
          href={repo.repository}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${repo.name} on GitHub`}
        >
          {repo.name} <span aria-hidden="true">↗</span>
        </a>
      </h3>
      <p className={styles.rowDescription}>{repo.description}</p>
      <RepoMeta repo={repo} />
    </div>
  );
}

export default function OpenSourcePage() {
  return (
    <Layout
      title="Open Source"
      description="Small tools, integrations and libraries built out of real engineering work."
    >
      <main className={styles.page}>
        <div className="container">
          <header className={styles.header} data-reveal>
            <p className={styles.eyebrow}>Open Source</p>
            <h1 className={styles.title}>
              Small tools, integrations and libraries built out of real
              engineering work.
            </h1>
          </header>

          {groups.map((group) => (
            <section key={group.id} className={styles.section} data-reveal>
              <h2 className={styles.sectionTitle}>{group.label}</h2>
              <div className={styles.rows}>
                {repositories
                  .filter((repo) => repo.group === group.id)
                  .map((repo) => (
                    <RepoRow key={repo.name} repo={repo} />
                  ))}
              </div>
            </section>
          ))}

          <p className={styles.more}>
            <a
              href="https://github.com/happyeric77"
              target="_blank"
              rel="noreferrer noopener"
            >
              More repositories on GitHub <span aria-hidden="true">↗</span>
            </a>
          </p>
        </div>
      </main>
    </Layout>
  );
}
