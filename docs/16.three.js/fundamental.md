## Setup the project environment with Typescript, webpack, and three.js

Github Repo: https://github.com/happyeric77/three.js-fundamental.git

- Repo branch: webpack-env

There are three key packages by which we can setup the project environment

- webpack (including `webpack`, `webpack-cli`, `webpack-dev-server`, `ts-loader`, `webpack-merge`)
- typescript
- three.js

1. install packages

```bash
npm install
```

2. Start dev server

```bash
npm run serve
```

## Basic components of three.js

- Repo branch: TBD

### OrbitControls: to have interactive canvas with mouse and keyboard

```ts
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const control = new OrbitControls(camera, renderer.domElement);

control.addEventListener("change", () => renderer.render(scene, camera));
```

OrbitControls object allows us to control the camera with mouse and keyboard.
when the mouse event happens, the renderer will re-render the scene.

### Scene: where to place objects, lights and cameras.

```ts
const scene = new THREE.Scene();
```

### Camera:

```ts
const camera = new THREE.PerspectiveCamera(
  75, // field of view
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  1000 // far clipping plane
);
```

By using `PerspectiveCamera`, we can have a 3D perspective view. It means what we see is not a flat image, but a 3D image depending on the FOV of the camera.
![](/img/doc-threejs/perspective.png)

Another type of camera is `OrthographicCamera`, which is a flat image.

![](/img/doc-threejs/orthographic.png)

In the example project, we are able to see the difference between using `PerspectiveCamera` and `OrthographicCamera`

![](/img/doc-threejs/view-compare.png)

### Renderer:

```ts
// Default renderer, which is WebGLRenderer. The fastest and most supported one.
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement); // renderer.domElement is a HTMLCanvasElement
```

Above, wwe use append child to add the canvas to the body of the document.
Sometimes, we may want to bundle the canvas into a html element. We can

1. create a canvas element in html

```html
<!-- index.html -->
<!-- ... -->
<head>
  <style>
    /* ... */
    #c1 {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <canvas id="c1"></canvas>
  <!-- ... -->
</body>
```

2. use `document.getElementById` to get the canvas element

```ts
const canvas = document.getElementById("c1");
const renderer = new THREE.WebGLRenderer({ canvas });
```

### Animation Loop

There are two ways to animate the scene

1. use `requestAnimationFrame` to call the animation function recursively

```ts
const animate = () => {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  renderer.render(scene, camera);
};
```

2. use `renderer.setAnimationLoop` to set the animation loop

```ts
renderer.setAnimationLoop(() => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  renderer.render(scene, camera);
});
```
