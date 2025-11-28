// === Farm Dominion v5 - GrowthSystem.js ===
// Bitki büyüme fiziği ve çevresel etkenler.

export class GrowthSystem {
  constructor(scene) {
    this.scene = scene;
    this.crops = [];
    this.globalLightFactor = 1.0; // 1.0 = gündüz, 0.3 = gece
    this.globalMoisture = 0.8; // 0.0 kurak, 1.0 ideal, >1 aşırı sulanmış
  }

  addCrop(mesh, options = {}) {
    const crop = {
      mesh,
      name: options.name || "Unknown",
      growthTime: options.growthTime || 60, // saniye cinsinden
      currentTime: 0,
      stage: "seed",
      scaleFactor: 0,
      lightSensitivity: options.lightSensitivity || 1.0,
      moistureNeed: options.moistureNeed || 0.8,
      maxScale: options.maxScale || 1,
    };
    mesh.scale.set(0.001, 0.001, 0.001);
    this.scene.add(mesh);
    this.crops.push(crop);
  }

  update(deltaTime, dayProgress) {
    // Gündüz/gece ışık faktörü (0 → 1)
    this.globalLightFactor = Math.sin(dayProgress * Math.PI) * 0.7 + 0.3;

    for (const crop of this.crops) {
      // Çevresel faktörler
      const lightEffect = this.globalLightFactor * crop.lightSensitivity;
      const moistureEffect = 1 - Math.abs(this.globalMoisture - crop.moistureNeed);
      const growthRate = (lightEffect * 0.6 + moistureEffect * 0.4);

      // Zaman ilerlemesi
      crop.currentTime += deltaTime * growthRate;
      const progress = Math.min(crop.currentTime / crop.growthTime, 1);

      // Ease-out cubic büyüme eğrisi
      crop.scaleFactor = progress * progress * (3 - 2 * progress);
      crop.mesh.scale.setScalar(crop.scaleFactor * crop.maxScale);

      // Durum geçişleri
      if (progress < 0.25) crop.stage = "seed";
      else if (progress < 0.6) crop.stage = "sprout";
      else if (progress < 0.9) crop.stage = "mature";
      else crop.stage = "harvest";

      // Renk tonu değişimi (doğal yeşil → olgun sarı)
      if (crop.mesh.material && crop.mesh.material.color) {
        const c = crop.mesh.material.color;
        c.setHSL(0.33 - 0.1 * progress, 0.8, 0.4 + 0.3 * progress);
      }
    }
  }

  setMoisture(value) {
    this.globalMoisture = Math.max(0, Math.min(1.5, value));
  }

  getCropStates() {
    return this.crops.map(c => ({
      name: c.name,
      stage: c.stage,
      progress: (c.currentTime / c.growthTime * 100).toFixed(1) + "%",
    }));
  }
}
