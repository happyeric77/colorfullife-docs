---
title: Binding a Pod to a USB Drive on a Specific Node
tags: [k3s, system, kubernetes, local-volume]
---

The goal is for **a Pod to use a USB hard drive physically attached to a specific Node** (e.g., a worker node), the **best practice** is:

| Technology                         | Purpose                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `nodeSelector` (or `nodeAffinity`) | Pin the Pod to the Node with the attached USB                                          |
| `hostPath` volume                  | Mount the USB drive’s path on the Node (e.g., `/mnt/nas-backup`) directly into the Pod |

🛡️ Advantages

- Simple to implement and quick to deploy
- No need for extra NFS or distributed storage setup
- Full control over which physical disk the data lands on
- Data persists on the host; Pod crashes or restarts won't cause data loss

⚠️ Caveats

- The USB drive can only be accessed by Pods scheduled on that specific Node — **no cross-node sharing**
- Scheduling the Pod on other Nodes will cause volume mount failures or Pod crashes
- Make sure the USB drive is automatically mounted on the Node before Pod creation

---

## 🚧 Getting Started

### 🏁 Create a Dummy Local Volume on the Worker Node

On the worker Node (e.g., `rpi4-argon`), run:

```bash
sudo mkdir -p /tmp/mock-usb
sudo chmod 777 /tmp/mock-usb  # relaxed permissions for testing ease
```

### 🧪 BusyBox Test Pod (Mounting the mock USB with `hostPath`)

```yaml
# ./config/busybox-local-vol-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-local-volume
spec:
  nodeSelector:
    kubernetes.io/hostname: rpi4-argon
  containers:
    - name: busybox
      image: busybox
      command: ['sh', '-c', 'echo hello-world > /data/hello.txt && sleep 3600']
      volumeMounts:
        - mountPath: /data
          name: local-volume
  volumes:
    - name: local-volume
      hostPath:
        path: /tmp/mock-usb
        type: Directory
```

### Steps

1. Apply the Pod:

```bash
kubectl apply -f config
```

2. Exec into the Pod:

```bash
kubectl exec -it busybox-local-volume -- sh
cat /data/hello.txt
echo '---' >> /data/hello.txt
```

3. Check on the worker Node if the file is created:

```bash
cat /tmp/mock-usb/hello.txt
```

If you see:

```bash
hello-world
---
```

it means your `hostPath` volume is successfully mounted 🎉!

---

## 🧼 Cleanup

```bash
kubectl delete pod busybox-local-volume
rm /tmp/mock-usb/hello.txt
```
