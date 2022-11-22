import * as THREE from "three";

import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
let camera, scene, renderer, controls;
const objects = [];
let raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;
    if(name == "f" ){
        window.location = './performance.html';

    }
   
  }, false);

init();
animate();

function init() {
  // CONFIG CAMARA Y MOVIMIENTO
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;
  camera.position.z = 130;

  scene = new THREE.Scene();

  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  controls = new PointerLockControls(camera, document.body);

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener("click", function () {
    controls.lock();
  });

  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  controls.addEventListener("unlock", function () {
    blocker.style.display = "block";
    instructions.style.display = "";
  });

  scene.add(controls.getObject());

  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // PISO

  let floorGeometry = new THREE.PlaneGeometry(300, 300, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);
  let position = floorGeometry.attributes.position;
  floorGeometry = floorGeometry.toNonIndexed();
  position = floorGeometry.attributes.position;

  const floorMaterial = new THREE.MeshBasicMaterial();
  var texture = new THREE.TextureLoader().load("./assets/images.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(40, 40);

  floorMaterial.map = texture;

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  scene.add(floor);

  // OBJETOS
  // EJEMPLO FIGURA GEOMETRICA

  var geometryTorus = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  var materialTorus = new THREE.MeshPhongMaterial({ color: 0xf3f3f3 });
  var torusKnotMesh = new THREE.Mesh(geometryTorus, materialTorus);
  torusKnotMesh.position.y = 25;
  torusKnotMesh.position.x = 2;
  torusKnotMesh.position.z = -35;
  console.log(torusKnotMesh.position);
  scene.add(torusKnotMesh);

  // EJEMPLO PARA MODELO 3D GLB
  var loadergl = new GLTFLoader();

  loadergl.load("./assets/microbus_mexico_df.glb", function (gltf) {
    var micro = gltf.scene; // micro 3D object is loaded
    micro.scale.set(4, 4, 4);
    micro.position.y = 5;
    micro.position.x = -20;
    micro.position.z = 25;
    scene.add(micro);
  });

  loadergl.load("./assets/mexican_starter_pack.glb", function (gltf) {
    var mexpack = gltf.scene; // mexpack 3D object is loaded
    mexpack.scale.set(.1, .1, .1);
    mexpack.position.y = 5;
    mexpack.position.x = 20;
    mexpack.position.z = 15;
    scene.add(mexpack);
  });

  // EJEMPLO PARA PONER VIDEO EN RECTANGULO

  let video = document.createElement("video");
  video.src = "./assets/video1.mp4";
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.load();
  video.play();

  var videoTexture = new THREE.VideoTexture(video);
  videoTexture.wrapS = videoTexture.wrapT = THREE.ClampToEdgeWrapping;
  videoTexture.minFilter = THREE.LinearFilter;
  var exhibitionMaterial = new THREE.MeshPhongMaterial({
    map: videoTexture,
    side: THREE.DoubleSide,
  });

  var exhibitionGeometry = new THREE.PlaneGeometry(200, 50);
  var exibitionMesh = new THREE.Mesh(exhibitionGeometry, exhibitionMaterial);
  exibitionMesh.position.y = 20;
  exibitionMesh.position.z = 80;
  scene.add(exibitionMesh);

  // EJEMPLO PONER AUDIO

  const listener = new THREE.AudioListener();
  camera.add(listener);
  const sound = new THREE.PositionalAudio(listener);

  /* 	const audioLoader = new THREE.AudioLoader();
    audioLoader.load("assets/grok.mp3", function (buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(20);
        sound.play();
    }); */

  /* torusKnotMesh.add(sound); */

  // EJEMPLO PARA PONER CUADRO DE TEXTO

  var spriteMap = new THREE.TextureLoader().load("assets/messagebox.png");
  const spriteMaterial = new THREE.SpriteMaterial({
    map: spriteMap,
    depthWrite: false,
  });

  var sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(10, 10, 1);
  sprite.position.y = 10;
  sprite.position.x = 20;
  sprite.position.z = -75;
  sprite.rotateY(Math.PI / 2);
  scene.add(sprite);

  // PAREDES

  let wallGeometry = new THREE.PlaneGeometry(240, 100);
  var textureWall = new THREE.TextureLoader().load("./assets/stars.jpg");
  var wallMaterial = new THREE.MeshPhongMaterial({
    map: textureWall,
    side: THREE.DoubleSide,
  });

  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.y = 0;
  wall.position.x = 100;
  wall.position.z = -40;
  wall.rotation.y = Math.PI / 2;
  scene.add(wall);

  const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall2.position.y = 0;
  wall2.position.x = -100;
  wall2.position.z = -40;
  wall2.rotation.y = Math.PI / 2;
  scene.add(wall2);

  let wallGeometry3 = new THREE.PlaneGeometry(200, 100);

  const wall3 = new THREE.Mesh(wallGeometry3, wallMaterial);
  wall3.position.y = 0;
  wall3.position.z = -145;
  scene.add(wall3);

  let wallGeometry4 = new THREE.PlaneGeometry(120, 100);

  const wall4 = new THREE.Mesh(wallGeometry4, wallMaterial);
  wall4.position.y = 0;
  wall4.position.x = 50;
  wall4.position.z = -20;
  wall4.rotation.y = Math.PI / 2;
  scene.add(wall4);

  const wall5 = new THREE.Mesh(wallGeometry4, wallMaterial);
  wall5.position.y = 0;
  wall5.position.x = -50;
  wall5.position.z = -20;
  wall5.rotation.y = Math.PI / 2;
  scene.add(wall5);

  let wallGeometry6 = new THREE.PlaneGeometry(100, 100);
  const wall6 = new THREE.Mesh(wallGeometry6, wallMaterial);
  wall6.position.y = 0;
  wall6.position.z = -80;
  scene.add(wall6);
  

  // Techo

  let ceilGeometry = new THREE.PlaneGeometry(200, 230, 100, 100);
  ceilGeometry.rotateX(-Math.PI / 2);

  var ceilMaterial = new THREE.MeshPhongMaterial({
    map: textureWall,
    side: THREE.DoubleSide,
  });

  const ceil = new THREE.Mesh(ceilGeometry, ceilMaterial);
  ceil.position.y = 45;
  ceil.position.z = -33;
  ceil.position.x = 0;
  scene.add(ceil);

  // ANTECEDENTES

  let antecedentes1Geometry = new THREE.PlaneGeometry(10, 10,1);
  var textureantecedentes1 = new THREE.TextureLoader().load("assets/text1.png");
  var antecedentes1Material = new THREE.MeshPhongMaterial({
    map: textureantecedentes1,
    side: THREE.DoubleSide,
  });

  const antecedentes1 = new THREE.Mesh(antecedentes1Geometry, antecedentes1Material);
  antecedentes1.position.y = 10;
  antecedentes1.position.x = 99;
  antecedentes1.position.z =  70;
  antecedentes1.rotation.y = 3*Math.PI / 2;
  scene.add(antecedentes1);

  let antecedentes2Geometry = new THREE.PlaneGeometry(70, 50,1);
  var textureantecedentes2 = new THREE.TextureLoader().load("assets/colonialismo_clasessociales.png");
  var antecedentes2Material = new THREE.MeshPhongMaterial({
    map: textureantecedentes2,
    side: THREE.DoubleSide,
  });

  const antecedentes2 = new THREE.Mesh(antecedentes2Geometry, antecedentes2Material);
  antecedentes2.position.y = 10;
  antecedentes2.position.x = 99;
  antecedentes2.position.z =  30;
  antecedentes2.rotation.y = 3*Math.PI / 2;
  scene.add(antecedentes2);


  // CONFIG ESCENA

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
}
