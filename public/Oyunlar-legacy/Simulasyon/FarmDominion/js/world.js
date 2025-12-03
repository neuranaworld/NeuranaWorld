// 🌍 Farm Dominion v2.1 - Enhanced World System with Massive Terrain + CROP SYSTEMS
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

// ========== YENİ IMPORTS (PLANT SYSTEMS) ==========
import { configLoader } from './ultra_config_loader.js';
import { FloraPlacementEngine } from './flora_placement_engine.js';
import { NPCSpawner } from './npc_spawner.js';
import { createTree, createRandomTreeForBiome, getPlantFactory, updateWindAnimation, applyWindToLeafCluster } from './plant_models_bridge.js';

// ========== YENİ IMPORTS (CROP SYSTEMS) ==========
import { CropPlacementEngine } from './crop_placement_engine.js';
import { EnhancedCropModelFactory } from './enhanced_crop_models.js';
import { CompleteBiomeDatabase, getCropsForBiome, canCropGrow } from './complete_biome_requirements.js';
import { CompleteTreeDatabase } from './complete_plant_database_99_trees.js';
import { CompleteFruitDatabase, CompleteVegetableDatabase } from './complete_fruits_vegetables_100.js';

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

// YENİ: Plant & Crop systems
let npcSpawner;
let floraEngine;
let plantFactory;
let cropPlacementEngine;
let enhancedCropFactory;
let activeCropFields = new Map();

// Wind settings
const WIND_SETTINGS = {
    enabled: true,
    strength: 0.5,
    speed: 1.0
};

// Export for menu access
window.renderer = null;
window.sunLight = null;
window.camera = null;
window.audioManager = audioManager;
window.perfMonitor = null;

// YENİ: Export plant systems
window.plantFactory = null;
window.floraEngine = null;
window.cropPlacementEngine = null;
window.enhancedCropFactory = null;

// NPCs (eski versiyon - yeni NPC spawner ile değiştirilecek)
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
        
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(5, 3, 8),
            new THREE.MeshLambertMaterial({ color: 0xffffff })
        );
        body.castShadow = true;
        group.add(body);

        const head = new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 3),
            new THREE.MeshLambertMaterial({ color: 0xffffff })
        );
        head.position.set(0, 2, -3);
        head.castShadow = true;
        group.add(head);

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
        this.turnTimer += delta;
        if (this.turnTimer >= this.turnInterval) {
            this.turnTimer = 0;
            this.direction.applyAxisAngle(
                new THREE.Vector3(0, 1, 0),
                (Math.random() - 0.5) * Math.PI
            );
        }

        const movement = this.direction.clone().multiplyScalar(this.speed * delta);
        this.mesh.position.add(movement);

        if (typeof terrainHeight === 'function') {
            const height = terrainHeight(this.mesh.position.x, this.mesh.position.z);
            this.mesh.position.y = height + 3;
        }

        const boundary = 1900;
        if (Math.abs(this.mesh.position.x) > boundary || Math.abs(this.mesh.position.z) > boundary) {
            this.direction.multiplyScalar(-1);
        }

        const angle = Math.atan2(this.direction.x, this.direction.z);
        this.mesh.rotation.y = angle;
    }

    dispose() {
        this.scene.remove(this.mesh);
    }
}

