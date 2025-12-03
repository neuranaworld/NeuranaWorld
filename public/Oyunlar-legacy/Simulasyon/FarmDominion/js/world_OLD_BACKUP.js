// 🌍 Farm Dominion v2.1 - Enhanced World System with Massive Terrain
import * as THREE from './three.module.js';
import { PointerLockControls } from './PointerLockControls.js';
import { SETTINGS, toggleShadows, toggleSound } from './settings.js';
import { audioManager } from './audio.js';
import { BuildingManager, BuildingTypes } from './buildings.js';
import { MassiveTerrain } from './massive_terrain.js';
import { WeatherSystem } from './weather.js';
import { QuestSystem } from './quests.js';
import { MiniMap } from './minimap.js';
import { PerformanceMonitor } from './performance.js';
import { GameMenu } from './gamemenu.js';
import { perlin, getTimeString, formatPosition, timeToHours } from './utils.js';

let scene, camera, renderer, controls, clock;
let keys = {};
let sunLight, ambient, skyColor;
let uiFPS, uiPos, uiTime, uiInfo, uiControls;
let frameCount = 0, fpsTimer = 0;
let animals = [];
let waterMesh;
let buildingManager;
let terrainManager;
let weatherSystem;
let questSystem;
let miniMap;
let perfMonitor;
let gameMenu;
let dayTime = 0;
let weather = 'clear';
let rainParticles = null;
let playerStats = {
    distanceTraveled: 0,
    buildingsVisited: new Set(),
    animalsInteracted: new Set()
};

// Export for menu access
window.renderer = null;
window.sunLight = null;
window.camera = null;
window.audioManager = audioManager;
window.perfMonitor = null;

// NPCs
class NPC {
    constructor(scene, position) {
        this.scene = scene;
        this.mesh = this.createMesh();
        this.mesh.position.copy(position);
        this.direction = new THREE.Vector3(
            Math.random() - 0.5,
            0,
            Math.random() - 0.5
        ).normalize();
        this.speed = 15;
        this.turnTimer = 0;
        this.turnInterval = 3 + Math.random() * 4;
        scene.add(this.mesh);
    }

    createMesh() {
        const group = new THREE.Group();
        
        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(5, 3, 8),
            new THREE.MeshLambertMaterial({ color: 0xffffff })
        );
        body.castShadow = true;
        group.add(body);

        // Head
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 3),
            new THREE.MeshLambertMaterial({ color: 0xffffff })
        );
        head.position.set(0, 2, -3);
        head.castShadow = true;
        group.add(head);

        // Legs
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.5, 0.5, 3),
                new THREE.MeshLambertMaterial({ color: 0xcccccc })
            );
            leg.position.set(
                i < 2 ? 1.5 : -1.5,
                -2.5,
                i % 2 === 0 ? 2 : -2
            );
            leg.castShadow = true;
            group.add(leg);
        }

        return group;
    }

    update(delta, terrainHeight) {
        // Random direction changes
        this.turnTimer += delta;
        if (this.turnTimer >= this.turnInterval) {
            this.turnTimer = 0;
            this.direction.applyAxisAngle(
                new THREE.Vector3(0, 1, 0),
                (Math.random() - 0.5) * Math.PI
            );
        }

        // Move
        const movement = this.direction.clone().multiplyScalar(this.speed * delta);
        this.mesh.position.add(movement);

        // Keep on terrain
        if (typeof terrainHeight === 'function') {
            const height = terrainHeight(this.mesh.position.x, this.mesh.position.z);
            this.mesh.position.y = height + 3;
        }

        // Boundary check
        const boundary = 1900;
        if (Math.abs(this.mesh.position.x) > boundary || Math.abs(this.mesh.position.z) > boundary) {
            this.direction.multiplyScalar(-1);
        }

        // Face direction
        const angle = Math.atan2(this.direction.x, this.direction.z);
        this.mesh.rotation.y = angle;
    }

    dispose() {
        this.scene.remove(this.mesh);
    }
}

