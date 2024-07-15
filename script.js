import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';




function initGame() {
    

    // Basic Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({alpha : true, color : 0x110022});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor( 0x110022, 0);
    //document.body.appendChild(renderer.domElement);
    document.getElementById('game-container').appendChild(renderer.domElement);
    // Create a ground plane


    const worldSize = 500;
    const planeGeometry = new THREE.PlaneGeometry(worldSize, worldSize);
    const planeMaterial = new THREE.MeshStandardMaterial({ color:  0x27221f});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    scene.add(plane);


    // const ikeaTextureLoader = new THREE.TextureLoader();
    // const ikeaTexture = ikeaTextureLoader.load('./supplies/images/ikea.jpg', () => {
    //     // Set the center of rotation to the center of the texture
    //     //ikeaTagTexture.center.set(0.5, 0.5);
    //     // Rotate the texture by 45 degrees (in radians)
    //     //ikeaTagTexture.rotation = Math.PI / 4;
    // });

    //const ikeaMaterial = new THREE.MeshBasicMaterial({ map: ikeaTexture });


    const ikeaGeometry = new THREE.BoxGeometry(100,30,100);
    const ikeaMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff });
    const ikea = new THREE.Mesh(ikeaGeometry, ikeaMaterial);
    const ikeaYGeometry = new THREE.BoxGeometry(12,16,12);
    const ikeaYMaterial = new THREE.MeshStandardMaterial({color: 0xffef00 });
    const ikeaY = new THREE.Mesh(ikeaYGeometry, ikeaYMaterial);        
    
    const ikeaDirection = Math.random() * 360;
    ikea.position.x = 250 * Math.cos(ikeaDirection);
    ikea.position.z = 250 * Math.sin(ikeaDirection);
    ikeaY.position.x = 200 * Math.cos(ikeaDirection);
    ikeaY.position.z = 200 * Math.sin(ikeaDirection);
    scene.add(ikea);
    scene.add(ikeaY);
    
    //TREES -------------------------------------------------------------------------------

    //const trees = [];
    //const treesBoundingBoxes = [];

    function addTree(z, x) {
        //const trunkGeometry = new THREE.BoxGeometry(1,30,1);
        const trunkGeometry = new THREE.CylinderGeometry(0.3,1,30,10);
        const trunkMaterial = new THREE.MeshStandardMaterial({color: 0x150a00 });//({color: 0x190100 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.x = x
        trunk.position.z = z 
        trunk.position.y = 13;
        scene.add(trunk);

        const leavesGeometry = new THREE.BoxGeometry(3,2 + Math.random() * 5,3);
        const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x091f00 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.x = x
        leaves.position.z = z 
        leaves.position.y = 28;
        scene.add(leaves);

        return [trunk, leaves];
    }

    var trees = [];
    var leavesArray = [];
    var leavesList   = [];    


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
    const light = new THREE.PointLight(0xefefef, 2, 0);
    light.position.set(10, 10, 10);
    scene.add(light);

    // const light = new THREE.PointLight(0xefefef, 2, 0);
    // light.position.set(200, 10, 200);
    // scene.add(light);

    const hLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 2 );
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

    loaderGLTF.load( './supplies/models/chair/chair.glb', function ( gltf ) {
        gltf.scene.scale.set(0.015, 0.015, 0.015);
        sofa = gltf.scene;
        sofa.position.set(0, -1, 0);
        scene.add( sofa );
    }, undefined, function ( error ) {
        console.error( error );
    } );

    const cameraRadius = 5
    const cameraXRotation = 10
    camera.position.set(0, 1.5, cameraRadius);
    camera.rotation.set(0, 0, 0);
    const speed = 0.02;

    var vz = 1
    var vx = 0
    const speedMultiplyier = 0.08
    const rotationSpeed = 0.02
    let keysPressed = {};   


    const leavesMp3 = new Audio('./supplies/leaves.mp3');
    leavesMp3.volume = 0.5;

    //const ikeaTagMaterial = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('ikea.jpg') });
    //ikea.material = ikeaTagMaterial;

    const ikeaTagTextureLoader = new THREE.TextureLoader();
    const ikeaTagTexture = ikeaTagTextureLoader.load('./supplies/ikea.jpg', () => {
        // Set the center of rotation to the center of the texture
        //ikeaTagTexture.center.set(0.5, 0.5);
        // Rotate the texture by 45 degrees (in radians)
        //ikeaTagTexture.rotation = Math.PI / 4;
    });

    const ikeaTagMaterial = new THREE.MeshBasicMaterial({ map: ikeaTagTexture });


    var beenToIkea = false;
    const ikeaBox = new THREE.Box3().setFromObject(ikea);
    const ikeaYBox = new THREE.Box3().setFromObject(ikeaY);

    function checkIkeaCollision(position) {
        const sofaBox = new THREE.Box3().setFromObject(sofa);
        sofaBox.translate(position.clone().sub(sofa.position));
        if (sofaBox.intersectsBox(ikeaBox) || sofaBox.intersectsBox(ikeaYBox)) {
            if (!beenToIkea) {
                pauseGame();
                //beenToIkea = true;
            }
            return true;
        }
    }



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
                    //pauseGame();
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
    var localLeavesSpeedX; 
    var localLeavesSpeedZ; 
    let l;


    let isPaused = false;

    function pauseGame() {
        isPaused = true;
        document.getElementById('overlay').style.display = 'block';
    }

    function onContinue() {
        isPaused = false;
        document.getElementById('overlay').style.display = 'none';
    }

    document.getElementById('continueBtn').addEventListener('click', onContinue);

    function animate() {
        requestAnimationFrame(animate);
        if (!isPaused) {
            if (keysPressed['ArrowUp']) {
                const newPosition = sofa.position.clone();
                newPosition.z -= vz * speedMultiplyier;
                newPosition.x -= vx * speedMultiplyier;
                checkIkeaCollision(newPosition);
                    if (!checkCollision(newPosition, newPosition.z, newPosition.x) && !checkIkeaCollision(newPosition)) {
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
                checkIkeaCollision(newPosition);
                    if (!checkCollision(newPosition, newPosition.z, newPosition.x) && !checkIkeaCollision(newPosition)) {
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
        }
        if (!keysPressed['ArrowUp'] && !keysPressed['ArrowDown'] && !keysPressed['ArrowLeft'] && !keysPressed['ArrowRight']) {
            leavesMp3.pause();
        }

        

        leavesShiftX += leavesSpeedX;
        leavesShiftZ += leavesSpeedZ;
        leavesSpeedX -= leavesShiftX / 1500;// + (Math.random() -0.5) / 100;
        leavesSpeedZ -= leavesShiftZ / 1500;// + (Math.random() - 0.5) / 100;

        for (l in leavesList) {
            localLeavesSpeedX = leavesSpeedX + (Math.random() -0.5) / 100;
            localLeavesSpeedZ = leavesSpeedZ + (Math.random() -0.5) / 100;
            leavesList[l].position.x += localLeavesSpeedX;// + (Math.random() -0.5) / 30;
            leavesList[l].position.z += localLeavesSpeedZ;// + (Math.random() -0.5) / 30;

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

    //let keysPressed = {};
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let touchThreshold = 20; // Minimum distance to consider a swipe

    // Touch event listeners
    document.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, false);

    document.addEventListener('touchmove', (event) => {
        touchEndX = event.touches[0].clientX;
        touchEndY = event.touches[0].clientY;
        handleSwipe();
    }, false);

    document.addEventListener('touchend', () => {
        handleTouchEnd();
    }, false);

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        //if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY < -touchThreshold) {
                keysPressed['ArrowUp'] = true;
            } else {
                keysPressed['ArrowUp'] = false;
            }
            if (deltaY > touchThreshold) {
                keysPressed['ArrowDown'] = true;
            } else {
                keysPressed['ArrowDown'] = false;
            }
        //} else {
            if (deltaX > touchThreshold) {
                keysPressed['ArrowRight'] = true;
            } else {
                keysPressed['ArrowRight'] = false;
            }
            if (deltaX < -touchThreshold) {
                keysPressed['ArrowLeft'] = true;
            } else {
                keysPressed['ArrowLeft'] = false;
            }
        //}
    }

    function handleTouchEnd() {
        keysPressed['ArrowUp'] = false;
        keysPressed['ArrowDown'] = false;
        keysPressed['ArrowRight'] = false;
        keysPressed['ArrowLeft'] = false;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate();
}

// Show loading screen for 9 seconds
function showLoadingScreen() {
    const loadingBar = document.getElementById('loading-bar');
    const startButton = document.getElementById('start-button');
    const loadingImage = document.getElementById('loading-image');
    const loadingText = document.getElementById('loading-text').querySelector('p');

    const images = [
        { src: './supplies/images/loading1.jpg', text: 'All of a sudden an old sofa gains consciousness in the calm forest...' },
        { src: './supplies/images/loading2.jpg', text: 'Use arrows or touchscreen to navigate the forest...' },
        { src: './supplies/images/loading3.jpg', text: 'We recommend to turn the music on...' }
    ];

    let currentIndex = 0;

    function changeImageAndText() {
        const { src, text } = images[currentIndex];
        loadingImage.src = src;
        loadingText.textContent = text;
        currentIndex = (currentIndex + 1) % images.length;
    }

    changeImageAndText();
    const intervalId = setInterval(changeImageAndText, 4000);

    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 0); // Trigger the transition

    setTimeout(() => {
        clearInterval(intervalId);
        startButton.style.display = 'block';
    }, 12000); // 3 images * 3 seconds each = 9 seconds
}

// Start the game when the start button is clicked
function setupStartButton() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        initGame();
    });
}

const music = new Audio('./supplies/FSODFflute.mp3');
music.loop = true;

function setupPreloadScreen() {
    const preloadScreen = document.getElementById('preload-screen');

    function startLoading() {
        preloadScreen.style.display = 'none';
        music.play();
        document.getElementById('loading-screen').style.display = 'flex';
        showLoadingScreen();
        setupStartButton();
    }

    window.addEventListener('keydown', startLoading, { once: true });
    window.addEventListener('touchstart', startLoading, { once: true });
}

setupPreloadScreen();
