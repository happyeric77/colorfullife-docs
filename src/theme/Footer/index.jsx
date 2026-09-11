import React from 'react';
import styles from './styles.module.css';

function GithubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true">
      <path d="M15 22v-3.5a3.3 3.3 0 0 0-.94-2.57c3.14-.35 6.44-1.54 6.44-7A5.4 5.4 0 0 0 18.91 5s-1.18-.35-3.91 1.48a13.4 13.4 0 0 0-7 0C5.27 4.65 4.09 5 4.09 5A5.4 5.4 0 0 0 2.62 8.93c0 5.45 3.3 6.65 6.44 7A3.3 3.3 0 0 0 8.12 18.5V22" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true">
      <path d="M4 4h16v16H4z" />
      <path d="M4 6l8 7 8-7" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/happyeric77',
    Icon: GithubIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/eric-lee-24b342ab/',
    Icon: LinkedinIcon,
  },
  {
    label: 'Email',
    href: 'mailto:contact@dev-eric.work',
    Icon: MailIcon,
  },
  {
    label: 'Profile',
    href: 'https://profile.dev-eric.work',
    Icon: ProfileIcon,
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.social}>
        {socials.map(({ label, href, Icon }) => {
          const external = href.startsWith('http');
          return (
            <a
              key={label}
              aria-label={label}
              className={styles.iconLink}
              href={href}
              rel={external ? 'noreferrer noopener' : undefined}
              target={external ? '_blank' : undefined}
              title={label}>
              <Icon />
            </a>
          );
        })}
      </div>
      <p className={styles.copyright}>© {new Date().getFullYear()} Eric Lee.</p>
    </footer>
  );
}