export async function initWorld(container, onProgress) {
    console.log('🌍 Farm Dominion v2.1 - ULTRA World başlatılıyor...');
    
    clock = new THREE.Clock();
    
    // Scene setup
    scene = new THREE.Scene();
    skyColor = new THREE.Color(0x99ccff);
    scene.background = skyColor;
    scene.fog = new THREE.Fog(skyColor, SETTINGS.graphics.fogNear, SETTINGS.graphics.fogFar * 2);

    // Camera
    camera = new THREE.PerspectiveCamera(
        SETTINGS.player.fov,
        window.innerWidth / window.innerHeight,
        0.1,
        SETTINGS.graphics.renderDistance * 2
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

    // ========================================
    // YENİ: CONFIG LOADING (10-20%)
    // ========================================
    console.log('📁 === CONFIG LOADING ===');
    if (onProgress) onProgress(0.10, 'Loading configs...');
    
    try {
        await configLoader.loadAll((progress, file) => {
            console.log(`   📄 ${file}: ${Math.round(progress * 100)}%`);
            if (onProgress) {
                onProgress(0.10 + progress * 0.10, `Config: ${file}`);
            }
        });
        
        console.log('✅ Config loaded');
    } catch (error) {
        console.error('❌ Config loading failed:', error);
    }

    // ========================================
    // YENİ: PLANT FACTORY (20-25%)
    // ========================================
    console.log('🌳 === PLANT FACTORY INIT ===');
    if (onProgress) onProgress(0.20, 'Initializing plant models...');
    
    plantFactory = getPlantFactory();
    window.plantFactory = plantFactory;
    console.log('✅ Plant factory ready');

    // ========================================
    // MASSIVE TERRAIN (25-70%)
    // ========================================
    console.log('🗺️ === TERRAIN GENERATION ===');
    if (onProgress) onProgress(0.25, 'Generating massive terrain...');
    
    terrainManager = new MassiveTerrain(scene, camera);
    await terrainManager.initialize((progress) => {
        if (onProgress) {
            onProgress(0.25 + progress * 0.45, `Terrain: Chunk ${Math.floor(progress * 81)}/81`);
        }
    });
    
    console.log('✅ Terrain generated');

    // Water
    createWater();

    // ========================================
    // YENİ: FLORA PLACEMENT (70-75%)
    // ========================================
    console.log('🌲 === FLORA PLACEMENT ===');
    if (onProgress) onProgress(0.70, 'Placing trees...');
    
    floraEngine = new FloraPlacementEngine(scene, terrainManager);
    window.floraEngine = floraEngine;
    
    // Place initial flora (3x3 chunks around spawn)
    const spawnChunkX = Math.floor(terrainManager.chunksPerSide / 2);
    const spawnChunkZ = Math.floor(terrainManager.chunksPerSide / 2);
    
    // Minimal flora placement for performance
    console.log('🌳 Placing initial flora (minimal for performance)...');
    
    console.log('✅ Flora placement ready (will load dynamically)');

    // ========================================
    // YENİ: CROP PLACEMENT ENGINE (75-80%)
    // ========================================
    console.log('🌾 === CROP PLACEMENT ENGINE ===');
    if (onProgress) onProgress(0.75, 'Initializing crop system...');

    enhancedCropFactory = new EnhancedCropModelFactory();
    window.enhancedCropFactory = enhancedCropFactory;

    cropPlacementEngine = new CropPlacementEngine(scene, terrainManager);
    window.cropPlacementEngine = cropPlacementEngine;

    console.log('✅ Crop system initialized');
    console.log(`   🌳 Trees: ${Object.keys(CompleteTreeDatabase).length}`);
    console.log(`   🍎 Fruits: ${Object.keys(CompleteFruitDatabase).length}`);
    console.log(`   🥬 Vegetables: ${Object.keys(CompleteVegetableDatabase).length}`);

    // ========================================
    // BUILDINGS (80-85%)
    // ========================================
    console.log('🏠 === BUILDINGS ===');
    if (onProgress) onProgress(0.80, 'Placing buildings...');
    
    buildingManager = new BuildingManager(scene);
    createVillage();
    
    console.log('✅ Buildings placed');

    // ========================================
    // Vegetation (old system - commented out, flora engine handles it)
    // ========================================
    // createVegetation(); // DISABLED - flora engine handles this

    // ========================================
    // NPCs (85-90%)
    // ========================================
    console.log('🐄 === NPCs ===');
    if (onProgress) onProgress(0.85, 'Spawning NPCs...');
    
    spawnNPCs();
    
    console.log('✅ NPCs spawned');

    // ========================================
    // CONTROLS & UI (90-95%)
    // ========================================
    if (onProgress) onProgress(0.90, 'Setting up controls...');

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

    // Mini Map
    setTimeout(() => {
        miniMap = new MiniMap(camera, buildingManager.getBuildings(), animals);
    }, 100);

    // Event listeners
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onResize);

    // ========================================
    // ANIMATION LOOP (95-100%)
    // ========================================
    if (onProgress) onProgress(0.95, 'Starting animation...');
    
    animate();

    if (onProgress) onProgress(1.0, 'Complete!');

    console.log('🎉 === WORLD INITIALIZATION COMPLETE ===');
    console.log('📊 Final Stats:');
    console.log(`   🗺️ Terrain: ${terrainManager.getWorldSize()}x${terrainManager.getWorldSize()}`);
    console.log(`   🌳 Tree database: ${Object.keys(CompleteTreeDatabase).length} types`);
    console.log(`   🍎 Fruit database: ${Object.keys(CompleteFruitDatabase).length} types`);
    console.log(`   🥬 Vegetable database: ${Object.keys(CompleteVegetableDatabase).length} types`);
    console.log(`   🏠 Buildings: ${buildingManager.getBuildings().length}`);
    console.log(`   🐄 NPCs: ${animals.length}`);
}

