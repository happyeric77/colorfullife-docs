import React from 'react';
import { useContentModel } from '@site/src/lib/content-model';
import ProjectCard from '@site/src/components/ProjectCard';
import styles from './styles.module.css';

export default function ProjectList({ projects }) {
  const { projects: allProjects } = useContentModel();
  const items = projects ?? allProjects;

  return (
    <div className={styles.grid}>
      {items.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
