import React from 'react';
import { useLocation } from '@docusaurus/router';
import { useContentModel } from '@site/src/lib/content-model';
import JournalCard from '@site/src/components/JournalCard';
import styles from './styles.module.css';

export default function RelatedJournal() {
  const { pathname } = useLocation();
  const { projects, journal } = useContentModel();
  const current = pathname.replace(/\/+$/, '');
  const project = projects.find((item) => item.permalink === current);
  if (!project) {
    return null;
  }
  // ponytail: O(projects²) fixpoint rollup, fine at this scale; build an index
  // once if the project list grows large.
  const ids = new Set([project.id]);
  let added = true;
  while (added) {
    added = false;
    for (const item of projects) {
      if (
        item.parentProject &&
        ids.has(item.parentProject) &&
        !ids.has(item.id)
      ) {
        ids.add(item.id);
        added = true;
      }
    }
  }
  const entries = journal.filter((entry) => ids.has(entry.project));
  return (
    <section className={styles.section}>
      <h2>Journal</h2>
      {entries.length === 0 ? (
        <p className={styles.empty}>No journal entries yet.</p>
      ) : (
        <div className={styles.list}>
          {entries.map((entry) => (
            <JournalCard key={entry.permalink} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
