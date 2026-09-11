import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useContentModel } from '@site/src/lib/content-model';
import SectionHeader from '@site/src/components/SectionHeader';
import ProjectCard from '@site/src/components/ProjectCard';
import ProjectList from '@site/src/components/ProjectList';
import JournalRow from '@site/src/components/JournalRow';
import TopicTag from '@site/src/components/TopicTag';
import { repositories } from '@site/src/data/opensource';
import styles from './styles.module.css';

const MAX_TOPICS = 12;

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const { projects, journal, topics } = useContentModel();

  const featuredProject =
    projects.find(
      (project) => project.featured && project.status === 'running',
    ) ??
    projects.find((project) => project.status === 'running') ??
    projects.find((project) => project.featured) ??
    projects[0];
  const selectedProjects = projects.filter(
    (project) => project.id !== featuredProject?.id,
  );
  const latestJournal = journal.slice(0, 4);
  const trendingTopics = [...topics]
    .sort(
      (a, b) =>
        b.projects.length +
        b.journal.length -
        (a.projects.length + a.journal.length),
    )
    .slice(0, MAX_TOPICS);
  const openSourceFeatured = repositories.filter((repo) => repo.featured);

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow} data-reveal>
            ERIC / ENGINEERING
          </p>
          <h1 className={styles.title} data-reveal>
            {siteConfig.tagline}
          </h1>
          <p className={styles.subtitle} data-reveal>
            Engineering stories about SDK architecture, AI developer tools,
            infrastructure, home automation and the systems I run.
          </p>
          <div className={styles.actions} data-reveal>
            <Link className="button button--primary button--lg" to="/journal">
              Read the journal
            </Link>
            <Link className="button button--secondary button--lg" to="/projects">
              View projects
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        {latestJournal.length > 0 && (
          <section className={styles.section} data-reveal>
            <SectionHeader
              eyebrow="Journal"
              title="Latest entries"
              to="/journal"
              actionLabel="All entries"
            />
            <div className={styles.journalStream}>
              {latestJournal.map((entry) => (
                <JournalRow key={entry.permalink} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {featuredProject && (
          <section className={styles.section} data-reveal>
            <SectionHeader
              eyebrow="Project"
              title="Featured project"
              to="/projects"
              actionLabel="All projects"
            />
            <ProjectCard project={featuredProject} />
          </section>
        )}

        {selectedProjects.length > 0 && (
          <section className={styles.section} data-reveal>
            <SectionHeader
              eyebrow="Selected work"
              title="Selected projects"
              to="/projects"
              actionLabel="All projects"
            />
            <ProjectList projects={selectedProjects} />
          </section>
        )}

        {trendingTopics.length > 0 && (
          <section className={styles.section} data-reveal>
            <SectionHeader
              eyebrow="Index"
              title="Topics"
              subtitle="Technologies and concepts across Projects and Journal."
              to="/topics"
              actionLabel="All topics"
            />
            <div className={styles.topics}>
              {trendingTopics.map((topic) => (
                <TopicTag key={topic.slug} slug={topic.slug} />
              ))}
            </div>
          </section>
        )}

        <section className={styles.section} data-reveal>
          <SectionHeader
            eyebrow="Open Source"
            title="Open source"
            subtitle="Small tools and integrations built out of real engineering work."
            to="/opensource"
            actionLabel="View open source"
          />
          <ul className={styles.openSourceList}>
            {openSourceFeatured.map((repo) => (
              <li key={repo.name} className={styles.openSourceItem}>
                <a
                  href={repo.repository}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${repo.name} on GitHub`}
                >
                  {repo.name} <span aria-hidden="true">↗</span>
                </a>
                {repo.language && (
                  <span className={styles.openSourceMeta}>{repo.language}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}
