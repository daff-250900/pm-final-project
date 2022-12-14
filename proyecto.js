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

document.addEventListener(
  "keydown",
  (event) => {
    var name = event.key;
    var code = event.code;
    if (name == "f") {
      window.location = "./performance.html";
    }
  },
  false
);

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

  // EJEMPLO PARA MODELO 3D GLB
  var loadergl = new GLTFLoader();

  var barcoMap = new THREE.TextureLoader().load("assets/desc_barco.png");
  const barcoMaterial = new THREE.SpriteMaterial({
    map: barcoMap,
    depthWrite: false,
  });

  var dbarco = new THREE.Sprite(barcoMaterial);
  dbarco.scale.set(5, 5, 1);
  dbarco.position.y = 8;
  dbarco.position.x = 23;
  dbarco.position.z = 40;
  dbarco.rotateY((3 * Math.PI) / 4);
  scene.add(dbarco);

  var descpMap = new THREE.TextureLoader().load("assets/textop.png");
  const descpMaterial = new THREE.SpriteMaterial({
    map: descpMap,
    depthWrite: false,
  });

  var ddescp = new THREE.Sprite(descpMaterial);
  ddescp.scale.set(5, 5, 1);
  ddescp.position.y = 8;
  ddescp.position.x = -25;
  ddescp.position.z = 40;
  ddescp.rotateY((3 * Math.PI) / 4);
  scene.add(ddescp);

  loadergl.load("./assets/mexican_flag.glb", function (gltf) {
    var flag = gltf.scene; // micro 3D object is loaded
    flag.scale.set(8, 7, 4);
    flag.position.y = 20;
    flag.position.x = 0;
    flag.position.z = -75;
    scene.add(flag);
  });

  loadergl.load("./assets/cabeza_olmeca.glb", function (gltf) {
    var mesa = gltf.scene; // micro 3D object is loaded
    mesa.scale.set(2, 2, 2);
    mesa.position.y = 5;
    mesa.position.x = 30;
    mesa.position.z = 20;
    mesa.rotation.y = (10 * Math.PI) / 8;
    scene.add(mesa);
  });

  loadergl.load("./assets/la_nina.glb", function (gltf) {
    var barco = gltf.scene; // mexpack 3D object is loaded
    barco.scale.set(1.5, 1.5, 1.5);
    barco.position.y = 5;
    barco.position.x = 25;
    barco.position.z = 0;
    barco.rotation.y = (5 * Math.PI) / 8;
    scene.add(barco);
  });


  
  loadergl.load("./assets/calendar.glb", function (gltf) {
    var calendar = gltf.scene; // mexpack 3D object is loaded
    calendar.scale.set(3, 3, 3);
    calendar.position.y = 10;
    calendar.position.x = 25;
    calendar.position.z = -35;
    calendar.rotation.y = (5 * Math.PI) / 8;
    scene.add(calendar);
  });

  loadergl.load("./assets/mask.glb", function (gltf) {
    var mask = gltf.scene; // mexpack 3D object is loaded
    mask.scale.set(15, 15, 15);
    mask.position.y = 15;
    mask.position.x = -25;
    mask.position.z = -35;
    mask.rotation.y = (3 * Math.PI) / 8;
    scene.add(mask);
  });

  loadergl.load("./assets/mexicano.glb", function (gltf) {
    var mexicano = gltf.scene; // mexpack 3D object is loaded
    mexicano.scale.set(7, 7, 7);
    mexicano.position.y = 5;
    mexicano.position.x = -25;
    mexicano.position.z = -15;
    mexicano.rotation.y = (5 * Math.PI) / 8;
    scene.add(mexicano);
  });

  loadergl.load("./assets/mexican_starter_pack.glb", function (gltf) {
    var mexpack = gltf.scene; // mexpack 3D object is loaded
    mexpack.scale.set(0.2, 0.2, 0.2);
    mexpack.position.y = 5;
    mexpack.position.x = -30;
    mexpack.position.z = 20;
    mexpack.rotation.y = (5 * Math.PI) / 8;
    scene.add(mexpack);
  });

  let antecedentescristGeometry = new THREE.PlaneGeometry(8, 10, 1);
  var textureantecedentescrist = new THREE.TextureLoader().load(
    "assets/desc_crist.png"
  );
  var antecedentescristMaterial = new THREE.MeshPhongMaterial({
    map: textureantecedentescrist,
    side: THREE.DoubleSide,
  });

  const antecedentescrist = new THREE.Mesh(
    antecedentescristGeometry,
    antecedentescristMaterial
  );
  antecedentescrist.position.y = 10;
  antecedentescrist.position.x = 98;
  antecedentescrist.position.z = -73;
  antecedentescrist.rotation.y = (3 * Math.PI) / 2;
  scene.add(antecedentescrist);

  loadergl.load("./assets/cristobal_colon.glb", function (gltf) {
    var crist = gltf.scene; // micro 3D object is loaded
    crist.scale.set(1, 1, 0.9);
    crist.position.y = 10;
    crist.position.x = 80;
    crist.position.z = -90;
    crist.rotation.y = -((3 * Math.PI) / 2);
    scene.add(crist);
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

  let video2 = document.createElement("video");
  video2.src = "./assets/noalclasismo.mp4";
  video2.autoplay = true;
  video2.loop = true;
  video2.muted = true;
  video2.load();
  video2.play();

  var video2Texture = new THREE.VideoTexture(video2);
  video2Texture.wrapS = video2Texture.wrapT = THREE.ClampToEdgeWrapping;
  video2Texture.minFilter = THREE.LinearFilter;
  var exhibition2Material = new THREE.MeshPhongMaterial({
    map: video2Texture,
    side: THREE.DoubleSide,
  });

  var exhibition2Geometry = new THREE.PlaneGeometry(70, 40);
  var exibition2Mesh = new THREE.Mesh(exhibition2Geometry, exhibition2Material);
  exibition2Mesh.position.y = 25;
  exibition2Mesh.position.z = -83;
  exibition2Mesh.rotation.y = -Math.PI;
  scene.add(exibition2Mesh);

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

  // PAREDES
  let wallGeometry2 = new THREE.PlaneGeometry(240, 100);
  var textureWall2 = new THREE.TextureLoader().load("./assets/wine.jpg");
  var wallMaterial2 = new THREE.MeshPhongMaterial({
    map: textureWall2,
    side: THREE.DoubleSide,
  });

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

  const wall4 = new THREE.Mesh(wallGeometry4, wallMaterial2);
  wall4.position.y = 0;
  wall4.position.x = 50;
  wall4.position.z = -20;
  wall4.rotation.y = Math.PI / 2;
  scene.add(wall4);

  const wall5 = new THREE.Mesh(wallGeometry4, wallMaterial2);
  wall5.position.y = 0;
  wall5.position.x = -50;
  wall5.position.z = -20;
  wall5.rotation.y = Math.PI / 2;
  scene.add(wall5);

  let wallGeometry6 = new THREE.PlaneGeometry(100, 100);
  const wall6 = new THREE.Mesh(wallGeometry6, wallMaterial2);
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

  let antecedentes1Geometry = new THREE.PlaneGeometry(8, 8, 1);
  var textureantecedentes1 = new THREE.TextureLoader().load(
    "assets/desc_castas.png"
  );
  var antecedentes1Material = new THREE.MeshPhongMaterial({
    map: textureantecedentes1,
    side: THREE.DoubleSide,
  });

  const antecedentes1 = new THREE.Mesh(
    antecedentes1Geometry,
    antecedentes1Material
  );
  antecedentes1.position.y = 10;
  antecedentes1.position.x = 99;
  antecedentes1.position.z = 56;
  antecedentes1.rotation.y = (3 * Math.PI) / 2;
  scene.add(antecedentes1);

  let antecedentes2Geometry = new THREE.PlaneGeometry(60, 50, 1);
  var textureantecedentes2 = new THREE.TextureLoader().load(
    "assets/castas.jpg"
  );
  var antecedentes2Material = new THREE.MeshPhongMaterial({
    map: textureantecedentes2,
    side: THREE.DoubleSide,
  });

  const antecedentes2 = new THREE.Mesh(
    antecedentes2Geometry,
    antecedentes2Material
  );
  antecedentes2.position.y = 20;
  antecedentes2.position.x = 99;
  antecedentes2.position.z = 20;
  antecedentes2.rotation.y = (3 * Math.PI) / 2;
  scene.add(antecedentes2);

  let antecedentes3descGeometry = new THREE.PlaneGeometry(8, 8, 1);
  var textureantecedentes3desc = new THREE.TextureLoader().load(
    "assets/desc_piramide.png"
  );
  var antecedentes3descMaterial = new THREE.MeshPhongMaterial({
    map: textureantecedentes3desc,
    side: THREE.DoubleSide,
  });

  const antecedentes3desc = new THREE.Mesh(
    antecedentes3descGeometry,
    antecedentes3descMaterial
  );
  antecedentes3desc.position.y = 10;
  antecedentes3desc.position.x = 51;
  antecedentes3desc.position.z = -40;
  antecedentes3desc.rotation.y = Math.PI / 2;
  scene.add(antecedentes3desc);

  let antecedentes3Geometry = new THREE.PlaneGeometry(40, 30, 1);
  var textureantecedentes3 = new THREE.TextureLoader().load(
    "assets/piramide.jpg"
  );
  var antecedentes3Material = new THREE.MeshPhongMaterial({
    map: textureantecedentes3,
    side: THREE.DoubleSide,
  });

  const antecedentes3 = new THREE.Mesh(
    antecedentes3Geometry,
    antecedentes3Material
  );
  antecedentes3.position.y = 10;
  antecedentes3.position.x = 51;
  antecedentes3.position.z = -15;
  antecedentes3.rotation.y = (6 * Math.PI) / 4;
  scene.add(antecedentes3);

  // ACTUAL

  video = document.createElement("video");
  video.src = "./assets/actual1.mp4";
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

  var exhibitionGeometry = new THREE.PlaneGeometry(20, 30);
  var exibitionMesh = new THREE.Mesh(exhibitionGeometry, exhibitionMaterial);
  exibitionMesh.position.y = 20;
  exibitionMesh.position.z = -140;
  exibitionMesh.position.x = -80;
  scene.add(exibitionMesh);

  let texto1Geometry = new THREE.PlaneGeometry(10, 10, 1);
  var texturetexto1 = new THREE.TextureLoader().load("assets/texto1.jpg");
  var texto1Material = new THREE.MeshPhongMaterial({
    map: texturetexto1,
    side: THREE.DoubleSide,
  });

  const texto1 = new THREE.Mesh(texto1Geometry, texto1Material);
  texto1.position.y = 10;
  texto1.position.x = -63;
  texto1.position.z = -140;
  scene.add(texto1);

  let actual1Geometry = new THREE.PlaneGeometry(40, 30, 1);
  var textureactual1 = new THREE.TextureLoader().load("assets/actual2.jpeg");
  var actual1Material = new THREE.MeshPhongMaterial({
    map: textureactual1,
    side: THREE.DoubleSide,
  });

  const actual1 = new THREE.Mesh(actual1Geometry, actual1Material);
  actual1.position.y = 20;
  actual1.position.x = -35;
  actual1.position.z = -140;
  scene.add(actual1);

  let texto3Geometry = new THREE.PlaneGeometry(10, 10, 1);
  var texturetexto3 = new THREE.TextureLoader().load("assets/texto3.jpg");
  var texto3Material = new THREE.MeshPhongMaterial({
    map: texturetexto3,
    side: THREE.DoubleSide,
  });

  const texto3 = new THREE.Mesh(texto3Geometry, texto3Material);
  texto3.position.y = 10;
  texto3.position.x = -5;
  texto3.position.z = -140;
  scene.add(texto3);

  video = document.createElement("video");
  video.src = "./assets/actual5.mp4";
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

  var exhibitionGeometry = new THREE.PlaneGeometry(20, 30);
  var exibitionMesh = new THREE.Mesh(exhibitionGeometry, exhibitionMaterial);
  exibitionMesh.position.y = 20;
  exibitionMesh.position.z = -140;
  exibitionMesh.position.x = 15;
  scene.add(exibitionMesh);

  let texto2Geometry = new THREE.PlaneGeometry(10, 10, 1);
  var texturetexto2 = new THREE.TextureLoader().load("assets/texto2.jpg");
  var texto2Material = new THREE.MeshPhongMaterial({
    map: texturetexto2,
    side: THREE.DoubleSide,
  });

  const texto2 = new THREE.Mesh(texto2Geometry, texto2Material);
  texto2.position.y = 10;
  texto2.position.x = 35;
  texto2.position.z = -140;
  scene.add(texto2);

  let actual2Geometry = new THREE.PlaneGeometry(30, 40, 1);
  var textureactual2 = new THREE.TextureLoader().load("assets/actual3.jpeg");
  var actual2Material = new THREE.MeshPhongMaterial({
    map: textureactual2,
    side: THREE.DoubleSide,
  });

  const actual2 = new THREE.Mesh(actual2Geometry, actual2Material);
  actual2.position.y = 20;
  actual2.position.x = -99;
  actual2.position.z = -110;
  actual2.rotation.y = Math.PI / 2;
  scene.add(actual2);

  let actual3Geometry = new THREE.PlaneGeometry(50, 30, 1);
  var textureactual3 = new THREE.TextureLoader().load("assets/actual0.jpg");
  var actual3Material = new THREE.MeshPhongMaterial({
    map: textureactual3,
    side: THREE.DoubleSide,
  });

  const actual3 = new THREE.Mesh(actual3Geometry, actual3Material);
  actual3.position.y = 20;
  actual3.position.x = 70;
  actual3.position.z = -140;

  scene.add(actual3);

  // FUTURO

  let futuro1Geometry = new THREE.PlaneGeometry(50, 30, 1);
  var texturefuturo1 = new THREE.TextureLoader().load("assets/stable1.png");
  var futuro1Material = new THREE.MeshPhongMaterial({
    map: texturefuturo1,
    side: THREE.DoubleSide,
  });

  const futuro1 = new THREE.Mesh(futuro1Geometry, futuro1Material);
  futuro1.position.y = 18;
  futuro1.position.x = -99;
  futuro1.position.z = 30;
  futuro1.rotation.y = (3 * Math.PI) / 2;
  scene.add(futuro1);

  let futuro5Geometry = new THREE.PlaneGeometry(10, 10, 1);
  var texturefuturo5 = new THREE.TextureLoader().load("assets/textof2.jpg");
  var futuro5Material = new THREE.MeshPhongMaterial({
    map: texturefuturo5,
    side: THREE.DoubleSide,
  });

  const futuro5 = new THREE.Mesh(futuro5Geometry, futuro5Material);
  futuro5.position.y = 17;
  futuro5.position.x = -99;
  futuro5.position.z = -5;
  futuro5.rotation.y = Math.PI / 2;
  scene.add(futuro5);

  let futuro2Geometry = new THREE.PlaneGeometry(40, 20, 1);
  var texturefuturo2 = new THREE.TextureLoader().load("assets/stable2.png");
  var futuro2Material = new THREE.MeshPhongMaterial({
    map: texturefuturo2,
    side: THREE.DoubleSide,
  });

  const futuro2 = new THREE.Mesh(futuro2Geometry, futuro2Material);
  futuro2.position.y = 15;
  futuro2.position.x = -52;
  futuro2.position.z = 15;
  futuro2.rotation.y = (3 * Math.PI) / 2;
  scene.add(futuro2);

  let futuro6Geometry = new THREE.PlaneGeometry(10, 10, 1);
  var texturefuturo6 = new THREE.TextureLoader().load("assets/textof1.jpg");
  var futuro6Material = new THREE.MeshPhongMaterial({
    map: texturefuturo6,
    side: THREE.DoubleSide,
  });

  const futuro6 = new THREE.Mesh(futuro6Geometry, futuro6Material);
  futuro6.position.y = 15;
  futuro6.position.x = -52;
  futuro6.position.z = -18;
  futuro6.rotation.y = (3 * Math.PI) / 2;
  scene.add(futuro6);

  let futuro3Geometry = new THREE.PlaneGeometry(40, 20, 1);
  var texturefuturo3 = new THREE.TextureLoader().load("assets/stable3.png");
  var futuro3Material = new THREE.MeshPhongMaterial({
    map: texturefuturo3,
    side: THREE.DoubleSide,
  });

  const futuro3 = new THREE.Mesh(futuro3Geometry, futuro3Material);
  futuro3.position.y = 15;
  futuro3.position.x = -52;
  futuro3.position.z = -50;
  futuro3.rotation.y = (3 * Math.PI) / 2;
  scene.add(futuro3);

  let futuro4Geometry = new THREE.PlaneGeometry(10, 10, 1);
  var texturefuturo4 = new THREE.TextureLoader().load("assets/textof3.jpg");
  var futuro4Material = new THREE.MeshPhongMaterial({
    map: texturefuturo4,
    side: THREE.DoubleSide,
  });

  const futuro4 = new THREE.Mesh(futuro4Geometry, futuro4Material);
  futuro4.position.y = 17;
  futuro4.position.x = -99;
  futuro4.position.z = -78;
  futuro4.rotation.y = Math.PI / 2;
  scene.add(futuro4);

  let textof1Geometry = new THREE.PlaneGeometry(50, 30, 1);
  var texturetextof1 = new THREE.TextureLoader().load("assets/memes.jpeg");
  var textof1Material = new THREE.MeshPhongMaterial({
    map: texturetextof1,
    side: THREE.DoubleSide,
  });

  const textof1 = new THREE.Mesh(textof1Geometry, textof1Material);
  textof1.position.y = 17;
  textof1.position.x = -99;
  textof1.position.z = -45;
  textof1.rotation.y = Math.PI / 2;
  scene.add(textof1);

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
