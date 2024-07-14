import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


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
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x403000 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
scene.add(plane);


const ikeaGeometry = new THREE.BoxGeometry(100,30,100);
const ikeaMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff });
const ikea = new THREE.Mesh(ikeaGeometry, ikeaMaterial);
ikea.position.z = 250;
scene.add(ikea);

const music = new Audio('FSODFflute.mp3')
music.loop = true
music.play()

//TREES -------------------------------------------------------------------------------

//const trees = [];
//const treesBoundingBoxes = [];

function addTree(z, x) {
    //const trunkGeometry = new THREE.BoxGeometry(1,30,1);
    const trunkGeometry = new THREE.CylinderGeometry(0.3,1,30,10);
    const trunkMaterial = new THREE.MeshStandardMaterial({color: 0x190100 });
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

    return [trunk, leaves];
}

var trees = [];
var leavesArray = [];
var leavesList = [];    


for (let i = - worldSize/2; i < worldSize/2; i++) {
    trees[i + worldSize/2] = [];
    leavesArray[i + worldSize/2] = [];
    for (let j = -worldSize/2; j < worldSize/2; j++) {
        if (Math.random() < 0.008 && (i != 0 && j != 0)) {
            const t = addTree(i, j);
            trees[i + worldSize/2][j + worldSize/2] = t[0];
            leavesArray[i + worldSize/2][j + worldSize/2] = t[1];
            leavesList.push(t[1]);
        } else {
            trees[i + worldSize/2][j + worldSize/2] = -1;
            leavesArray[i + worldSize/2][j + worldSize/2] = -1;
        }
    } 
} 

//LIGHTS-------------------------------------------------------------------------------------------

// Add a point light
const light = new THREE.PointLight(0xefefef, 1, 0);
light.position.set(10, 10, 10);
scene.add(light);

// const light = new THREE.PointLight(0xefefef, 2, 0);
// light.position.set(200, 10, 200);
// scene.add(light);

const hLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( hLight );


const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
scene.add(ambientLight);
//-------------------------------------------------------------------------------------------

/*const sofaGeometry = new THREE.BoxGeometry(2,1,1);
const sofaMaterial = new THREE.MeshStandardMaterial({color: 0x441188 });
const sofa = new THREE.Mesh(sofaGeometry, sofaMaterial);
*/



const loader = new OBJLoader();
let sofa;

const loaderGLTF = new GLTFLoader();

loaderGLTF.load( './models/chair/chair.glb', function ( gltf ) {
    gltf.scene.scale.set(0.015, 0.015, 0.015);
    sofa = gltf.scene;
    sofa.position.set(0, -1, 0);
    scene.add( sofa );
}, undefined, function ( error ) {
    console.error( error );
} );


// loader.load(
//     'sofa.obj',
//     function (obj) {
//         sofa = obj;
//         sofa.position.set(0, -1, 0);
//         scene.add(sofa);
//     }
// )




const cameraRadius = 5
const cameraXRotation = 10
camera.position.set(0, 1.5, cameraRadius);
camera.rotation.set(0, 0, 0);
const speed = 0.02;

var vz = 1
var vx = 0
const speedMultiplyier = 0.25
const rotationSpeed = 0.05
let keysPressed = {};   


const leavesMp3 = new Audio('leaves.mp3');
leavesMp3.volume = 0.5;

//const ikeaTagMaterial = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('ikea.jpg') });
//ikea.material = ikeaTagMaterial;

const ikeaTagTextureLoader = new THREE.TextureLoader();
const ikeaTagTexture = ikeaTagTextureLoader.load('ikea.jpg', () => {
    // Set the center of rotation to the center of the texture
    //ikeaTagTexture.center.set(0.5, 0.5);
    // Rotate the texture by 45 degrees (in radians)
    //ikeaTagTexture.rotation = Math.PI / 4;
});

const ikeaTagMaterial = new THREE.MeshBasicMaterial({ map: ikeaTagTexture });


function checkCollision(position, i, j) {
    const sofaBox = new THREE.Box3().setFromObject(sofa);
    sofaBox.translate(position.clone().sub(sofa.position));
    var collisionCandidates = [];
    const x = Math.round(i + worldSize/2);
    const y = Math.round(j + worldSize/2);

    //collisionCandidates.push(trees[x][y]);
    for (let e = -2; e <= 2; e++) {
        for (let k = -2; k <= 2; k++) {
            if (x + e >= 0 && x + e < worldSize &&  y + k >= 0 && y + k < worldSize) {
                collisionCandidates.push(trees[x + e][y + k]);
            }
        } 
    }

    console.log()

    for (let tree of collisionCandidates) {
        if (tree != -1) {
            const treeBox = new THREE.Box3().setFromObject(tree);
            // console.log("tree ", tree);
            // console.log("sofa", sofaBox.getSize(), sofaBox.getCenter());
            // console.log("tree", treeBox.getSize(), treeBox.getCenter());

            sofaBox.expandByScalar(-0.4);
            treeBox.expandByScalar(-0.5);
            // const sHelper = new THREE.Box3Helper(sofaBox, 0xffff00);
            // scene.add(sHelper);
            // const tHelper = new THREE.Box3Helper(treeBox, 0xffff00);
            // scene.add(tHelper);


            if (sofaBox.intersectsBox(treeBox) ) {
                //console.log(ikeaTagTexture.offset);
                //ikeaTagTexture.offset.x += 0.2;
                //tree.material = ikeaTagMaterial;
                
                return true;
            }
        }
    }
    return false;
}

var leavesShiftX = 0;
var leavesShiftZ = 0;
var leavesSpeedX = 0.01;
var leavesSpeedZ = 0.01;


function animate() {
    requestAnimationFrame(animate);
    if (keysPressed['ArrowUp']) {
        const newPosition = sofa.position.clone();
        newPosition.z -= vz * speedMultiplyier;
        newPosition.x -= vx * speedMultiplyier;
            if (!checkCollision(newPosition, newPosition.z, newPosition.x)) {
                sofa.position.copy(newPosition);
                camera.position.z -= vz * speedMultiplyier;
                camera.position.x -= vx * speedMultiplyier;
            } 
        leavesMp3.play();
    }   
    if (keysPressed['ArrowDown']) { 
        const newPosition = sofa.position.clone();
        newPosition.z += vz * speedMultiplyier;
        newPosition.x += vx * speedMultiplyier;
            if (!checkCollision(newPosition, newPosition.z, newPosition.x)) {
                sofa.position.copy(newPosition);
                camera.position.z += vz * speedMultiplyier;
                camera.position.x += vx * speedMultiplyier;
            }
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

    let l;

    leavesShiftX += leavesSpeedX;
    leavesShiftZ += leavesSpeedZ;
    leavesSpeedX -= leavesShiftX / 1500;
    leavesSpeedZ -= leavesShiftZ / 1500;

    for (l in leavesList) {
        leavesList[l].position.x += leavesSpeedX + (Math.random() -0.5) / 30;
        leavesList[l].position.z += leavesSpeedZ + (Math.random() - 0.5) / 30;

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
