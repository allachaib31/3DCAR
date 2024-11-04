import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import Stats from 'three/addons/libs/stats.module.js';
//import "../styles/CarViewer.css"

const CarViewer = () => {
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
        const lookAtPoint = new THREE.Vector3(0, 1.2, 0.7);
        function init() {
            const container = document.getElementById('container');

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setAnimationLoop(animate);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 0.85;
            container.appendChild(renderer.domElement);

            window.addEventListener('resize', onWindowResize);

            stats = new Stats();
            container.appendChild(stats.dom);

            camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.copy(externalPosition);

            controls = new OrbitControls(camera, container);
            controls.maxDistance = 9;
            controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
            controls.target.set(0, 0.5, 0);
            controls.update();

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x333333);
            scene.environment = new RGBELoader().load('/textures/equirectangular/venice_sunset_1k.hdr');
            scene.environment.mapping = THREE.EquirectangularReflectionMapping;
            scene.fog = new THREE.Fog(0x333333, 10, 15);

            const grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
            grid.material.opacity = 0.2;
            grid.material.depthWrite = false;
            grid.material.transparent = true;
            scene.add(grid);

            const backplateMaterial = new THREE.MeshPhysicalMaterial({ color: 0xff0000, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03 });
            const bodyMaterial = new THREE.MeshPhysicalMaterial({ color: 0xff0000, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03 });
            const detailsMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.5 });
            const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x696969, metalness: 1.0, roughness: 0.5 });
            const glassMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0 });
            const windowMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0 });
            const secondeWindowsMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0 });
            const sideWindowsMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0 });
            const interiorMiddleMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.5 });
            const internalMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.5 });
            const Internal001Material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.5 });
            const leashMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.5 });
            const seatsMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.5 });
            const seats001Material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.5 });
            const frontLightMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0 });
            const rearLightsMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0 });

            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/jsm/libs/draco/gltf/');

            const loader = new GLTFLoader();
            loader.setDRACOLoader(dracoLoader);

            loader.load('/models/gltf/untitled.glb', (gltf) => {
                const carModel = gltf.scene;
                carModel.traverse((child) => {
                    if (child.isMesh) {
                        if (child.name.includes('Body')) {
                            child.material = bodyMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('backplate')) {
                            child.material = backplateMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('Glass')) {
                            child.material = glassMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('windows_')) {
                            child.material = windowMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('Seconde_Windows')) {
                            child.material = secondeWindowsMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('Side_Windows')) {
                            child.material = sideWindowsMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('Interior_Middle')) {
                            child.material = interiorMiddleMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('Internal')) {
                            child.material = internalMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('Internal_001')) {
                            child.material = Internal001Material;
                            child.userData.clickable = true;
                        } else if (child.name.includes('leash')) {
                            child.material = leashMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('seats')) {
                            child.material = seatsMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('seats_001')) {
                            child.material = seats001Material;
                            child.userData.clickable = true;
                        } else if (child.name.includes('Wheel') || child.name.includes('Wheel_002') || child.name.includes('Wheel_003') || child.name.includes('Wheel_001')) {
                            child.material = wheelMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('front_lights')) {
                            child.material = frontLightMaterial;
                            child.userData.clickable = true;
                        } else if (child.name.includes('rear_lights_001')) {
                            child.material = rearLightsMaterial;
                            child.userData.clickable = true;
                        } else {
                            child.material = detailsMaterial;
                            child.userData.clickable = true;
                        }
                    }
                });
                scene.add(carModel);
            });

            window.addEventListener('click', onClick);
            colorPicker.addEventListener('input', onColorChange);
            driverViewBtn.addEventListener('click', toggleDriverView);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function toggleDriverView() {
            if (isDriverView) {
                animateCamera(externalPosition, new THREE.Vector3(0, 0.5, 0), 'Driver\'s View');
                controls.maxDistance = 9;
                controls.enablePan = true;
                controls.enableZoom = true;
                controls.minDistance = 0;
                isDriverView = false;
            } else {
                animateCamera(driverPosition, lookAtPoint, 'Exit Driver\'s View');
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

        init();
    }, [])
    return (
        <div id='body'>
            <input type="color" id="color-picker" />
            <button id="driver-view-btn">Driver's View</button>
            <div id="container"></div>
        </div>
    );
};

export default CarViewer;
