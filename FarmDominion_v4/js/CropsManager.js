// === Farm Dominion v5 - CropsManager.js ===
// Farklı mahsulleri GrowthSystem ile yöneten sınıf.

import * as THREE from './three.module.js';
import { GrowthSystem } from './GrowthSystem.js';

export class CropsManager {
  constructor(scene) {
    this.scene = scene;
    this.growthSystem = new GrowthSystem(scene);
    this.crops = [];

    // Her mahsulün temel tanımı
    this.cropTypes = {
      wheat:  { color: 0xe6d47f, growthTime: 60, light: 1.0, moisture: 0.8, size: 1.2 },
      corn:   { color: 0xffe45c, growthTime: 70, light: 1.0, moisture: 0.7, size: 1.5 },
      tomato: { color: 0xd43c3c, growthTime: 55, light: 0.9, moisture: 1.0, size: 0.8 },
      potato: { color: 0xa07445, growthTime: 65, light: 0.8, moisture: 0.9, size: 0.7 },
      garlic: { color: 0xe3dccb, growthTime: 50, light: 0.8, moisture: 0.7, size: 0.5 },
      onion:  { color: 0xd3b36b, growthTime: 55, light: 0.9, moisture: 0.8, size: 0.7 },
      watermelon: { color: 0x3c9b4b, growthTime: 90, light: 1.0, moisture: 1.1, size: 2.0 },
      melon:  { color: 0xc8d87c, growthTime: 85, light: 1.0, moisture: 1.0, size: 1.8 },
      lettuce:{ color: 0x8dd96a, growthTime: 40, light: 0.7, moisture: 1.1, size: 1.0 },
      carrot: { color: 0xff9633, growthTime: 50, light: 0.9, moisture: 1.0, size: 0.8 },
    };
  }

  createCropMesh(color, size) {
    // Geçici model (ileride 3D modelle değiştirilebilir)
    const geometry = new THREE.ConeGeometry(0.5, 2, 6);
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.8,
      metalness: 0.1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.scale.set(size, size, size);
    return mesh;
  }

  plantCrop(type, position) {
    const def = this.cropTypes[type];
    if (!def) {
      console.warn(`🚫 Bilinmeyen mahsul tipi: ${type}`);
      return;
    }

    const mesh = this.createCropMesh(def.color, 0.01);
    mesh.position.copy(position);
    this.scene.add(mesh);

    this.growthSystem.addCrop(mesh, {
      name: type,
      growthTime: def.growthTime,
      lightSensitivity: def.light,
      moistureNeed: def.moisture,
      maxScale: def.size,
    });

    this.crops.push({ type, mesh });
    console.log(`🌱 ${type} ekildi!`);
  }

  update(delta, dayProgress) {
    this.growthSystem.update(delta, dayProgress);
  }

  randomPlantField(rows = 4, cols = 4, spacing = 10) {
    const types = Object.keys(this.cropTypes);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * spacing;
        const z = (r - rows / 2) * spacing;
        const type = types[Math.floor(Math.random() * types.length)];
        this.plantCrop(type, new THREE.Vector3(x, 0, z));
      }
    }
  }
}
