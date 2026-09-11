// @ts-check

const assert = require("node:assert/strict");
const {
  PROJECT_TYPES,
  assertOneOf,
  assertReferences,
  assertUniqueProjectIds,
  findHierarchyCycles,
  normalizeTopics,
} = require("./validate");

const project = (/** @type {string} */ id, parentProject = null) => ({
  id,
  parentProject,
  file: `${id}.mdx`,
});

// Topics are lowercase kebab-case slugs, deduplicated.
assert.deepEqual(
  normalizeTopics(["kubernetes", "kubernetes", "home-automation"], "x.mdx"),
  ["kubernetes", "home-automation"],
);
assert.throws(
  () => normalizeTopics(["Kubernetes"], "x.mdx"),
  /lowercase kebab-case/,
);

// Duplicate project ids fail the build.
assert.throws(
  () => assertUniqueProjectIds([project("a"), project("a")]),
  /Duplicate project id "a"/,
);

// Journal.project is optional; when present it must reference a real id.
assert.doesNotThrow(() =>
  assertReferences([project("a"), project("b", "a")], [
    { file: "j.md", project: "b" },
  ]),
);
assert.doesNotThrow(() =>
  assertReferences([project("a")], [{ file: "j.md", project: null }]),
);
assert.throws(
  () => assertReferences([project("a")], [{ file: "j.md", project: "missing" }]),
  /does not match any project id/,
);
assert.throws(
  () => assertReferences([project("a", "missing")], []),
  /parentProject "missing"/,
);

// Hierarchy cycles are detected deterministically.
assert.deepEqual(findHierarchyCycles([project("a"), project("b")]), []);
assert.deepEqual(findHierarchyCycles([project("a", "b"), project("b", "a")]), [
  "a -> b -> a",
]);
assert.deepEqual(
  findHierarchyCycles([project("a", "b"), project("b", "c"), project("c", "a")]),
  ["a -> b -> c -> a"],
);
assert.deepEqual(findHierarchyCycles([project("a", "a")]), ["a -> a"]);

// Controlled vocabularies reject technology names as project types.
assert.throws(
  () => assertOneOf("kubernetes", PROJECT_TYPES, "project type", "x.mdx"),
  /invalid project type/,
);

console.log("validate.test.js: all checks passed");
