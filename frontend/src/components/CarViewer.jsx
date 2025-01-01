import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import Stats from 'three/addons/libs/stats.module.js';

const CarViewer = () => {
    const [car, setCar] = useState("sedan.glb");
    const [lookAtPointArr, setLookAtPointArr] = useState([0, 1.9, 0]);
    const containerRef = useRef(null);
    const carRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const rendererRef = useRef(null);
    const statsRef = useRef(null);
    const selectedMeshRef = useRef(null);
    const [isDriverView, setIsDriverView] = useState(false);

    const driverPosition = new THREE.Vector3(0.3, 1.0, 0.3);
    const externalPosition = new THREE.Vector3(4.25, 2.5, -4.5);

    // Initialize the showroom and scene
    useEffect(() => {
        const container = containerRef.current;

        // Setup renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.85;
        renderer.setClearColor(0x000000, 0); // Transparent background
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Setup camera
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 500);
        camera.position.copy(externalPosition);
        cameraRef.current = camera;

        // Setup controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 1; // Prevents the camera from getting too close
        controls.maxDistance = 9; // Maximum zoom-out distance
        controls.maxPolarAngle = THREE.MathUtils.degToRad(85); // Prevent looking directly down
        controls.minPolarAngle = THREE.MathUtils.degToRad(15); 
        controls.target.set(0, 0.5, 0);
        controls.update();
        controlsRef.current = controls;

        // Setup scene
        const scene = new THREE.Scene();
        scene.background = null; // Remove the gray background
        scene.fog = null; // Remove fog if not needed
        new RGBELoader().load('/textures/equirectangular/venice_sunset_1k.hdr', (texture) => {
            scene.environment = texture;
            scene.environment.mapping = THREE.EquirectangularReflectionMapping;
        });
        sceneRef.current = scene;

        // Add grid helper
        const grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
        grid.material.opacity = 0.2;
        grid.material.depthWrite = false;
        grid.material.transparent = true;
        scene.add(grid);

        // Setup stats
        const stats = new Stats();
        container.appendChild(stats.dom);
        statsRef.current = stats;

        // Load the showroom
        const loader = new GLTFLoader();
        loader.load('/models/gltf/showroom.glb', (gltf) => {
            const showroom = gltf.scene;
            const boxHelper = new THREE.BoxHelper(showroom, 0xff0000);
            scene.add(boxHelper);
            scene.add(showroom);
        });

        // Event listeners
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);
        const showroomBounds = {
            minX: -15, maxX: 7,  // Horizontal bounds
            minY: 0.5, maxY: 14, // Vertical bounds (roof at y = 4)
            minZ: -5, maxZ: 5   // Depth bounds
        };
        
        
        const clampPosition = (position, bounds) => {
            position.x = THREE.MathUtils.clamp(position.x, bounds.minX, bounds.maxX);
            position.y = THREE.MathUtils.clamp(position.y, bounds.minY, bounds.maxY);
            position.z = THREE.MathUtils.clamp(position.z, bounds.minZ, bounds.maxZ);
        };
        
        const animate = () => {
            controls.update();
            stats.update();
        
            // Clamp camera position to showroom bounds
            //clampPosition(camera.position, showroomBounds);
        
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            // Cleanup resources
            renderer.dispose();
            window.removeEventListener('resize', onResize);
            container.innerHTML = '';
        };
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        const controls = controlsRef.current;

        // Reset driver view if active
        if (isDriverView) {
            // Move camera to external view
            camera.position.copy(externalPosition);
            controls.target.set(0, 0.5, 0);
            controls.maxDistance = 9;
            controls.enablePan = true;
            controls.enableZoom = true;
            controls.minDistance = 0;
            controls.update();

            setIsDriverView(false); // Reset driver view state
        }

        // Remove previous car if it exists
        if (carRef.current) {
            scene.remove(carRef.current);
            carRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach((mat) => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }

        // Load the new car
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/jsm/libs/draco/gltf/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        console.log("========================")
        loader.load(`/models/gltf/${car}`, (gltf) => {
            const carModel = gltf.scene;
            carRef.current = carModel;

            carModel.traverse((child) => {
                const clickableParts = [
                    "seats",
                    "seats001",
                    "body",
                    "body001",
                    "body002",
                    "body003",
                    "body_1",
                    "body_2",
                    "body_3",
                    "windows",
                    "windows001",
                    "windows002",
                    "windows003",
                    "windows004",
                    "windows005",
                    "windows006",
                    "guide",
                    "guide001",
                    "internal",
                    "internal001",
                    "internal two",
                    "internal_two",
                    "glass_front",
                    "glass_front001",
                    "glass_back",
                    "glass_back001",
                    "glass_back_1",
                ];
                const glassMaterial = new THREE.MeshPhysicalMaterial({
                    color: 0xffffff, // Clear glass
                    metalness: 0.0, // Minimal metallic effect
                    roughness: 0.05, // Smooth surface with slight imperfections
                    transmission: 0.95, // High transparency
                    clearcoat: 1.0, // Strong clear coat for enhanced reflections
                    clearcoatRoughness: 0.0, // Perfectly polished clear coat
                    ior: 1.5, // Index of refraction for glass
                    envMapIntensity: 1.0, // Enhance environment map reflections
                    depthWrite: true, // Ensure depth sorting works correctly
                    transparent: true,
                });
                glassMaterial.side = THREE.DoubleSide;

                if (child.isMesh) {
                    console.log(child.name)
                    if (
                        child.name.includes('windows') || child.name.includes('windows001') || child.name.includes('windows002') || child.name.includes('windows003') || child.name.includes('windows004') || child.name.includes('windows005') || child.name.includes('windows006') || child.name.includes('glass_front') || child.name.includes('glass_back') || child.name.includes('glass_front001') || child.name.includes('glass_back001') || child.name.includes('glass_back_1')
                    ) {
                        child.material = glassMaterial;
                        child.renderOrder = 1;
                    }
                    if (clickableParts.includes(child.name)) {
                        child.userData.clickable = true; // Mark as clickable
                    }
                }
            });

            scene.add(carModel);
        });
    }, [car]);

    // Handle color picker and click events
    useEffect(() => {
        const scene = sceneRef.current;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const colorPicker = document.getElementById('color-picker');
        const glassRange = document.getElementById('glass-range');

        const onClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, cameraRef.current);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object;
                if (clickedMesh.userData.clickable) {
                    if (
                        clickedMesh.name.includes('windows') ||
                        clickedMesh.name.includes('glass_front') ||
                        clickedMesh.name.includes('glass_back')
                    ) {
                        // Show the range slider for glass color adjustment
                        selectedMeshRef.current = clickedMesh;
                        glassRange.style.display = 'block';
                        colorPicker.style.display = 'none';
                        // Initialize the slider position based on the current glass color
                        const currentBrightness = clickedMesh.material.color.r; // Assuming R, G, and B are equal
                        glassRange.value = currentBrightness;
                    } else {
                        // For other meshes, use the color picker
                        selectedMeshRef.current = clickedMesh;
                        colorPicker.value = `#${clickedMesh.material.color.getHexString()}`;
                        colorPicker.style.display = 'block';

                        // Hide the range slider if it's visible
                        glassRange.style.display = 'none';
                    }
                }
            } else {
                // Hide both color picker and range slider if no mesh is clicked
                colorPicker.style.display = 'none';
                glassRange.style.display = 'none';
                selectedMeshRef.current = null;
            }
        };

        const onGlassRangeChange = (event) => {
            if (selectedMeshRef.current) {
                const brightness = parseFloat(event.target.value);
                const colorValue = brightness * 255; // Convert 0-1 to 0-255
                const hexColor = (colorValue << 16) | (colorValue << 8) | colorValue; // RGB to Hex
                selectedMeshRef.current.material.color.setHex(hexColor);
            }
        };

        const onColorChange = (event) => {
            if (selectedMeshRef.current) {
                selectedMeshRef.current.material.color.set(event.target.value);
            }
        };

        window.addEventListener('click', onClick);
        glassRange.addEventListener('input', onGlassRangeChange);
        colorPicker.addEventListener('input', onColorChange);

        return () => {
            window.removeEventListener('click', onClick);
            glassRange.removeEventListener('input', onGlassRangeChange);
            colorPicker.removeEventListener('input', onColorChange);
        };
    }, []);

    const toggleDriverView = () => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;

        if (isDriverView) {
            animateCamera(externalPosition, new THREE.Vector3(0, 0.5, 0), "Driver's View");
            controls.maxDistance = 9;
            controls.enablePan = true;
            controls.enableZoom = true;
            controls.minDistance = 0;
            setIsDriverView(false);
        } else {
            animateCamera(driverPosition, new THREE.Vector3(...lookAtPointArr), "Exit Driver's View");
            controls.enablePan = false;
            controls.enableZoom = false;
            controls.minDistance = controls.maxDistance = 0.1;
            setIsDriverView(true);
        }
    };
    const animateCamera = (targetPosition, targetLookAt, buttonText) => {
        const camera = cameraRef.current;
        const controls = controlsRef.current;

        const startPosition = camera.position.clone();
        const startTarget = controls.target.clone();
        const duration = 1500;
        let startTime = null;

        const animationStep = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = Math.min(elapsed / duration, 1);

            camera.position.lerpVectors(startPosition, targetPosition, t);
            controls.target.lerpVectors(startTarget, targetLookAt, t);
            controls.update();

            if (t < 1) {
                requestAnimationFrame(animationStep);
            }
        };
        requestAnimationFrame(animationStep);
    };

    return (
        <div id="body">
            <input type="color" id="color-picker" style={{
                position: 'absolute',
                top: "20px",
                right: "290px",
                zIndex: "999"
            }} />
            <input
                type="range"
                id="glass-range"
                min="0"
                max="1"
                step="0.01"
                style={{
                    position: 'absolute',
                    top: "20px",
                    right: "390px",
                    zIndex: "999"
                }}
            />

            <button id="driver-view-btn" onClick={toggleDriverView}>
                {isDriverView ? "Exit Driver's View" : "Driver's View"}
            </button>
            <select
                id="driver-view-btn2"
                onChange={(event) => {
                    const selectedCar = event.target.value;
                    setLookAtPointArr(
                        selectedCar === "sedan.glb"
                            ? [0, 1.9, 0]
                            : selectedCar === "4x4.glb"
                                ? [0, 2, 0]
                                :  selectedCar === "sportCar.glb" 
                                ? [0, 1.9, 0]
                                : [0, 2,0]
                    );
                    setCar(selectedCar);
                }}
            >
                <option value="sedan.glb">Sedan car</option>
                <option value="sportCar.glb">Sports car</option>
                <option value="4x4.glb">Quad car</option>
                <option value="middelCar.glb">Familiy car</option>
            </select>
            <div id="container" ref={containerRef}></div>
        </div>
    );
};

export default CarViewer;
