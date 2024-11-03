import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'OrbitControls';

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true
});
renderer.outputEncoding = THREE.sRGBEncoding;

let camera = new THREE.PerspectiveCamera(30, 1000 / 600, 0.1, 1000);
camera.position.set(0, 0, 15);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

let loader = new GLTFLoader();
let car;  // To store reference to the car object

// Load the racing track
loader.load('cartoon_race/scene.gltf', function (gltf) {
    gltf.scene.scale.set(5, 5, 5);
    scene.add(gltf.scene);
    scene.background = new THREE.Color('black');

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(0, 5, 5);
    scene.add(dirLight);

    let dirLight2 = new THREE.DirectionalLight(0xff0000, 0.5);
    dirLight2.position.set(5, 5, 0);
    scene.add(dirLight2);

    let dirLight3 = new THREE.DirectionalLight(0x0000ff, 0.5);
    dirLight3.position.set(-5, -5, 0);
    scene.add(dirLight3);

    // Now load the car model
    loadCarModel();
});

function loadCarModel() {
    loader.load('car/scene.gltf', function (gltf) {
        car = gltf.scene;
        car.scale.set(3, 3, 3);  // Adjust scale to fit track
        car.position.set(5, 3, 10);  // Adjust initial position as needed
        scene.add(car);

        animate();
    });
}

// Variables to track car movement
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
            moveForward = true;
            break;
        case 'ArrowDown':
            moveBackward = true;
            break;
        case 'ArrowLeft':
            moveLeft = true;
            break;
        case 'ArrowRight':
            moveRight = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp':
            moveForward = false;
            break;
        case 'ArrowDown':
            moveBackward = false;
            break;
        case 'ArrowLeft':
            moveLeft = false;
            break;
        case 'ArrowRight':
            moveRight = false;
            break;
    }
});

function updateCarPosition() {
    if (car) {
        const speed = 0.5;
        const rotationSpeed = 0.05;

        // Move forward and backward based on the car's direction
        if (moveForward) {
            car.translateZ(speed);  // Move forward along car's local Z-axis
        }
        if (moveBackward) {
            car.translateZ(-speed);  // Move backward along car's local Z-axis
        }

        // Rotate left and right
        if (moveLeft) {
            car.rotation.y += rotationSpeed;
        }
        if (moveRight) {
            car.rotation.y -= rotationSpeed;
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    updateCarPosition();
    controls.update();
    renderer.render(scene, camera);
}
