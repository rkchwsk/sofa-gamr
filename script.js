import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({alpha : true, color : 0x110022});
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.setClearColor( 0x110022, 0);
document.body.appendChild(renderer.domElement);

// Create a ground plane


const worldSize = 500;
const planeGeometry = new THREE.PlaneGeometry(worldSize, worldSize);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x303010 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
scene.add(plane);


// const wGeometry = new THREE.SphereGeometry(10);
// const wMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff });
// const w = new THREE.Mesh(wGeometry, wMaterial);
// scene.add(w);

const music = new Audio('FSODF.mp3')
music.loop = true
music.play()

//TREES -------------------------------------------------------------------------------

const trees = [];
const treesBoundingBoxes = [];

function addTree(z, x) {
    const trunkGeometry = new THREE.BoxGeometry(1,30,1);
    const trunkMaterial = new THREE.MeshStandardMaterial({color: 0x220100 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.x = x
    trunk.position.z = z 
    trunk.position.y = 13;
    scene.add(trunk);

    const leavesGeometry = new THREE.BoxGeometry(3,2 + Math.random() * 5,3);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x113300 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.x = x
    leaves.position.z = z 
    leaves.position.y = 28;
    scene.add(leaves);

    trees.push(trunk);
}

function addMEGATree(z, x) {
    const trunkGeometry = new THREE.BoxGeometry(1,5,1);
    const trunkMaterial = new THREE.MeshStandardMaterial({color: 0x021000 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.x = x
    trunk.position.z = z 
    trunk.position.y = 0;
    scene.add(trunk);

    const leavesGeometry = new THREE.BoxGeometry(7,2 + Math.random() * 20,7);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x119900 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.x = x
    leaves.position.z = z 
    leaves.position.y = 10;
    scene.add(leaves);

    trees.push(trunk);
}


for (let i = - worldSize/2; i < worldSize/2; i++) {
    for (let j = -worldSize/2; j < worldSize/2; j++) {
        if (Math.random() < 0.005 && (i != 0 && j != 0)) {
            addTree(i, j);
        }
    } 
} 
/*
addTree(0,1)
addTree(6,7)
addTree(-6,10)
addTree(0,50)
addTree(0,150)
addMEGATree(0,250)
*/
console.log(trees.length);
let cubeABox, cubeBBox;
cubeABox = new THREE.Box3().setFromObject(trees[0]);
//LIGHTS-------------------------------------------------------------------------------------------

// Add a point light
const light = new THREE.PointLight(0xefefef, 1, 1000);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(ambientLight);
//-------------------------------------------------------------------------------------------

/*const sofaGeometry = new THREE.BoxGeometry(2,1,1);
const sofaMaterial = new THREE.MeshStandardMaterial({color: 0x441188 });
const sofa = new THREE.Mesh(sofaGeometry, sofaMaterial);
*/

const loader = new OBJLoader();
let sofa;

// load a resource
loader.load(
    'sofa.obj',
    function (obj) {
        sofa = obj;
        sofa.position.set(0, -1, 0)
        scene.add(sofa);

        cubeBBox = new THREE.Box3().setFromObject(sofa);
    }
)



const cameraRadius = 5
const cameraXRotation = 10
camera.position.set(0, 1.5, cameraRadius);
camera.rotation.set(0, 0, 0);
const speed = 0.02;

var vz = 1
var vx = 0
const speedMultiplyier = 0.05
const rotationSpeed = 0.05
let keysPressed = {};   


const leavesMp3 = new Audio('leaves.mp3');


function checkCollision(position) {
    const sofaBox = new THREE.Box3().setFromObject(sofa);
    sofaBox.translate(position.clone().sub(sofa.position));
    for (let tree of trees) {
        const treeBox = new THREE.Box3().setFromObject(tree);
        if (sofaBox.intersectsBox(treeBox)) {
            return true;
        }
    }
    return false;
}


function animate() {
    requestAnimationFrame(animate);
    if (keysPressed['ArrowUp']) {

        const newPosition = sofa.position.clone();
        newPosition.z -= vz * speedMultiplyier;
        newPosition.x -= vx * speedMultiplyier;
            if (!checkCollision(newPosition)) {
                sofa.position.copy(newPosition);
                camera.position.z -= vz * speedMultiplyier;
                camera.position.x -= vx * speedMultiplyier;
            }

        leavesMp3.play();
    }   
    if (keysPressed['ArrowDown']) { 
        sofa.position.z += vz * speedMultiplyier;
        sofa.position.x += vx * speedMultiplyier;
        camera.position.z += vz * speedMultiplyier;
        camera.position.x += vx * speedMultiplyier
        leavesMp3.play();
    }
    if (keysPressed['ArrowLeft']) {
        sofa.rotation.y += rotationSpeed;
        camera.rotation.y += rotationSpeed;
        camera.position.z = sofa.position.z + cameraRadius*Math.cos(camera.rotation.y)
        camera.position.x = sofa.position.x + cameraRadius*Math.sin(camera.rotation.y)
        vz = Math.cos(sofa.rotation.y)
        vx = Math.sin(sofa.rotation.y)  
        leavesMp3.play();
    }
    if (keysPressed['ArrowRight']) {
        sofa.rotation.y -= rotationSpeed;
        camera.rotation.y -= rotationSpeed;
        camera.position.z = sofa.position.z + cameraRadius*Math.cos(camera.rotation.y)
        camera.position.x = sofa.position.x + cameraRadius*Math.sin(camera.rotation.y)
        vz = Math.cos(sofa.rotation.y)
        vx = Math.sin(sofa.rotation.y)
        leavesMp3.play();
    }

    if (!keysPressed['ArrowUp'] && !keysPressed['ArrowDown'] && !keysPressed['ArrowLeft'] && !keysPressed['ArrowRight']) {
        leavesMp3.pause();
    }


    renderer.render(scene, camera);
}

document.addEventListener('keydown', (event) => {
        keysPressed[event.code] = true;
    });

    // Handle keyup events
document.addEventListener('keyup', (event) => {
        keysPressed[event.code] = false;
    });



animate();
