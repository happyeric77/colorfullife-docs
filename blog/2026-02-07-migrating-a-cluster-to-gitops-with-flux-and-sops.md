---
title: Migrating a cluster to GitOps with Flux and SOPS
description: Replacing ad-hoc kubectl and Helm apply with a Git repository as the source of truth, including encrypted secrets.
date: 2026-02-07
type: build-log
project: home-lab-kubernetes
topics:
  - gitops
  - fluxcd
  - sops
  - secrets-management
  - kubernetes
featured: false
---

The cluster ran on `kubectl apply`, one-off Helm commands and a handful of
scripts for long enough that nobody could say what the actual state was. The
manifests existed somewhere, secrets lived in shell history and password
managers, and rolling something back meant remembering what it looked like
before. This is how the cluster moved to a Git repository as its source of
truth.

## The goal

After the migration: the cluster is the output of a repository. A change is a
commit, reviewable, revertible, and reconciled automatically. Manual `kubectl
apply` is the exception, not the workflow.

## Tooling

- **Flux CD** as the GitOps controller, bootstrapped into the cluster.
- **SOPS** with **age** for encrypting secrets in the repository.
- `flux check --pre` before bootstrapping, to validate the cluster meets the
  prerequisites.

The bootstrap installs the Flux controllers and wires them to the repository,
after which everything else arrives through reconciliation.

## Repository layout

```text
clusters/production/     # flux-system + one Kustomization per app
apps/<app>/base/         # manifests for a single app
apps/<app>/kustomization.yaml
apps/<app>/secrets.enc.yaml
infrastructure/namespaces/
scripts/
docs/
```

The `clusters/` directory describes **what should exist in the cluster**;
`apps/` describes **what each thing is**; `infrastructure/` holds shared
prerequisites like namespaces. Splitting them matters because an app's
manifests should be movable without changing how the cluster consumes them.

## How reconciliation is wired

Each app gets its own Flux `Kustomization` resource that points at its
directory:

- `interval: 10m` — how often the repository is compared to the cluster.
- `retryInterval: 2m`, `timeout: 5m` — bounded retries for a broken apply.
- `prune: true` — resources removed from Git are removed from the cluster.
- `wait: true` plus health checks — reconciliation is not "done" until the
  resources are actually healthy.
- `decryption.provider: sops` — secrets are decrypted in-cluster at apply
  time.

Ten minutes sounds slow when iterating, and it is. For a home cluster the
trade is fine: drift gets corrected without anyone watching, and a bad commit
is undone with `git revert` instead of a manual cleanup.

## Secrets

Secrets are committed encrypted. SOPS is configured with an age key pair:
the public key is used to encrypt, the private key never enters Git. The
private key is backed up offline, and the cluster receives it once as a
`sops-age` secret in the `flux-system` namespace so the controllers can
decrypt at apply time.

The practical benefit is reviewability: an encrypted diff still shows which
keys changed, so a secret rotation is visible in a pull request without ever
exposing the value.

## Proving it with a pilot app

The migration was validated with a single representative app — a web
application with a database, an encrypted secret, persistent storage and an
ingress. Once that app reconciled end to end, the pattern was repeated for
the rest.

Verification steps that were worth formalizing:

- `flux get kustomizations` shows `Ready` and `Applied revision`.
- `kubectl get all -n <app>` matches the repository.
- An intentional annotation change in Git shows up in the cluster.
- `git revert` of that change rolls it back without manual intervention.

## What stayed manual

Node-level configuration (the kubelet and datastore settings on each
control-plane node) is not part of this repository. GitOps covers workloads
and their configuration, not the machines running them. That boundary is
worth writing down so it is not mistaken for drift.

## Takeaways

- The win is not automation for its own sake; it is that the intended state
  is written down once and reviewed like code.
- Encrypted secrets in Git are workable when the key management is explicit
  and the private key is backed up somewhere that is not the repository.
- A pilot app is enough to prove the layout before migrating everything.
- Keep a rollback path (`git revert`) and test it early, while the change is
  still small.
