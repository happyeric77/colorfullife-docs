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

function formatDate(date) {
  if (!date) return '';
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatType(type) {
  return type ? type.replace(/-/g, ' ').toUpperCase() : '';
}

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
  const latestEntry = latestJournal[0];
  const trendingTopics = [...topics]
    .sort(
      (a, b) =>
        b.projects.length +
        b.journal.length -
        (a.projects.length + a.journal.length),
    )
    .slice(0, MAX_TOPICS);
  const openSourceFeatured = repositories.filter((repo) => repo.featured);
  const featuredRepository = openSourceFeatured[0];

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
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
                  <span className={styles.actionArrow} aria-hidden="true">→</span>
                </Link>
                <Link className="button button--secondary button--lg" to="/projects">
                  View projects
                </Link>
              </div>
              <div className={styles.heroTags} data-reveal>
                <span>SDK Architecture</span>
                <span>AI Developer Tools</span>
                <span>Infrastructure</span>
                <span>Home Automation</span>
                <span className={styles.heroTagAccent}>→ systems in practice</span>
              </div>
            </div>

            <div className={styles.heroPanelWrap} data-reveal>
              <div className={styles.heroPanelGlow} aria-hidden="true" />
              <aside className={styles.heroPanel} aria-label="Engineering journal overview">
                <div className={styles.panelChrome}>
                  <div className={styles.panelDots} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className={styles.panelFile}>engineering.log</span>
                  <span className={styles.panelStatus} aria-hidden="true" />
                </div>

                <div className={styles.panelBody}>
                  {latestEntry && (
                    <div className={styles.panelItem}>
                      <span className={styles.panelLabel}>Latest</span>
                      <Link className={styles.panelTitle} to={latestEntry.permalink}>
                        {latestEntry.title}
                      </Link>
                      <span className={styles.panelMeta}>
                        {formatType(latestEntry.type)} · {formatDate(latestEntry.date)}
                      </span>
                    </div>
                  )}

                  {featuredProject && (
                    <div className={styles.panelItem}>
                      <span className={styles.panelLabel}>Project</span>
                      <Link className={styles.panelTitle} to={featuredProject.permalink}>
                        {featuredProject.title}
                      </Link>
                      <span className={styles.panelMeta}>
                        {featuredProject.type} · {featuredProject.status}
                      </span>
                    </div>
                  )}

                  {featuredRepository && (
                    <div className={styles.panelItem}>
                      <span className={styles.panelLabel}>Open source</span>
                      <a
                        className={styles.panelTitle}
                        href={featuredRepository.repository}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {featuredRepository.name} ↗
                      </a>
                      <span className={styles.panelMeta}>
                        {featuredRepository.language || 'Public repository'}
                      </span>
                    </div>
                  )}

                  <div className={styles.panelFocus}>
                    <div>
                      <span className={styles.panelFocusLabel}>Engineering corpus</span>
                      <strong>Architecture → systems</strong>
                    </div>
                    <span>journal · projects<br />public work</span>
                  </div>
                </div>

                <div className={styles.panelFooter}>
                  <span>JOURNAL</span>
                  <span>PROJECTS</span>
                  <span>OPEN SOURCE</span>
                </div>
              </aside>
            </div>
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
