// === Farm Dominion v6.1 - world.js (Gerçekçi Gün–Gece + Sis + Bitki Büyüme) ===
import * as THREE from './three.module.js';
import { PointerLockControls } from './PointerLockControls.js';
import { TerrainManager } from './terrain.js';
import { UIManager } from './ui.js';
import { CropsManager } from './CropsManager.js';

export class World {
  constructor(container) {
    this.container = container;
    this.ui = new UIManager();

    // === SAHNE ===
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#bcd0e0');
    this.scene.fog = new THREE.FogExp2('#bcd0e0', 0.0015);

    // === KAMERA ===
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    this.camera.position.set(0, 50, 100);

    // === RENDERER ===
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // === KONTROLLER ===
    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    this.container.addEventListener('click', () => this.controls.lock());

    // === IŞIKLANDIRMA ===
    this.setupLights();

    // === ARAZİ === (THREE referansı aktarıldı)
    this.terrainManager = new TerrainManager(this.scene, THREE);

    // === BİTKİLER ===
    this.cropsManager = new CropsManager(this.scene, THREE);
    this.cropsManager.randomPlantField(6, 6, 12);

    // === SAAT ===
    this.clock = new THREE.Clock();

    // === GÜN–GECE DÖNGÜSÜ ===
    this.dayDuration = 60; // saniye başına 1 gün
    this.sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.sunLight.position.set(300, 400, 200);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.scene.add(this.sunLight);

    // === DÜNYAYI YÜKLE ===
    this.loadWorld();

    // === PENCERE BOYUTLANDIRMA ===
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLights() {
    const hemi = new THREE.HemisphereLight(0xffffff, 0x555555, 0.6);
    hemi.position.set(0, 200, 0);
    this.scene.add(hemi);
  }

  async loadWorld() {
    console.log("🌍 Harita yükleniyor...");
    for (let i = 0; i <= 100; i += 5) {
      this.ui.updateProgress(i);
      await new Promise(r => setTimeout(r, 50));
    }

    await this.terrainManager.loadTerrainData();
    this.ui.hideLoading();
    console.log("✅ Harita yüklendi!");
    this.animate();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateDayNightCycle(elapsed) {
    const dayProgress = (elapsed % this.dayDuration) / this.dayDuration;
    const angle = dayProgress * Math.PI * 2;

    // ☀️ Güneş pozisyonu
    this.sunLight.position.set(Math.cos(angle) * 300, Math.sin(angle) * 400, 200);

    // 🌄 Işık şiddeti ve renk değişimi
    const intensity = Math.max(0.1, Math.sin(angle) * 1.2);
    this.sunLight.intensity = intensity;

    // 🎨 Gökyüzü ve sis rengi
    const lightness = 0.4 + 0.3 * Math.sin(angle);
    const skyColor = new THREE.Color().setHSL(0.6, 0.5, lightness);
    this.scene.background = skyColor;
    this.scene.fog.color.copy(skyColor);
    this.scene.fog.density = 0.001 + 0.002 * (1 - Math.sin(angle));

    // 🌱 Bitki büyümesi için gün şiddetini döndür
    return intensity;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    const elapsed = this.clock.elapsedTime;

    const lightFactor = this.updateDayNightCycle(elapsed);
    this.cropsManager.update(delta, lightFactor);

    this.ui.updateHUD(this.camera.position, elapsed);
    this.renderer.render(this.scene, this.camera);
  }
}