export async function initWorld(container, onProgress) {
    console.log('🌍 Farm Dominion v2.1 - Massive World başlatılıyor...');
    
    clock = new THREE.Clock();
    
    // Scene setup
    scene = new THREE.Scene();
    skyColor = new THREE.Color(0x99ccff);
    scene.background = skyColor;
    scene.fog = new THREE.Fog(skyColor, SETTINGS.graphics.fogNear, SETTINGS.graphics.fogFar * 2); // Bigger fog for massive world

    // Camera
    camera = new THREE.PerspectiveCamera(
        SETTINGS.player.fov,
        window.innerWidth / window.innerHeight,
        0.1,
        SETTINGS.graphics.renderDistance * 2 // Bigger render distance
    );

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: SETTINGS.graphics.antialias });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = SETTINGS.graphics.shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Export for menu
    window.renderer = renderer;
    window.camera = camera;

    // Lighting
    setupLighting();

    // Massive Terrain with progress callback
    terrainManager = new MassiveTerrain(scene, camera);
    await terrainManager.initialize(onProgress);

    // Water (much bigger for massive world)
    createWater();

    // Buildings
    buildingManager = new BuildingManager(scene);
    createVillage();

    // Vegetation (spread across massive terrain)
    createVegetation();

    // Animals/NPCs
    spawnNPCs();

    // Controls
    controls = new PointerLockControls(camera, document.body);
    document.body.addEventListener('click', () => {
        if (!controls.isLocked) {
            controls.lock();
        }
    });
    scene.add(controls.getObject());
    camera.position.set(0, 50, 0);

    // Audio
    audioManager.init(camera);
    setTimeout(() => {
        audioManager.startAmbient();
    }, 1000);

    // Weather System
    weatherSystem = new WeatherSystem(scene, camera);
    weatherSystem.init();
    weatherSystem.setWeather('clear');

    // Quest System
    questSystem = new QuestSystem();

    // Performance Monitor
    perfMonitor = new PerformanceMonitor();
    window.perfMonitor = perfMonitor;

    // Game Menu
    gameMenu = new GameMenu();

    // UI
    createUI();
    setupControls();

    // Mini Map (after buildings and NPCs are created)
    setTimeout(() => {
        miniMap = new MiniMap(camera, buildingManager.getBuildings(), animals);
    }, 100);

    // Event listeners
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);

    // Start animation
    animate();

    console.log('✅ Massive world initialized!');
    console.log('📊 Terrain size:', terrainManager.getWorldSize() + 'x' + terrainManager.getWorldSize());
}

function setupLighting() {
    // Sun
    sunLight = new THREE.DirectionalLight(0xffffff, 1.3);
    sunLight.position.set(500, 1000, 300);
    sunLight.castShadow = SETTINGS.graphics.shadows;
    if (sunLight.castShadow) {
        sunLight.shadow.mapSize.width = SETTINGS.graphics.shadowMapSize;
        sunLight.shadow.mapSize.height = SETTINGS.graphics.shadowMapSize;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 5000;
        sunLight.shadow.camera.left = -1000;
        sunLight.shadow.camera.right = 1000;
        sunLight.shadow.camera.top = 1000;
        sunLight.shadow.camera.bottom = -1000;
    }
    scene.add(sunLight);

    // Export for menu
    window.sunLight = sunLight;

    // Ambient
    ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    // Hemisphere light for better sky-ground lighting
    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.4);
    scene.add(hemiLight);
}

function createWater() {
    const waterGeo = new THREE.PlaneGeometry(20000, 20000, 1, 1); // Much bigger water
    const waterMat = new THREE.MeshPhongMaterial({
        color: 0x3f66ff,
        transparent: true,
        opacity: 0.7,
        shininess: 100
    });
    waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = SETTINGS.world.waterLevel;
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);
}

