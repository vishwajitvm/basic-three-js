// Import the core Three.js library
import * as THREE from 'three';

// Import OrbitControls (for mouse interaction: rotate, zoom, pan)
import { OrbitControls } from "jsm/controls/OrbitControls.js";

/* =========================
   RENDERER SETUP
   ========================= */

// Get viewport width and height
const w = window.innerWidth;
const h = window.innerHeight;

// WebGLRenderer is responsible for drawing everything on the canvas
// antialias: true -> smooth edges
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set renderer size to full screen
renderer.setSize(w, h);

// Append the canvas to the DOM
document.body.appendChild(renderer.domElement);

/* =========================
   CAMERA SETUP
   ========================= */

// Field of View (how wide the camera sees)
const fov = 75;

// Aspect ratio (important to avoid stretching)
const aspect = w / h;

// Near and far clipping planes
// Objects outside this range will NOT be rendered
const near = 0.1;
const far = 10;

// Perspective camera (like human eye)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// Move camera backward so the object is visible
camera.position.z = 2;

/* =========================
   SCENE
   ========================= */

// Scene is the container for all objects, lights, cameras
const scene = new THREE.Scene();

/* =========================
   CONTROLS
   ========================= */

// OrbitControls allow mouse interaction
const controls = new OrbitControls(camera, renderer.domElement);

// Smooth camera movement
controls.enableDamping = true;

// Lower value = smoother/slower damping
controls.dampingFactor = 0.03;

/* =========================
   GEOMETRY (SHAPE)
   ========================= */

// THIS IS WHERE THE SHAPE IS CONTROLLED 👇
//
// IcosahedronGeometry(radius, detail)
//
// radius -> size of the shape
// detail -> subdivision level (higher = more triangles)
const geo = new THREE.IcosahedronGeometry(1.0, 2);

/* =========================
   MATERIAL
   ========================= */

// MeshStandardMaterial reacts to lights
// flatShading: true -> faceted look instead of smooth
const mat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  flatShading: true
});

/* =========================
   MESH (GEOMETRY + MATERIAL)
   ========================= */

// Mesh is the visible 3D object
const mesh = new THREE.Mesh(geo, mat);

// Add mesh to the scene
scene.add(mesh);

/* =========================
   WIREFRAME OVERLAY
   ========================= */

// Simple material that does NOT react to light
const wiremat = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true
});

// Wireframe uses SAME geometry
const wiremesh = new THREE.Mesh(geo, wiremat);

// Slightly scale up so wireframe is visible above surface
wiremesh.scale.multiplyScalar(1.001);

// Attach wireframe to main mesh
mesh.add(wiremesh);

/* =========================
   LIGHTING
   ========================= */

// HemisphereLight simulates sky + ground lighting
//
// First color -> sky color
// Second color -> ground color
const hemiLight = new THREE.HemisphereLight(
  0x0099ff, // blue sky
);

// Add light to scene
scene.add(hemiLight);

/* =========================
   ANIMATION LOOP
   ========================= */

// This function runs every frame (~60fps)
function animate() {

  // Ask browser for next frame
  requestAnimationFrame(animate);

  // Rotate the mesh on all axes
  mesh.rotation.x += 0.001;
  mesh.rotation.y += 0.001;
  mesh.rotation.z += 0.001;

  // Render the scene from the camera's point of view
  renderer.render(scene, camera);

  // Required for smooth OrbitControls damping
  controls.update();
}

// Start animation loop
animate();
