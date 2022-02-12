import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const canvas = document.getElementById("bg");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const starsTexture = "/img/stars.jpeg";
const sunTexture = "/img/sun.jpeg";
const mercuryTexture = "/img/mercury.jpeg";
const venusTexture = "/img/venus.jpeg";
const earthTexture = "/img/earth.jpeg";
const marsTexture = "/img/mars.jpeg";
const jupiterTexture = "/img/jupiter.jpeg";
const saturnTexture = "/img/saturn.jpeg";
const saturnRingTexture = "/img/saturnRing.png";
const uranusTexture = "/img/uranus.jpeg";
const uranusRingTexture = "/img/uranusRing.png";
const neptuneTexture = "/img/neptune.jpeg";
const plutoTexture = "/img/pluto.jpeg";

const starCount = 2000;

const renderer = new THREE.WebGLRenderer({ canvas });
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(90, 140, 200);
renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(starCount).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("/img/space.jpg");
scene.background = spaceTexture;

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanete(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(obj);
  mesh.position.x = position;
  return { mesh, obj };
}

const mercury = createPlanete(3.2, mercuryTexture, 28);
const venus = createPlanete(5.8, venusTexture, 44);
const earth = createPlanete(6, earthTexture, 62);
const mars = createPlanete(4, marsTexture, 78);
const jupiter = createPlanete(12, jupiterTexture, 100);
const saturn = createPlanete(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = createPlanete(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});
const neptune = createPlanete(5, neptuneTexture, 200);
const pluto = createPlanete(2.8, plutoTexture, 216);
scene.add(pointLight);

function movePlanets(speed = 1) {
  controls.update();
  sun.rotateY(0.004 * speed);
  mercury.mesh.rotateY(0.004 * speed);
  venus.mesh.rotateY(0.002 * speed);
  earth.mesh.rotateY(0.02 * speed);
  mars.mesh.rotateY(0.018 * speed);
  jupiter.mesh.rotateY(0.04 * speed);
  saturn.mesh.rotateY(0.038 * speed);
  uranus.mesh.rotateY(0.03 * speed);
  neptune.mesh.rotateY(0.032 * speed);
  pluto.mesh.rotateY(0.008 * speed);

  mercury.obj.rotateY(0.04 * speed);
  venus.obj.rotateY(0.015 * speed);
  earth.obj.rotateY(0.01 * speed);
  mars.obj.rotateY(0.008 * speed);
  jupiter.obj.rotateY(0.002 * speed);
  saturn.obj.rotateY(0.0009 * speed);
  uranus.obj.rotateY(0.0004 * speed);
  neptune.obj.rotateY(0.0001 * speed);
  pluto.obj.rotateY(0.00007 * speed);
}

document.addEventListener("scroll", () => movePlanets(7));
function animate() {
  requestAnimationFrame(animate);
  movePlanets();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let lastScrollTop = 0;

window.addEventListener(
  "scroll",
  function () {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
      camera.position.z -= 0.75;
      camera.position.x -= 0.37;
    } else {
      camera.position.z += 0.75;
      camera.position.x += 0.37;
    }
    lastScrollTop = st <= 0 ? 0 : st;
  },
  false
);
