# Kubernetes: Multi-Container Pod (Rsync Server + Tailscale)

A **multi-container Pod** allows multiple containers to run in the same network namespace, making it a powerful pattern when services need to share the same IP address and network interfaces.

## 🔍 Why Use a Multi-Container Pod?

One major advantage of this approach is **network stack sharing**. All containers inside the Pod share the same network namespace, meaning:

- They share the same IP address.
- The Tailscale interface (`tailscale0`) created by the `tailscale` container is **available to all containers** in the Pod.
- The `rsync` container can bind to `0.0.0.0:873` and automatically listen on `tailscale0` without additional configuration.

```
+-----------------------------------------+
|             Kubernetes Pod              |
| +----------------+  +----------------+  |
| |  Container A   |  |  Container B   |  |
| |   tailscale    |  | rsync daemon   |  |
| +----------------+  +----------------+  |
|        ↕ shared network namespace       |
|   eth0 / tailscale0 IP: 100.x.y.z       |
+-----------------------------------------+

Example Usage:
Synology Hyper Backup
         ↓
rsync://rsyncuser@100.x.y.z:873/usbbackup
```

---

## 🛠 Use Case: Secure Rsync Access via Tailscale

We deploy a **multi-container Pod** that runs both Tailscale and an `rsync` daemon.

### Key Benefits:

- Containers share the same network (loopback access to `localhost`).
- Shared volumes (e.g., a USB drive mounted to `/backup`).
- Tailscale provides a secure VPN channel for external NAS devices (like Synology) to connect to the rsync server using the Tailscale IP.

---

## 🧱 Architecture Overview

1. A single Pod contains:

   - **Container A**: Runs Tailscale and joins the network.
   - **Container B**: Runs `rsync --daemon`, exposes a backup module, and mounts a USB volume.

2. A remote NAS connects to the Pod over Tailscale using:

   ```
   rsync://rsyncuser@<tailscale-ip>/usbbackup
   ```

---

## ✅ Step-by-Step Guide

### Step 0: Create the Namespace

```bash
kubectl create namespace tailscale-rsync
```

---

### Step 1: Define the Pod (Deployment)

```yaml
# ./config/tailscale-rsync-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tailscale-rsync
  namespace: tailscale-rsync
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tailscale-rsync
  template:
    metadata:
      labels:
        app: tailscale-rsync
    spec:
      nodeSelector:
        kubernetes.io/hostname: rpi4-argon # Change to your node with the USB disk
      containers:
        - name: tailscale
          image: tailscale/tailscale:stable
          securityContext:
            capabilities:
              add: ['NET_ADMIN', 'SYS_ADMIN']
          env:
            - name: TS_AUTHKEY
              valueFrom:
                secretKeyRef:
                  name: tailscale-rsync
                  key: TS_AUTHKEY
          volumeMounts:
            - name: dev-net-tun
              mountPath: /dev/net/tun
              readOnly: true
            - name: tailscale-state
              mountPath: /var/lib/tailscale
          command: ['/bin/sh']
          args:
            - '-c'
            - |
              tailscaled &
              sleep 3
              tailscale up --authkey=${TS_AUTHKEY} --hostname=tailscale-rsync
              tail -f /dev/null

        - name: rsync-server
          image: debian:bullseye-slim
          command: ['/bin/sh']
          args:
            - '-c'
            - |
              apt-get update && apt-get install -y rsync && \
              echo "rsyncuser:supersecret123" > /etc/rsyncd.secrets && \
              chmod 600 /etc/rsyncd.secrets && \
              echo "pid file = /var/run/rsyncd.pid" > /etc/rsyncd.conf && \
              echo "[usbbackup]" >> /etc/rsyncd.conf && \
              echo "  path = /backup" >> /etc/rsyncd.conf && \
              echo "  read only = false" >> /etc/rsyncd.conf && \
              echo "  uid = 1000" >> /etc/rsyncd.conf && \
              echo "  gid = 1000" >> /etc/rsyncd.conf && \
              echo "  auth users = rsyncuser" >> /etc/rsyncd.conf && \
              echo "  secrets file = /etc/rsyncd.secrets" >> /etc/rsyncd.conf && \
              rsync --daemon --no-detach
          volumeMounts:
            - name: nas-backup
              mountPath: /backup

      volumes:
        - name: dev-net-tun
          hostPath:
            path: /dev/net/tun
            type: CharDevice

        - name: tailscale-state
          persistentVolumeClaim:
            claimName: tailscale-rsync-pvc

        - name: nas-backup
          hostPath:
            path: /tmp/mock-usb # Replace with your actual USB mount path
            type: DirectoryOrCreate
```

> ⚠️ The Tailscale container uses a **PersistentVolumeClaim (PVC)** to store state, ensuring the same identity/IP persists after Pod restarts.

---

### Step 2: Create the PVC

```yaml
# ./config/tailscale-rsync-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: tailscale-rsync-pvc
  namespace: tailscale-rsync
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Mi # Tailscale state typically uses <10Mi
  storageClassName: longhorn # Change if using a different storage backend
```

---

### Step 3: Set the Tailscale AuthKey and Apply Configs

1. **Create the Secret**

```bash
kubectl -n tailscale-rsync create secret generic tailscale-rsync \
  --from-literal=TS_AUTHKEY=tskey-auth-your-auth-key
```

2. **Apply the Deployment and PVC**

```bash
kubectl apply -f ./config
```

---

## ✅ Verification

1. Open the [Tailscale admin console](https://login.tailscale.com/admin/machines) and confirm a device named `tailscale-rsync` is online.

2. On any other device in the same Tailscale network, run:

```bash
rsync --list-only rsync://rsyncuser@100.x.y.z
```

If everything is set up correctly, you should see:

```
usbbackup
```

This confirms the rsync server is reachable and correctly exposed over Tailscale.

---

## References

- 🔧 [Linux: Rsync Daemon Setup](/linux/rsync-daemon)
- 🌐 [Tailscale on k3s](/kubernetes/tailscale-on-k3s)
