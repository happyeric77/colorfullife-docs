import React from 'react';
import { useLocation } from '@docusaurus/router';
import { useContentModel } from '@site/src/lib/content-model';
import { repositories } from '@site/src/data/opensource';
import styles from './styles.module.css';

export default function RelatedOpenSource() {
  const { pathname } = useLocation();
  const { projects } = useContentModel();
  const current = pathname.replace(/\/+$/, '');
  const project = projects.find((item) => item.permalink === current);

  if (!project) {
    return null;
  }

  const related = repositories.filter(
    (repo) => repo.relatedProject === project.id,
  );

  if (related.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2>Open Source</h2>
      <div className={styles.rows}>
        {related.map((repo) => (
          <div key={repo.name} className={styles.row}>
            <h3 className={styles.title}>
              <a
                href={repo.repository}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${repo.name} on GitHub`}
              >
                {repo.name} <span aria-hidden="true">↗</span>
              </a>
            </h3>
            <p className={styles.description}>{repo.description}</p>
            {repo.language && <p className={styles.meta}>{repo.language}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
