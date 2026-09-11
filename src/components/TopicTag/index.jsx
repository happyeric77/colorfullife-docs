import React from 'react';
import Link from '@docusaurus/Link';
import { useContentModel } from '@site/src/lib/content-model';
import styles from './styles.module.css';

export default function TopicTag({ slug }) {
  const { topics } = useContentModel();
  const label = topics.find((topic) => topic.slug === slug)?.label ?? slug;

  return (
    <Link className={styles.tag} to={`/topics#${slug}`}>
      {label}
    </Link>
  );
}
