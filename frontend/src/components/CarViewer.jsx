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
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.85;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Setup camera
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.copy(externalPosition);
        cameraRef.current = camera;

        // Setup controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.maxDistance = 9;
        controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
        controls.target.set(0, 0.5, 0);
        controls.update();
        controlsRef.current = controls;

        // Setup scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x333333);
        new RGBELoader().load('/textures/equirectangular/venice_sunset_1k.hdr', (texture) => {
            scene.environment = texture;
            scene.environment.mapping = THREE.EquirectangularReflectionMapping;
        });
        scene.fog = new THREE.Fog(0x333333, 10, 15);
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
            scene.add(showroom);
        });

        // Event listeners
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        // Animation loop
        const animate = () => {
            controls.update();
            stats.update();
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
                    "body",
                    "body001",
                    "body002",
                    "windows",
                    "windows001",
                    "windows002",
                    "windows003",
                    "windows004",
                    "windows005",
                    "guide",
                    "internal",
                    "internal two",
                    "internal_two",
                    "glass_front",
                    "glass_back",
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
                        child.name.includes('windows') || child.name.includes('windows001') || child.name.includes('windows002') || child.name.includes('windows003') || child.name.includes('windows004') || child.name.includes('windows005') || child.name.includes('glass_front') || child.name.includes('glass_back')
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

        const onClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, cameraRef.current);
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object;
                if (clickedMesh.userData.clickable) {
                    selectedMeshRef.current = clickedMesh;
                    colorPicker.value = `#${clickedMesh.material.color.getHexString()}`;
                    colorPicker.style.display = 'block';
                    colorPicker.style.left = `${event.clientX}px`;
                    colorPicker.style.top = `${event.clientY}px`;
                }
            } else {
                colorPicker.style.display = 'none';
                selectedMeshRef.current = null;
            }
        };

        const onColorChange = (event) => {
            if (selectedMeshRef.current) {
                selectedMeshRef.current.material.color.set(event.target.value);
            }
        };

        window.addEventListener('click', onClick);
        colorPicker.addEventListener('input', onColorChange);

        return () => {
            window.removeEventListener('click', onClick);
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
            <input type="color" id="color-picker" style={{ display: 'none', position: 'absolute' }} />
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
                                : [0, 1.9, 0]
                    );
                    setCar(selectedCar);
                }}
            >
                <option value="sedan.glb">Sedan car</option>
                <option value="sportCar.glb">Sports car</option>
                <option value="4x4.glb">Quad car</option>
            </select>
            <div id="container" ref={containerRef}></div>
        </div>
    );
};

export default CarViewer;
