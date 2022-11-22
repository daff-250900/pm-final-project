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
    var texture = new THREE.TextureLoader().load(
        "./assets/images.jpg"
    );
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
    torusKnotMesh.position.z = -85;
    console.log(torusKnotMesh.position);
    scene.add(torusKnotMesh); 

    // EJEMPLO PARA MODELO 3D GLB
    var loader = new GLTFLoader();

    loader.load("./assets/sword.glb", function (gltf) {
        var sword = gltf.scene; // sword 3D object is loaded
        sword.scale.set(.02, .02, .02);
        sword.position.y = 25;
        sword.position.x = 2;
        sword.position.z = -75;
        scene.add(sword);
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
    var exibitionMesh = new THREE.Mesh(
        exhibitionGeometry,
        exhibitionMaterial
    );
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


    var textMap = new THREE.TextureLoader().load("assets/text1.png");
    const textMaterial = new THREE.SpriteMaterial({
        map: textMap,
        depthWrite: false,
    });

    var sprite2 = new THREE.Sprite(textMaterial);
    sprite2.scale.set(10, 10, 1);
    sprite2.position.y = 10;
    sprite2.position.x = -30;
    sprite2.position.z = -10;
    sprite2.rotateY(Math.PI / 2);
    scene.add(sprite2);


    
    var pyrt = new THREE.TextureLoader().load("assets/colonialismo_clasessociales.png");
    const pyrMaterial = new THREE.SpriteMaterial({
        map: pyrt,
        depthWrite: false,
    });

    var pyr1 = new THREE.Sprite(pyrMaterial);
    pyr1.scale.set(70, 50, 1);
    pyr1.position.y = 10;
    pyr1.position.x = 20;
    pyr1.position.z = -10;
    pyr1.rotateY(Math.PI / 2);
    scene.add(pyr1);
  

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

        if (moveForward || moveBackward)
            velocity.z -= direction.z * 400.0 * delta;
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