function createVegetation() {
    // Trees
    const treeGeo = new THREE.ConeGeometry(4, 15, 6);
    const treeMat = new THREE.MeshLambertMaterial({ color: 0x227722 });
    
    for (let i = 0; i < SETTINGS.world.treeCount; i++) {
        const tree = new THREE.Mesh(treeGeo, treeMat.clone());
        const tx = (Math.random() - 0.5) * (SETTINGS.world.size - 1000);
        const tz = (Math.random() - 0.5) * (SETTINGS.world.size - 1000);
        const ty = terrainManager.getHeightAt(tx, tz) + 7.5;
        
        if (ty > SETTINGS.world.waterLevel + 10) {
            tree.position.set(tx, ty, tz);
            tree.scale.setScalar(Math.random() * 0.8 + 0.7);
            tree.castShadow = SETTINGS.graphics.shadows;
            tree.receiveShadow = true;
            tree.material.color.offsetHSL(Math.random() * 0.05, 0, Math.random() * 0.1);
            scene.add(tree);
        }
    }

    // Rocks
    const rockGeo = new THREE.DodecahedronGeometry(5, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.9 });
    
    for (let i = 0; i < SETTINGS.world.rockCount; i++) {
        const rock = new THREE.Mesh(rockGeo, rockMat.clone());
        const rx = (Math.random() - 0.5) * (SETTINGS.world.size - 1000);
        const rz = (Math.random() - 0.5) * (SETTINGS.world.size - 1000);
        const ry = terrainManager.getHeightAt(rx, rz) + 2.5;
        
        rock.scale.setScalar(Math.random() * 2 + 0.5);
        rock.position.set(rx, ry, rz);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = SETTINGS.graphics.shadows;
        rock.receiveShadow = true;
        scene.add(rock);
    }

    console.log('🌲 Vegetation created');
}

function createVillage() {
    const buildingPositions = [
        { type: BuildingTypes.HOUSE, x: 0, z: -200 },
        { type: BuildingTypes.BARN, x: 100, z: -180 },
        { type: BuildingTypes.WINDMILL, x: -150, z: -200 },
        { type: BuildingTypes.WELL, x: 50, z: -150 },
        { type: BuildingTypes.SILO, x: 180, z: -160 },
        { type: BuildingTypes.GREENHOUSE, x: -100, z: -100 },
        { type: BuildingTypes.SHED, x: 150, z: -100 },
        { type: BuildingTypes.HOUSE, x: 200, z: -220 },
        { type: BuildingTypes.HOUSE, x: -200, z: -180 },
    ];

    buildingPositions.forEach(pos => {
        const y = terrainManager.getHeightAt(pos.x, pos.z) + 7.5;
        
        switch(pos.type) {
            case BuildingTypes.HOUSE:
                buildingManager.createHouse(pos.x, y, pos.z);
                break;
            case BuildingTypes.BARN:
                buildingManager.createBarn(pos.x, y, pos.z);
                break;
            case BuildingTypes.WINDMILL:
                buildingManager.createWindmill(pos.x, y, pos.z);
                break;
            case BuildingTypes.WELL:
                buildingManager.createWell(pos.x, y, pos.z);
                break;
            case BuildingTypes.SILO:
                buildingManager.createSilo(pos.x, y, pos.z);
                break;
            case BuildingTypes.GREENHOUSE:
                buildingManager.createGreenhouse(pos.x, y, pos.z);
                break;
            case BuildingTypes.SHED:
                buildingManager.createShed(pos.x, y, pos.z);
                break;
        }
    });

    // Add fences
    for (let i = 0; i < 5; i++) {
        const fx = (Math.random() - 0.5) * 400;
        const fz = -100 + (Math.random() - 0.5) * 200;
        const fy = terrainManager.getHeightAt(fx, fz);
        buildingManager.createFence(fx, fy, fz, 20);
    }

    console.log('🏘️ Village created');
}

function spawnNPCs() {
    for (let i = 0; i < SETTINGS.world.animalCount; i++) {
        const x = (Math.random() - 0.5) * 1000;
        const z = (Math.random() - 0.5) * 1000;
        const y = terrainManager.getHeightAt(x, z) + 3;
        
        const npc = new NPC(scene, new THREE.Vector3(x, y, z));
        animals.push(npc);
    }
    console.log('🐄 NPCs spawned');
}

function createUI() {
    uiFPS = createUIElement('10px', '10px');
    uiPos = createUIElement('30px', '10px');
    uiTime = createUIElement('50px', '10px');
    uiInfo = createUIElement(null, '10px', '10px');
    uiControls = createUIElement('70px', '10px');
    
    uiInfo.textContent = '🌿 Farm Dominion v2';
    uiControls.textContent = 'WASD: Hareket | Fare: Bak | G: Gölge | M: Ses | Esc: Menü';
}

