import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a ground plane
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
scene.add(plane);

//TREES -------------------------------------------------------------------------------
function addTree(z, x) {
    const trunkGeometry = new THREE.BoxGeometry(1,5,1);
    const trunkMaterial = new THREE.MeshStandardMaterial({color: 0x551100 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.x = x
    trunk.position.z = z 
    trunk.position.y = 0;
    scene.add(trunk);

    const leavesGeometry = new THREE.BoxGeometry(3,2 + Math.random() * 5,3);
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x119900 });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.x = x
    leaves.position.z = z 
    leaves.position.y = 4;
    scene.add(leaves);
}

function addMEGATree(z, x) {
    const trunkGeometry = new THREE.BoxGeometry(1,5,1);
    const trunkMaterial = new THREE.MeshStandardMaterial({color: 0x551100 });
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
}



addTree(0,1)
addTree(6,7)
addTree(-6,10)
addTree(0,50)
addTree(0,150)
addMEGATree(0,250)


const loader = new OBJLoader();
let sofa;

// load a resource
loader.load(
    // resource URL
    'sofa.obj',
    // called when resource is loaded
    function (s) {
        sofa = s;
        sofa.position.set(0, -1, 0)
        scene.add(sofa);
    }
)

//LIGHTS-------------------------------------------------------------------------------------------

// Add a point light
const light = new THREE.PointLight(0xefefef, 1, 300);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x407040); // soft white light
scene.add(ambientLight);
//-----------------------------------------------------------------------------------------------

/*const sofaGeometry = new THREE.BoxGeometry(2,1,1);
const sofaMaterial = new THREE.MeshStandardMaterial({color: 0x441188 });
const sofa = new THREE.Mesh(sofaGeometry, sofaMaterial);
*/

const cameraRadius = 5
camera.position.set(0, 1.5, cameraRadius);
const speed = 0.1;

var vz = 1
var vx = 0
const speedMultiplyier = 1
const rotationSpeed = 0.1
let keysPressed = {};   


// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (keysPressed['ArrowUp']) {
        sofa.position.z -= vz * speedMultiplyier;
        sofa.position.x -= vx * speedMultiplyier;
        camera.position.z -= vz * speedMultiplyier;
        camera.position.x -= vx * speedMultiplyier;
    }
    if (keysPressed['ArrowDown']) {
        sofa.position.z += vz * speedMultiplyier;
        sofa.position.x += vx * speedMultiplyier;
        camera.position.z += vz * speedMultiplyier;
        camera.position.x += vx * speedMultiplyier
    }
    if (keysPressed['ArrowLeft']) {
        sofa.rotation.y += rotationSpeed;
        camera.rotation.y += rotationSpeed;
        camera.position.z = sofa.position.z + cameraRadius*Math.cos(camera.rotation.y)
        camera.position.x = sofa.position.x + cameraRadius*Math.sin(camera.rotation.y)
        vz = Math.cos(camera.rotation.y)
        vx = Math.sin(camera.rotation.y)
    }
    if (keysPressed['ArrowRight']) {
        sofa.rotation.y -= rotationSpeed;
        camera.rotation.y -= rotationSpeed;
        camera.position.z = sofa.position.z + cameraRadius*Math.cos(camera.rotation.y)
        camera.position.x = sofa.position.x + cameraRadius*Math.sin(camera.rotation.y)
        vz = Math.cos(camera.rotation.y)
        vx = Math.sin(camera.rotation.y)
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
