import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useContentModel } from '@site/src/lib/content-model';
import SectionHeader from '@site/src/components/SectionHeader';
import ProjectCard from '@site/src/components/ProjectCard';
import ProjectList from '@site/src/components/ProjectList';
import JournalCard from '@site/src/components/JournalCard';
import TopicTag from '@site/src/components/TopicTag';
import styles from './styles.module.css';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const { projects, journal, topics } = useContentModel();

  const currentlyBuilding =
    projects.find((project) => project.featured && project.status === 'active') ??
    projects.find((project) => project.status === 'active') ??
    projects.find((project) => project.featured);
  const selectedProjects = projects.filter((project) => project.featured);
  const latestJournal = journal.slice(0, 3);

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroTagline}>{siteConfig.tagline}</p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to="/projects">
              Browse projects
            </Link>
            <Link className="button button--secondary button--lg" to="/journal">
              Read the journal
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        {currentlyBuilding && (
          <section className={styles.section}>
            <SectionHeader
              title="Currently Building"
              to="/projects"
              actionLabel="All projects"
            />
            <ProjectCard project={currentlyBuilding} />
          </section>
        )}

        {selectedProjects.length > 0 && (
          <section className={styles.section}>
            <SectionHeader
              title="Selected Projects"
              to="/projects"
              actionLabel="All projects"
            />
            <ProjectList projects={selectedProjects} />
          </section>
        )}

        {latestJournal.length > 0 && (
          <section className={styles.section}>
            <SectionHeader
              title="Latest Journal"
              to="/journal"
              actionLabel="All entries"
            />
            <div className={styles.journalList}>
              {latestJournal.map((entry) => (
                <JournalCard key={entry.permalink} entry={entry} />
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <SectionHeader
            title="Recent Activity"
            subtitle="Commits, releases and contributions across my projects."
            to="/opensource"
            actionLabel="Open Source"
          />
          <p className={styles.placeholder}>
            Open Source activity is coming in a follow-up PR.
          </p>
        </section>

        {topics.length > 0 && (
          <section className={styles.section}>
            <SectionHeader
              title="Topics"
              subtitle="Technologies and concepts across Projects and Journal."
              to="/topics"
              actionLabel="All topics"
            />
            <div className={styles.topics}>
              {topics.map((topic) => (
                <TopicTag key={topic.slug} slug={topic.slug} />
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
