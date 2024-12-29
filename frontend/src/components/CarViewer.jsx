import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import Stats from 'three/addons/libs/stats.module.js';

const CarViewer = () => {
    const [car, setCar] = useState("sportCar.glb");
    const [lookAtPointArr, setLookAtPointArr] = useState([0, 1.2, 0]);
    const containerRef = useRef(null);

    useEffect(() => {
        let camera, scene, renderer, stats, controls;
        let selectedMesh = null;
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const colorPicker = document.getElementById('color-picker');
        const driverViewBtn = document.getElementById('driver-view-btn');
        let isDriverView = false;
        const driverPosition = new THREE.Vector3(0.3, 1.0, 0.3);
        const externalPosition = new THREE.Vector3(4.25, 1.4, -4.5);
        const lookAtPoint = new THREE.Vector3(...lookAtPointArr);

        // Initialize the scene
        function init() {
            const container = containerRef.current;
            container.innerHTML = ''; // Clear previous renderer content

            // Setup renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setAnimationLoop(animate);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.85;
            container.appendChild(renderer.domElement);

            // Setup camera
            camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.copy(externalPosition);

            // Setup controls
            controls = new OrbitControls(camera, renderer.domElement);
            controls.maxDistance = 9;
            controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
            controls.target.set(0, 0.5, 0);
            controls.update();

            // Setup scene
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x333333);
            new RGBELoader().load('/textures/equirectangular/venice_sunset_1k.hdr', (texture) => {
                scene.environment = texture;
                scene.environment.mapping = THREE.EquirectangularReflectionMapping;
            });
            scene.fog = new THREE.Fog(0x333333, 10, 15);

            // Setup grid helper
            const grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
            grid.material.opacity = 0.2;
            grid.material.depthWrite = false;
            grid.material.transparent = true;
            scene.add(grid);

            // Setup stats
            stats = new Stats();
            container.appendChild(stats.dom);

            // Load car model
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/jsm/libs/draco/gltf/');
            const loader = new GLTFLoader();
            loader.setDRACOLoader(dracoLoader);
            const glassMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0 });

            loader.load(`/models/gltf/${car}`, (gltf) => {
                const carModel = gltf.scene;

                carModel.traverse((child) => {
                    console.log(child.name)
                    const clickableParts = [
                        "seats",
                        "body",
                        "body001",
                        "body002",
                        "windows",
                        "guide",
                        "internal",
                        "internal two",
                        "glass_front",
                        "glass_back"
                    ];
                    if (child.isMesh) {
                        // Liste des noms des parties cliquable
                        if(child.name.includes('windows') || child.name.includes('glass_front') || child.name.includes('glass_back')){
                            child.material = glassMaterial;
                        }
                        child.userData.clickable = true;
                    } /*else {
                        // Vérifier si le nom correspond à une partie cliquable
                        if (clickableParts.includes(child.name)) {
                            console.log("child include : " + child.name)
                            child.userData.clickable = true; // Marquer comme cliquable
                        }
                    }*/
                });

                scene.add(carModel);
            });


            // Event listeners
            window.addEventListener('resize', onWindowResize);
            window.addEventListener('click', onClick);
            colorPicker.addEventListener('input', onColorChange);
            driverViewBtn.addEventListener('click', toggleDriverView);
        }

        function cleanup() {
            // Dispose of all objects in the scene
            scene.traverse((object) => {
                if (object.isMesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach((mat) => mat.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });

            renderer.dispose();
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('click', onClick);
            colorPicker.removeEventListener('input', onColorChange);
            driverViewBtn.removeEventListener('click', toggleDriverView);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function toggleDriverView() {
            if (isDriverView) {
                animateCamera(externalPosition, new THREE.Vector3(0, 0.5, 0), "Driver's View");
                controls.maxDistance = 9;
                controls.enablePan = true;
                controls.enableZoom = true;
                controls.minDistance = 0;
                isDriverView = false;
            } else {
                animateCamera(driverPosition, lookAtPoint, "Exit Driver's View");
                controls.enablePan = false;
                controls.enableZoom = false;
                controls.minDistance = controls.maxDistance = 0.1;
                isDriverView = true;
            }
        }

        function animateCamera(targetPosition, targetLookAt, buttonText) {
            const startPosition = camera.position.clone();
            const startTarget = controls.target.clone();
            const duration = 1500;
            let startTime = null;

            function animationStep(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const t = Math.min(elapsed / duration, 1);

                camera.position.lerpVectors(startPosition, targetPosition, t);
                controls.target.lerpVectors(startTarget, targetLookAt, t);
                controls.update();

                if (t < 1) {
                    requestAnimationFrame(animationStep);
                } else {
                    driverViewBtn.textContent = buttonText;
                    controls.update();
                }
            }
            requestAnimationFrame(animationStep);
        }

        function onClick(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object;
                if (clickedMesh.userData.clickable) {
                    selectedMesh = clickedMesh;
                    colorPicker.value = `#${selectedMesh.material.color.getHexString()}`;
                    colorPicker.style.display = 'block';
                    colorPicker.style.left = `${event.clientX}px`;
                    colorPicker.style.top = `${event.clientY}px`;
                }
            } else {
                colorPicker.style.display = 'none';
                selectedMesh = null;
            }
        }

        function onColorChange(event) {
            if (selectedMesh) {
                selectedMesh.material.color.set(event.target.value);
            }
        }

        function animate() {
            controls.update();
            renderer.render(scene, camera);
            stats.update();
        }

        // Initialize scene and setup resources
        init();

        // Cleanup resources when the car model changes or component unmounts
        return cleanup;
    }, [car]);

    return (
        <div id="body">
            <input type="color" id="color-picker" />
            <button id="driver-view-btn">Driver's View</button>
            <select
                id='driver-view-btn2'
                onChange={(event) => {
                    const selectedCar = event.target.value;
                    document.getElementById("driver-view-btn").textContent = "Driver's View"
                    setLookAtPointArr(
                        selectedCar === "sedanCar.glb"
                            ? [0, 1.2, 0]
                            : selectedCar === "4x4Car.glb"
                                ? [0, 1.3, 0]
                                : [0, 1.1, 0]
                    );
                    setCar(selectedCar);
                }}
            >
               {/* <option value="sedanCar.glb">Cylinder car</option>*/}
                <option value="sportCar.glb">Sports car</option>
                <option value="4x4Car.glb">Quad car</option>
            </select>
            <div id="container" ref={containerRef}></div>
        </div>
    );
};

export default CarViewer;