function createUIElement(top, left, bottom) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.color = '#fff';
    el.style.fontFamily = 'monospace, sans-serif';
    el.style.fontSize = '14px';
    el.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    el.style.zIndex = '1000';
    el.style.padding = '4px 8px';
    el.style.backgroundColor = 'rgba(0,0,0,0.3)';
    el.style.borderRadius = '4px';
    
    if (top) el.style.top = top;
    if (left) el.style.left = left;
    if (bottom) el.style.bottom = bottom;
    
    document.body.appendChild(el);
    return el;
}

function setupControls() {
    // Shadow toggle button (if exists)
    const shadowBtn = document.getElementById('toggleShadows');
    if (shadowBtn) {
        shadowBtn.addEventListener('click', () => {
            const enabled = toggleShadows();
            shadowBtn.textContent = `Gölge: ${enabled ? 'Açık' : 'Kapalı'}`;
            renderer.shadowMap.enabled = enabled;
            sunLight.castShadow = enabled;
        });
    }

    // Sound toggle button (if exists)
    const soundBtn = document.getElementById('toggleSound');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            const enabled = audioManager.toggleMute();
            soundBtn.textContent = `Ses: ${enabled ? 'Açık' : 'Kapalı'}`;
        });
    }
}

function onKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
    
    // ESC - Toggle menu
    if (e.key === 'Escape') {
        if (gameMenu) {
            gameMenu.toggle();
        }
        return;
    }

    // Don't process other keys if menu is open
    if (gameMenu && gameMenu.isMenuOpen()) {
        return;
    }
    
    // Toggle shadows with G
    if (e.key.toLowerCase() === 'g') {
        const enabled = toggleShadows();
        console.log(`Gölgeler: ${enabled ? 'Açık' : 'Kapalı'}`);
        renderer.shadowMap.enabled = enabled;
        sunLight.castShadow = enabled;
    }
    
    // Toggle sound with M
    if (e.key.toLowerCase() === 'm') {
        const enabled = audioManager.toggleMute();
        console.log(`Ses: ${enabled ? 'Açık' : 'Kapalı'}`);
    }

    // Toggle mini-map with Tab
    if (e.key === 'Tab') {
        e.preventDefault();
        if (miniMap) miniMap.toggle();
    }

    // Toggle performance monitor with P
    if (e.key.toLowerCase() === 'p') {
        if (perfMonitor) {
            const enabled = perfMonitor.toggle();
            console.log(`Performans: ${enabled ? 'Açık' : 'Kapalı'}`);
        }
    }

    // Change weather with 1-5 keys
    if (e.key >= '1' && e.key <= '5') {
        const weathers = ['clear', 'rain', 'snow', 'storm', 'fog'];
        const index = parseInt(e.key) - 1;
        if (weatherSystem) {
            weatherSystem.setWeather(weathers[index]);
            questSystem.observeWeather(weathers[index]);
        }
    }

    // Jump with Space
    if (e.key === ' ' && controls.isLocked) {
        e.preventDefault();
        // Simple jump effect (could be enhanced with physics)
        const pos = controls.getObject().position;
        pos.y += 5;
        setTimeout(() => {
            const terrainHeight = terrainManager.getHeightAt(pos.x, pos.z);
            pos.y = Math.max(pos.y - 5, terrainHeight + SETTINGS.player.cameraHeight);
        }, 300);
    }
}

function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateDayCycle(delta) {
    if (!SETTINGS.time.dayNightCycle) return;

    dayTime += delta * (1 / SETTINGS.time.dayLength);
    if (dayTime > 1) dayTime -= 1;

    // Calculate sun intensity
    const sunAngle = dayTime * Math.PI * 2;
    const intensity = Math.max(0.2, Math.sin(sunAngle) * 0.8 + 0.3);
    
    // Update sky color
    const hue = 0.55 + Math.sin(sunAngle) * 0.05;
    const lightness = 0.4 + 0.3 * intensity;
    skyColor.setHSL(hue, 0.5, lightness);
    scene.background = skyColor;
    scene.fog.color = skyColor;
    
    // Update lighting
    sunLight.intensity = 1.5 * intensity;
    ambient.intensity = 0.5 * intensity + 0.4;
    
    // Update sun position
    sunLight.position.set(
        Math.sin(sunAngle) * 800,
        Math.cos(sunAngle) * 1000,
        300
    );
    
    // Update UI
    const hours = timeToHours(dayTime);
    if (uiTime) {
        uiTime.textContent = `🕐 ${getTimeString(dayTime)}`;
    }

    // Update audio based on time
    audioManager.updateTimeOfDay(dayTime);

    // Update quests based on time
    if (questSystem) {
        questSystem.updateTime(hours);
    }
}

