// @ts-check

const fs = require("fs/promises");
const path = require("path");
const {
  Globby,
  normalizeUrl,
  parseMarkdownString,
} = require("@docusaurus/utils");
const {
  JOURNAL_TYPES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  assertNoHierarchyCycles,
  assertOneOf,
  assertReferences,
  assertUniqueProjectIds,
  normalizeTopics,
  toArray,
} = require("./validate");

const PROJECTS_DIR = "projects";
const JOURNAL_DIR = "blog";

// ponytail: slug-to-label overrides for topics that don't pluralize well.
// Replace with a topic registry file once Topics grow past a handful (PR 3).
const TOPIC_LABELS = {
  alertmanager: "Alertmanager",
  argocd: "Argo CD",
  dns: "DNS",
  esp32: "ESP32",
  etcd: "etcd",
  fluxcd: "Flux CD",
  "kube-vip": "kube-vip",
  k3s: "K3s",
  mqtt: "MQTT",
  prometheus: "Prometheus",
  "raspberry-pi": "Raspberry Pi",
  sops: "SOPS",
  traefik: "Traefik",
};

function humanizeTopic(slug) {
  if (TOPIC_LABELS[slug]) {
    return TOPIC_LABELS[slug];
  }
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toISODate(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return typeof value === "string" ? value.slice(0, 10) : null;
}

async function readFrontMatter(dir) {
  const files = await Globby("**/*.{md,mdx}", {
    cwd: dir,
    absolute: true,
  });
  const entries = [];
  for (const file of files.sort()) {
    const source = await fs.readFile(file, "utf8");
    const { frontMatter } = parseMarkdownString(source);
    entries.push({ file, frontMatter });
  }
  return entries;
}

async function loadProjects(siteDir) {
  const projectsDir = path.join(siteDir, PROJECTS_DIR);
  const projects = [];
  for (const { file, frontMatter } of await readFrontMatter(projectsDir)) {
    // Files without an explicit `id` are collection index pages, not projects.
    if (!frontMatter.id) {
      continue;
    }
    const relativePath = path
      .relative(projectsDir, file)
      .replace(/\\/g, "/");
    if ("parent" in frontMatter) {
      throw new Error(
        `${relativePath}: "parent" was renamed to "parentProject". Update the front matter.`,
      );
    }
    const slug = frontMatter.slug ?? relativePath.replace(/\.mdx?$/, "");
    projects.push({
      id: String(frontMatter.id),
      title: frontMatter.title ?? String(frontMatter.id),
      description: frontMatter.description ?? "",
      type: assertOneOf(
        frontMatter.type ?? "project",
        PROJECT_TYPES,
        "project type",
        relativePath,
      ),
      status: assertOneOf(
        frontMatter.status ?? "active",
        PROJECT_STATUSES,
        "project status",
        relativePath,
      ),
      parentProject: frontMatter.parentProject
        ? String(frontMatter.parentProject)
        : null,
      started: frontMatter.started ?? null,
      featured: Boolean(frontMatter.featured),
      topics: normalizeTopics(frontMatter.topics, relativePath),
      stack: toArray(frontMatter.stack).map(String),
      github: frontMatter.github ?? "",
      website: frontMatter.website ?? "",
      permalink: normalizeUrl(["/projects", String(slug)]),
      file: relativePath,
    });
  }
  return projects;
}

async function loadJournal(siteDir) {
  const journalDir = path.join(siteDir, JOURNAL_DIR);
  const journal = [];
  for (const { file, frontMatter } of await readFrontMatter(journalDir)) {
    if (frontMatter.draft) {
      continue;
    }
    // Convention: flat or dated files named YYYY-MM-DD-slug.md(x).
    const basename = path.basename(file).replace(/\.mdx?$/, "");
    const relativePath = path.relative(journalDir, file).replace(/\\/g, "/");
    // Mirrors plugin-content-blog v2.4 slug rules: dated filenames become
    // /journal/:year/:month/:day/:slug. Keep in sync when upgrading Docusaurus.
    const dateMatch = relativePath.match(
      /^(?<folder>.*)(?<date>\d{4}[-/]\d{1,2}[-/]\d{1,2})[-/]?(?<text>.*?)(?:\/index)?\.mdx?$/,
    );
    const slug = frontMatter.slug
      ? String(frontMatter.slug)
      : dateMatch
        ? `/${dateMatch.groups.date.replace(/-/g, "/")}/${
            dateMatch.groups.folder
          }${dateMatch.groups.text}`
        : `/${relativePath.replace(/(?:\/index)?\.mdx?$/, "")}`;
    journal.push({
      title: frontMatter.title ?? basename,
      description: frontMatter.description ?? "",
      date:
        toISODate(frontMatter.date) ??
        /^\d{4}-\d{2}-\d{2}/.exec(basename)?.[0] ??
        null,
      type: assertOneOf(
        frontMatter.type ?? "field-note",
        JOURNAL_TYPES,
        "journal type",
        relativePath,
      ),
      project: frontMatter.project ? String(frontMatter.project) : null,
      topics: normalizeTopics(frontMatter.topics, relativePath),
      featured: Boolean(frontMatter.featured),
      permalink: normalizeUrl(["/journal", String(slug)]),
      file: relativePath,
    });
  }
  return journal.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function aggregateTopics(projects, journal) {
  const topics = new Map();
  const getTopic = (slug) => {
    if (!topics.has(slug)) {
      topics.set(slug, {
        slug,
        label: humanizeTopic(slug),
        projects: [],
        journal: [],
      });
    }
    return topics.get(slug);
  };
  for (const project of projects) {
    for (const slug of project.topics) {
      getTopic(slug).projects.push({
        id: project.id,
        title: project.title,
        permalink: project.permalink,
      });
    }
  }
  for (const entry of journal) {
    for (const slug of entry.topics) {
      getTopic(slug).journal.push({
        title: entry.title,
        date: entry.date,
        type: entry.type,
        permalink: entry.permalink,
      });
    }
  }
  return Array.from(topics.values()).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}

module.exports = function contentModelPlugin(context) {
  return {
    name: "colorfullife-content-model",

    async loadContent() {
      const projects = await loadProjects(context.siteDir);
      const journal = await loadJournal(context.siteDir);

      assertUniqueProjectIds(projects);
      assertReferences(projects, journal);
      assertNoHierarchyCycles(projects);

      const projectById = new Map(projects.map((p) => [p.id, p]));
      const journalWithProject = journal.map((entry) => ({
        ...entry,
        projectTitle: entry.project
          ? projectById.get(entry.project)?.title ?? null
          : null,
      }));

      return {
        projects,
        journal: journalWithProject,
        topics: aggregateTopics(projects, journal),
      };
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
};
