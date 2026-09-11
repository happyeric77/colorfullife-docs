// @ts-check

/**
 * Controlled vocabularies and relationship checks for the content model.
 * Shared by plugins/content-model/index.js at build time and validate.test.js.
 */

const PROJECT_TYPES = [
  "project",
  "product",
  "service",
  "system",
  "infrastructure",
  "open-source",
  "experiment",
];

const PROJECT_STATUSES = [
  "active",
  "running",
  "completed",
  "paused",
  "archived",
];

const JOURNAL_TYPES = [
  "project-story",
  "build-log",
  "deep-dive",
  "retrospective",
  "field-note",
];

const TOPIC_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const toArray = (value) =>
  Array.isArray(value) ? value : value ? [value] : [];

/**
 * @param {unknown} value
 * @param {readonly string[]} allowed
 * @param {string} label
 * @param {string} file
 */
function assertOneOf(value, allowed, label, file) {
  if (!allowed.includes(/** @type {string} */ (value))) {
    throw new Error(
      `${file}: invalid ${label} "${value}". Allowed: ${allowed.join(", ")}`,
    );
  }
  return /** @type {string} */ (value);
}

/**
 * Topics are lowercase kebab-case slugs shared by projects and journal entries.
 * @param {unknown} raw
 * @param {string} file
 */
function normalizeTopics(raw, file) {
  const topics = [];
  for (const topic of toArray(raw).map(String)) {
    if (!TOPIC_SLUG_PATTERN.test(topic)) {
      throw new Error(
        `${file}: invalid topic "${topic}". Use a lowercase kebab-case slug like "home-automation".`,
      );
    }
    if (!topics.includes(topic)) {
      topics.push(topic);
    }
  }
  return topics;
}

/**
 * @param {{id: string, file: string}[]} projects
 */
function assertUniqueProjectIds(projects) {
  /** @type {Map<string, string>} */
  const seen = new Map();
  for (const project of projects) {
    const existing = seen.get(project.id);
    if (existing) {
      throw new Error(
        `Duplicate project id "${project.id}" in ${project.file} and ${existing}.`,
      );
    }
    seen.set(project.id, project.file);
  }
}

/**
 * Journal.project and Project.parentProject must point at a real project id.
 * @param {{id: string, file: string, parentProject: string | null}[]} projects
 * @param {{file: string, project: string | null}[]} journal
 */
function assertReferences(projects, journal) {
  const ids = new Set(projects.map((project) => project.id));
  for (const project of projects) {
    if (project.parentProject && !ids.has(project.parentProject)) {
      throw new Error(
        `${project.file}: parentProject "${project.parentProject}" does not match any project id.`,
      );
    }
  }
  for (const entry of journal) {
    if (entry.project && !ids.has(entry.project)) {
      throw new Error(
        `${entry.file}: project "${entry.project}" does not match any project id.`,
      );
    }
  }
}

/**
 * Returns one readable cycle path per detected cycle, e.g. "a -> b -> a".
 * @param {{id: string, parentProject: string | null}[]} projects
 */
function findHierarchyCycles(projects) {
  /** @type {Map<string, string | null>} */
  const parents = new Map(
    projects.map((project) => [project.id, project.parentProject ?? null]),
  );
  const resolved = new Set();
  const cycles = [];
  for (const project of projects) {
    /** @type {string[]} */
    const path = [];
    let current = project.id;
    while (current && !resolved.has(current)) {
      const index = path.indexOf(current);
      if (index !== -1) {
        cycles.push(path.slice(index).concat(current).join(" -> "));
        break;
      }
      path.push(current);
      current = parents.get(current) ?? null;
    }
    for (const id of path) {
      resolved.add(id);
    }
  }
  return cycles;
}

/**
 * @param {{id: string, parentProject: string | null}[]} projects
 */
function assertNoHierarchyCycles(projects) {
  const cycles = findHierarchyCycles(projects);
  if (cycles.length > 0) {
    throw new Error(`Project hierarchy cycle detected: ${cycles.join("; ")}`);
  }
}

module.exports = {
  PROJECT_TYPES,
  PROJECT_STATUSES,
  JOURNAL_TYPES,
  TOPIC_SLUG_PATTERN,
  toArray,
  assertOneOf,
  normalizeTopics,
  assertUniqueProjectIds,
  assertReferences,
  findHierarchyCycles,
  assertNoHierarchyCycles,
};
