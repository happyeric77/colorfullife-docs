---
title: Running Tailscale in Kubernetes (k3s Focus)
tags: [k3s, system, kubernetes, local-volume, tailscale]
---

There are two main approaches to running Tailscale in Kubernetes, particularly in lightweight clusters like **k3s**. Each has distinct use cases, benefits, and trade-offs.

## 1. **Manual: `tailscaled + tailscale up` with Authkey**

This is the simplest way to run Tailscale inside a Pod by directly launching `tailscaled` and bringing up the connection using an **authkey**. No need for RBAC setup or additional cluster configuration.

### Example Pod Spec

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: tailscale-test
  labels:
    app: tailscale-rsync
spec:
  nodeSelector:
    kubernetes.io/hostname: rpi4-argon # Ensure it runs on the node with the USB drive

  containers:
    - name: tailscale
      image: tailscale/tailscale:stable
      securityContext:
        capabilities:
          add: ['NET_ADMIN', 'SYS_ADMIN'] # Required by Tailscale for networking
      env:
        - name: TS_AUTHKEY
          value: 'tskey-auth-my-auth-key' # Replace with your actual authkey
        - name: TS_USERSPACE
          value: 'true'
        - name: TS_STATE_DIR
          value: '/var/lib/tailscale'
      volumeMounts:
        - name: tailscale-state
          mountPath: /var/lib/tailscale
        - name: nas-backup
          mountPath: /backup
        - name: dev-net-tun
          mountPath: /dev/net/tun
          readOnly: true
      command: ['/bin/sh']
      args:
        - '-c'
        - |
          tailscaled &
          sleep 2
          tailscale up --authkey=${TS_AUTHKEY} --hostname=k3s-tailscale-pod
          tail -f /dev/null

  volumes:
    - name: tailscale-state
      emptyDir: {} # Ephemeral; change to PersistentVolume for longer-lived state

    - name: nas-backup
      hostPath:
        path: /tmp/mock-usb # Simulated USB mount
        type: DirectoryOrCreate

    - name: dev-net-tun
      hostPath:
        path: /dev/net/tun
        type: CharDevice
```

### 🔍 Explanation

- `NET_ADMIN` and `SYS_ADMIN` capabilities are required for Tailscale networking.
- `TS_USERSPACE=true`: Ensures Tailscale runs in userspace mode.
- `TS_STATE_DIR`: Specifies where to store connection state. While `emptyDir` is used here, a **PersistentVolume** is recommended for production.
- `nas-backup`: A simulated USB directory mount from the host for storing backup files.
- `dev-net-tun`: Required device for establishing the Tailscale tunnel.

The critical startup logic is:

```bash
tailscaled &
sleep 2
tailscale up --authkey=${TS_AUTHKEY} --hostname=<your-node-name>
```

### ✅ Pros

- **Simple setup** — no Kubernetes RBAC or extra configuration required.
- Great for **single-purpose** use cases like syncing remote NAS data to a local USB disk.
- Ideal for **quick testing or experimental deployments**.

### ❌ Cons

- Not integrated with Kubernetes event logging (i.e., you won’t see `tailscaled` logs via `kubectl logs`).
- Manual handling of identity and lifecycle.

---

## 2. Native Kubernetes Integration: `--kube` + RBAC

This is Tailscale’s official, **Kubernetes-native** deployment model, designed for full lifecycle and identity management.

It involves:

- Starting Tailscale with the `--kube` flag
- Deploying `Deployment`, `ServiceAccount`, `ClusterRole`, and `ClusterRoleBinding` resources
- Supporting automatic identity management, logging, and state persistence

### ✅ Pros

- **First-class Kubernetes integration**: Pod identity, logs, events, and metrics are tied into the cluster.
- Easier to scale and maintain in GitOps workflows or when using Helm charts.
- State is managed cleanly and persistently using Kubernetes-native objects (e.g., Secrets).

### ❌ Cons

- More complex to set up (requires RBAC, possibly Secrets).
- Overhead may not be justified for **single-use** or **non-critical** deployments.

---

## 🧭 Recommendation Summary

| Use Case                                                            | Recommended Approach                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Single-purpose Pod (e.g., one-time backup, simple use)              | ✅ Manual approach with `authkey + tailscaled` is sufficient |
| Multiple Pods, cross-namespace, GitOps, long-term operation         | ✅ Use **RBAC + native `--kube` integration**                |
| Require Pod event logging or dynamic identity control via Tailscale | ✅ Native mode is preferred                                  |

---

For more advanced setups, consider using:
[Kubernetes: multi-container pod (rsync server + Tailscale)](/kubernetes/multi-container-pod)