function updateNPCs(delta) {
    animals.forEach(npc => {
        npc.update(delta, (x, z) => terrainManager.getHeightAt(x, z));
    });
}

function updatePlayer(delta) {
    // Don't update if menu is open
    if (gameMenu && gameMenu.isMenuOpen()) return;
    if (!controls.isLocked) return;

    const speed = keys['shift'] ? SETTINGS.player.sprintSpeed : SETTINGS.player.moveSpeed;
    const moveSpeed = speed * delta;

    const direction = new THREE.Vector3();
    const move = new THREE.Vector3();
    const oldPos = controls.getObject().position.clone();

    if (keys['w']) direction.z += 1;
    if (keys['s']) direction.z -= 1;
    if (keys['a']) direction.x -= 1;
    if (keys['d']) direction.x += 1;

    if (direction.length() > 0) {
        direction.normalize();
        move.copy(direction).multiplyScalar(moveSpeed);
        controls.moveRight(move.x);
        controls.moveForward(move.z);

        // Keep player above terrain
        const pos = controls.getObject().position;
        const terrainHeight = terrainManager.getHeightAt(pos.x, pos.z);
        if (pos.y < terrainHeight + SETTINGS.player.cameraHeight) {
            pos.y = terrainHeight + SETTINGS.player.cameraHeight;
        }

        // Track distance
        const distance = oldPos.distanceTo(pos);
        playerStats.distanceTraveled += distance;
        if (questSystem) {
            questSystem.updateDistance(distance);
        }
    }

    // Check for nearby animals (interaction)
    const playerPos = controls.getObject().position;
    animals.forEach((npc, index) => {
        if (!npc.mesh) return;
        const distance = playerPos.distanceTo(npc.mesh.position);
        if (distance < 10 && !playerStats.animalsInteracted.has(index)) {
            playerStats.animalsInteracted.add(index);
            if (questSystem) {
                questSystem.interactWithAnimal();
            }
        }
    });

    // Check for nearby buildings
    if (buildingManager) {
        buildingManager.getBuildings().forEach((building, index) => {
            if (!building.mesh) return;
            const distance = playerPos.distanceTo(building.mesh.position);
            if (distance < 30 && !playerStats.buildingsVisited.has(index)) {
                playerStats.buildingsVisited.add(index);
                if (questSystem) {
                    questSystem.visitBuilding(building.type);
                }
            }
        });
    }
}

function updateUI(delta) {
    frameCount++;
    fpsTimer += delta;
    
    if (fpsTimer >= 1) {
        if (uiFPS) uiFPS.textContent = `🎯 FPS: ${frameCount}`;
        frameCount = 0;
        fpsTimer = 0;
    }

    const pos = controls.getObject().position;
    if (uiPos) {
        uiPos.textContent = `📍 ${formatPosition(pos.x, pos.y, pos.z)}`;
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();

    updatePlayer(delta);
    updateNPCs(delta);
    updateDayCycle(delta);
    buildingManager.update(delta);
    updateUI(delta);

    // Update weather system
    if (weatherSystem) {
        weatherSystem.update(delta);
    }

    // Update massive terrain chunks (LOD and streaming)
    if (terrainManager && controls.getObject()) {
        terrainManager.update(controls.getObject().position);
    }

    // Update mini-map
    if (miniMap && controls.getObject()) {
        const pos = controls.getObject().position;
        const rot = controls.getObject().rotation.y;
        miniMap.update(pos, rot);
    }

    // Update performance monitor
    if (perfMonitor) {
        perfMonitor.update(renderer);
    }

    renderer.render(scene, camera);
}

console.log('🌍 Massive world system loaded');