function setupLighting() {
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

    window.sunLight = sunLight;

    ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.4);
    scene.add(hemiLight);
}

function createWater() {
    const waterGeo = new THREE.PlaneGeometry(20000, 20000, 1, 1);
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

// OLD createVegetation - DISABLED (flora engine handles it)
function createVegetation() {
    console.log('⚠️ Old vegetation system disabled - using flora engine');
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

    for (let i = 0; i < 5; i++) {
        const fx = (Math.random() - 0.5) * 400;
        const fz = -100 + (Math.random() - 0.5) * 200;
        const fy = terrainManager.getHeightAt(fx, fz);
        buildingManager.createFence(fx, fy, fz, 20);
    }
}

function spawnNPCs() {
    for (let i = 0; i < SETTINGS.world.animalCount; i++) {
        const x = (Math.random() - 0.5) * 1000;
        const z = (Math.random() - 0.5) * 1000;
        const y = terrainManager.getHeightAt(x, z) + 3;
        
        const npc = new NPC(scene, new THREE.Vector3(x, y, z));
        animals.push(npc);
    }
}

function createUI() {
    uiFPS = createUIElement('10px', '10px');
    uiPos = createUIElement('30px', '10px');
    uiTime = createUIElement('50px', '10px');
    uiInfo = createUIElement(null, '10px', '10px');
    uiControls = createUIElement('70px', '10px');
    
    uiInfo.textContent = '🌿 Farm Dominion v2.1 ULTRA';
    uiControls.textContent = 'WASD: Hareket | Fare: Bak | G: Gölge | M: Ses | C: Crop Info | Esc: Menü';
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
    const shadowBtn = document.getElementById('toggleShadows');
    if (shadowBtn) {
        shadowBtn.addEventListener('click', () => {
            const enabled = toggleShadows();
            shadowBtn.textContent = `Gölge: ${enabled ? 'Açık' : 'Kapalı'}`;
            renderer.shadowMap.enabled = enabled;
            sunLight.castShadow = enabled;
        });
    }

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
    
    if (e.key === 'Escape') {
        if (gameMenu) {
            gameMenu.toggle();
        }
        return;
    }

    if (gameMenu && gameMenu.isMenuOpen()) {
        return;
    }
    
    if (e.key.toLowerCase() === 'g') {
        const enabled = toggleShadows();
        console.log(`Gölgeler: ${enabled ? 'Açık' : 'Kapalı'}`);
        renderer.shadowMap.enabled = enabled;
        sunLight.castShadow = enabled;
    }
    
    if (e.key.toLowerCase() === 'm') {
        const enabled = audioManager.toggleMute();
        console.log(`Ses: ${enabled ? 'Açık' : 'Kapalı'}`);
    }

    // YENİ: C tuşu - Crop Info
    if (e.key.toLowerCase() === 'c') {
        if (window.showAvailableCrops && camera) {
            const pos = controls.getObject().position;
            showAvailableCrops(pos.x, pos.z);
        }
    }

    if (e.key === 'Tab') {
        e.preventDefault();
        if (miniMap) miniMap.toggle();
    }

    if (e.key.toLowerCase() === 'p') {
        if (perfMonitor) {
            const enabled = perfMonitor.toggle();
            console.log(`Performans: ${enabled ? 'Açık' : 'Kapalı'}`);
        }
    }

    if (e.key >= '1' && e.key <= '5') {
        const weathers = ['clear', 'rain', 'snow', 'storm', 'fog'];
        const index = parseInt(e.key) - 1;
        if (weatherSystem) {
            weatherSystem.setWeather(weathers[index]);
            questSystem.observeWeather(weathers[index]);
        }
    }

    if (e.key === ' ' && controls.isLocked) {
        e.preventDefault();
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

    const sunAngle = dayTime * Math.PI * 2;
    const intensity = Math.max(0.2, Math.sin(sunAngle) * 0.8 + 0.3);
    
    const hue = 0.55 + Math.sin(sunAngle) * 0.05;
    const lightness = 0.4 + 0.3 * intensity;
    skyColor.setHSL(hue, 0.5, lightness);
    scene.background = skyColor;
    scene.fog.color = skyColor;
    
    sunLight.intensity = 1.5 * intensity;
    ambient.intensity = 0.5 * intensity + 0.4;
    
    sunLight.position.set(
        Math.sin(sunAngle) * 800,
        Math.cos(sunAngle) * 1000,
        300
    );
    
    const hours = timeToHours(dayTime);
    if (uiTime) {
        uiTime.textContent = `🕐 ${getTimeString(dayTime)}`;
    }

    audioManager.updateTimeOfDay(dayTime);

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

        const pos = controls.getObject().position;
        const terrainHeight = terrainManager.getHeightAt(pos.x, pos.z);
        if (pos.y < terrainHeight + SETTINGS.player.cameraHeight) {
            pos.y = terrainHeight + SETTINGS.player.cameraHeight;
        }

        const distance = oldPos.distanceTo(pos);
        playerStats.distanceTraveled += distance;
        if (questSystem) {
            questSystem.updateDistance(distance);
        }
    }

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

    // Weather
    if (weatherSystem) {
        weatherSystem.update(delta);
    }

    // Terrain LOD
    if (terrainManager && controls.getObject()) {
        terrainManager.update(controls.getObject().position);
    }

    // YENİ: CROP UPDATES
    if (cropPlacementEngine) {
        cropPlacementEngine.update(delta);
    }

    // YENİ: FLORA & WIND ANIMATION
    if (floraEngine && camera && WIND_SETTINGS.enabled) {
        floraEngine.updateFloraForCamera(controls.getObject().position, 500);
        updateWindAnimation(delta * WIND_SETTINGS.speed, WIND_SETTINGS.strength);
        
        scene.traverse((object) => {
            if (object.userData.windPhase !== undefined) {
                applyWindToLeafCluster(object, WIND_SETTINGS.strength);
            }
        });
    }

    // Mini-map
    if (miniMap && controls.getObject()) {
        const pos = controls.getObject().position;
        const rot = controls.getObject().rotation.y;
        miniMap.update(pos, rot);
    }

    // Performance
    if (perfMonitor) {
        perfMonitor.update(renderer);
    }

    renderer.render(scene, camera);
}

// ========================================
// YENİ: DEBUG FUNCTIONS
// ========================================

export function showAvailableCrops(x, z) {
    if (!cropPlacementEngine || !terrainManager) {
        console.warn('❌ Crop system not initialized');
        return;
    }

    const environment = cropPlacementEngine.getEnvironmentData(x, z);
    const crops = getCropsForBiome(environment.biome);
    
    console.log('🌾 === AVAILABLE CROPS ===');
    console.log(`📍 Location: (${x.toFixed(0)}, ${z.toFixed(0)})`);
    console.log(`🗺️ Biome: ${environment.biome}`);
    console.log(`🌡️ Temperature: ${environment.temperature}°C`);
    console.log(`💧 Moisture: ${environment.moisture}%`);
    console.log(`🏔️ Altitude: ${environment.altitude}m`);
    console.log(`🍎 Fruits: ${crops.fruits.length}`);
    crops.fruits.slice(0, 10).forEach(f => console.log(`   - ${f.id}`));
    if (crops.fruits.length > 10) console.log(`   ... and ${crops.fruits.length - 10} more`);
    console.log(`🥬 Vegetables: ${crops.vegetables.length}`);
    crops.vegetables.slice(0, 10).forEach(v => console.log(`   - ${v.id}`));
    if (crops.vegetables.length > 10) console.log(`   ... and ${crops.vegetables.length - 10} more`);
    
    return crops;
}

export function createCropFieldAt(cropId, x, z, width = 20, length = 30) {
    if (!cropPlacementEngine) {
        console.error('❌ Crop placement engine not initialized');
        return null;
    }

    console.log(`🌾 Creating field: ${cropId} at (${x}, ${z})`);
    
    const environment = cropPlacementEngine.getEnvironmentData(x, z);
    if (!canCropGrow(cropId, environment)) {
        console.error(`❌ ${cropId} cannot grow in this environment`);
        console.log('Environment:', environment);
        return null;
    }
    
    const field = cropPlacementEngine.createCropField(cropId, x, z, width, length);
    
    if (field) {
        activeCropFields.set(field.id, field);
        console.log(`✅ Field created: ${field.plantCount} plants`);
        return field;
    }
    
    return null;
}

export function getCropStats() {
    if (!cropPlacementEngine) {
        console.warn('❌ Crop system not initialized');
        return null;
    }

    const stats = cropPlacementEngine.getStats();
    console.log('🌾 === CROP STATS ===');
    console.log(`   Total Fields: ${stats.totalFields}`);
    console.log(`   Total Crops: ${stats.totalCrops}`);
    console.log(`   Harvest Ready: ${stats.harvestReadyFields}`);
    console.log('   Fields by Type:');
    Object.entries(stats.fieldsByType).forEach(([type, count]) => {
        console.log(`      ${type}: ${count}`);
    });
    
    return stats;
}

export function testCropModel(cropId, x, y, z) {
    if (!enhancedCropFactory || !plantFactory) {
        console.error('❌ Plant factories not initialized');
        return null;
    }

    console.log(`🌾 Testing crop model: ${cropId}`);
    
    const cropData = CompleteBiomeDatabase[cropId];
    if (!cropData) {
        console.error(`❌ Unknown crop: ${cropId}`);
        return null;
    }
    
    let plant;
    
    try {
        // Try enhanced models first
        switch(cropId) {
            case 'strawberry':
                plant = enhancedCropFactory.createStrawberryPlant(1.0);
                break;
            case 'grape':
                plant = enhancedCropFactory.createGrapeVine(1.0);
                break;
            case 'watermelon':
                plant = enhancedCropFactory.createWatermelonPlant(1.0);
                break;
            case 'carrot':
                plant = enhancedCropFactory.createEnhancedCarrotPlant(1.0);
                break;
            case 'potato':
                plant = enhancedCropFactory.createEnhancedPotatoPlant(1.0);
                break;
            default:
                // Try generic
                if (cropData.tree || (cropData.spacing && cropData.spacing > 3)) {
                    plant = plantFactory.createRealisticTree(cropData);
                }
        }
    } catch (error) {
        console.warn(`⚠️ Enhanced model failed, using fallback:`, error.message);
    }
    
    if (plant) {
        plant.position.set(x, y, z);
        scene.add(plant);
        console.log(`✅ Test plant created at (${x}, ${y}, ${z})`);
        return plant;
    }
    
    console.error(`❌ Could not create plant for ${cropId}`);
    return null;
}

export function createGrowthDemo(cropId, x, z) {
    console.log(`🌾 Creating growth stage demo: ${cropId}`);
    
    const stages = [0.2, 0.4, 0.6, 0.8, 1.0];
    const spacing = 5;
    
    stages.forEach((stage, i) => {
        const offsetX = x + i * spacing;
        const y = terrainManager.getHeightAt(offsetX, z);
        
        testCropModel(cropId, offsetX, y, z);
    });
    
    console.log(`✅ Growth demo created (stages: ${stages.join(', ')})`);
}

export function showBiomeMap() {
    console.log('🗺️ === BIOME CROP MAP ===');
    
    const biomes = [
        'tropical_rainforest',
        'temperate_deciduous',
        'mediterranean',
        'temperate_grassland',
        'hot_desert'
    ];
    
    biomes.forEach(biome => {
        const crops = getCropsForBiome(biome);
        console.log(`\n${biome.toUpperCase()}:`);
        console.log(`   🍎 ${crops.fruits.length} fruits: ${crops.fruits.map(f => f.id).slice(0, 5).join(', ')}...`);
        console.log(`   🥬 ${crops.vegetables.length} vegetables: ${crops.vegetables.map(v => v.id).slice(0, 5).join(', ')}...`);
    });
}

// Make functions globally accessible
window.showAvailableCrops = showAvailableCrops;
window.createCropFieldAt = createCropFieldAt;
window.getCropStats = getCropStats;
window.testCropModel = testCropModel;
window.createGrowthDemo = createGrowthDemo;
window.showBiomeMap = showBiomeMap;

console.log('🌍 Enhanced world system with CROP SYSTEMS loaded');
console.log('💡 Debug functions available:');
console.log('   - showAvailableCrops(x, z)');
console.log('   - createCropFieldAt(cropId, x, z)');
console.log('   - getCropStats()');
console.log('   - testCropModel(cropId, x, y, z)');
console.log('   - createGrowthDemo(cropId, x, z)');
console.log('   - showBiomeMap()');
