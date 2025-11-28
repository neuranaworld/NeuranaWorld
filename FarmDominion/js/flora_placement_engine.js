// 🌳 Farm Dominion v2.1 - Flora Placement Engine
// Biom bazlı otomatik ağaç ve bitki yerleştirme sistemi
// Massive terrain entegrasyonu ile

import * as THREE from './three.module.js';
import { ExtendedTreeDatabase, VegetableDatabase, getTreesByBiome, getRandomTree } from './extended_plant_database.js';
import { PlantModelFactory } from './plant_models.js';

/**
 * FloraPlacementEngine
 * 
 * Özellikler:
 * ✅ Biom bazlı ağaç yerleştirme
 * ✅ Yoğunluk kontrolü (bioma göre)
 * ✅ Gerçekçi dağılım (Poisson disk sampling)
 * ✅ Massive terrain entegrasyonu
 * ✅ LOD desteği
 * ✅ Chunk bazlı yükleme
 * ✅ Performance optimization
 */

export class FloraPlacementEngine {
    constructor(scene, terrain) {
        this.scene = scene;
        this.terrain = terrain;
        this.modelFactory = new PlantModelFactory();
        
        // Yerleştirilmiş bitkiler
        this.placedFlora = new Map(); // chunk_key -> [flora objects]
        this.totalPlaced = 0;
        
        // Yoğunluk ayarları (bioma göre)
        this.densitySettings = {
            tropical_rainforest: 0.9,     // Çok yoğun
            temperate_deciduous: 0.7,     // Yoğun
            temperate_coniferous: 0.65,   // Yoğun
            boreal_forest: 0.75,          // Yoğun
            mediterranean: 0.4,           // Orta
            savanna: 0.15,                // Seyrek
            temperate_grassland: 0.1,     // Çok seyrek
            hot_desert: 0.02,             // Çok çok seyrek
            cold_desert: 0.03,            // Çok seyrek
            arctic_tundra: 0.05,          // Seyrek
            alpine_tundra: 0.08,          // Seyrek
            tropical_dry: 0.5             // Orta
        };
        
        // Minimum mesafe ayarları (ağaçlar arası)
        this.minDistanceSettings = {
            tropical_rainforest: 8,
            temperate_deciduous: 12,
            temperate_coniferous: 10,
            boreal_forest: 10,
            mediterranean: 15,
            savanna: 25,
            temperate_grassland: 30,
            hot_desert: 50,
            cold_desert: 40,
            arctic_tundra: 30,
            alpine_tundra: 20,
            tropical_dry: 18
        };
        
        console.log('🌳 Flora Placement Engine initialized');
    }

    /**
     * Chunk için flora yerleştir
     * @param {number} chunkX - Chunk X koordinatı
     * @param {number} chunkZ - Chunk Z koordinatı
     * @param {number} chunkSize - Chunk boyutu
     * @param {string} dominantBiome - Baskın biom
     */
    placeFloraForChunk(chunkX, chunkZ, chunkSize, dominantBiome) {
        const chunkKey = `${chunkX}_${chunkZ}`;
        
        // Zaten yerleştirilmiş mi?
        if (this.placedFlora.has(chunkKey)) {
            return this.placedFlora.get(chunkKey);
        }
        
        const group = new THREE.Group();
        group.name = `flora_chunk_${chunkKey}`;
        
        // World pozisyonu hesapla
        const worldX = (chunkX - this.terrain.chunksPerSide / 2) * chunkSize;
        const worldZ = (chunkZ - this.terrain.chunksPerSide / 2) * chunkSize;
        
        // Bioma göre yoğunluk
        const density = this.densitySettings[dominantBiome] || 0.3;
        const minDistance = this.minDistanceSettings[dominantBiome] || 15;
        
        // Ağaç sayısı hesapla
        const treeCount = Math.floor((chunkSize * chunkSize) / (minDistance * minDistance) * density);
        
        // Poisson disk sampling ile nokta oluştur
        const points = this.poissonDiskSampling(
            worldX,
            worldZ,
            chunkSize,
            chunkSize,
            minDistance,
            treeCount
        );
        
        // Her nokta için ağaç yerleştir
        points.forEach(point => {
            const tree = this.placeTree(point.x, point.z, dominantBiome);
            if (tree) {
                group.add(tree);
                this.totalPlaced++;
            }
        });
        
        // Chunk'ı sahnede yerleştir
        this.scene.add(group);
        
        // Kaydet
        this.placedFlora.set(chunkKey, group);
        
        console.log(`🌲 Flora placed for chunk ${chunkKey}: ${points.length} trees (${dominantBiome})`);
        
        return group;
    }

    /**
     * Belirli bir pozisyona ağaç yerleştir
     */
    placeTree(x, z, biome) {
        try {
            // Bioma uygun rastgele ağaç seç
            const treeData = getRandomTree(biome);
            
            if (!treeData) {
                // Fallback: Generic tree
                return this.createGenericTree(x, z);
            }
            
            // Yükseklik al (terrain'den)
            const y = this.terrain.getHeightAt(x, z);
            
            // Su seviyesinin altında mı?
            if (y < -10) {
                return null; // Su altına ağaç yerleştirme
            }
            
            // Ağaç modelini oluştur
            const tree = this.modelFactory.createTree(treeData.id, x, y, z);
            
            if (!tree) {
                return null;
            }
            
            // Rastgele rotasyon
            tree.rotation.y = Math.random() * Math.PI * 2;
            
            // Rastgele ölçek (varyasyon için)
            const scale = 0.8 + Math.random() * 0.4; // 0.8-1.2 arası
            tree.scale.set(scale, scale, scale);
            
            // Metadata ekle
            tree.userData.biome = biome;
            tree.userData.treeType = treeData.id;
            tree.userData.chunkX = Math.floor(x / this.terrain.chunkSize);
            tree.userData.chunkZ = Math.floor(z / this.terrain.chunkSize);
            
            return tree;
            
        } catch (error) {
            console.warn('Tree placement error:', error);
            return null;
        }
    }

    /**
     * Generic tree oluştur (fallback)
     */
    createGenericTree(x, z) {
        const y = this.terrain.getHeightAt(x, z);
        
        if (y < -10) return null;
        
        const group = new THREE.Group();
        
        // Gövde
        const trunkHeight = 5 + Math.random() * 5;
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, trunkHeight, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x3d2817 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Taç
        const crownRadius = 2 + Math.random() * 2;
        const crownGeometry = new THREE.SphereGeometry(crownRadius, 8, 8);
        const crownMaterial = new THREE.MeshLambertMaterial({ color: 0x2d6b2d });
        const crown = new THREE.Mesh(crownGeometry, crownMaterial);
        crown.position.y = trunkHeight + crownRadius / 2;
        crown.castShadow = true;
        group.add(crown);
        
        group.position.set(x, y, z);
        
        return group;
    }

    /**
     * Poisson Disk Sampling
     * Ağaçlar arası minimum mesafeyi garanti eder
     */
    poissonDiskSampling(startX, startZ, width, height, minDistance, numSamples) {
        const points = [];
        const cellSize = minDistance / Math.sqrt(2);
        const gridWidth = Math.ceil(width / cellSize);
        const gridHeight = Math.ceil(height / cellSize);
        const grid = new Array(gridWidth * gridHeight).fill(null);
        
        const activeList = [];
        
        // İlk nokta
        const firstPoint = {
            x: startX + Math.random() * width,
            z: startZ + Math.random() * height
        };
        
        points.push(firstPoint);
        activeList.push(firstPoint);
        
        const gridX = Math.floor((firstPoint.x - startX) / cellSize);
        const gridZ = Math.floor((firstPoint.z - startZ) / cellSize);
        grid[gridZ * gridWidth + gridX] = firstPoint;
        
        // Numune sayısına ulaşana kadar veya active list boşalana kadar
        let attempts = 0;
        const maxAttempts = numSamples * 30;
        
        while (activeList.length > 0 && points.length < numSamples && attempts < maxAttempts) {
            attempts++;
            
            const randIndex = Math.floor(Math.random() * activeList.length);
            const point = activeList[randIndex];
            
            let found = false;
            
            for (let i = 0; i < 10; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = minDistance + Math.random() * minDistance;
                
                const newPoint = {
                    x: point.x + Math.cos(angle) * radius,
                    z: point.z + Math.sin(angle) * radius
                };
                
                // Sınırlar içinde mi?
                if (newPoint.x < startX || newPoint.x >= startX + width ||
                    newPoint.z < startZ || newPoint.z >= startZ + height) {
                    continue;
                }
                
                // Grid hücresini hesapla
                const gx = Math.floor((newPoint.x - startX) / cellSize);
                const gz = Math.floor((newPoint.z - startZ) / cellSize);
                
                // Yakında nokta var mı kontrol et
                let tooClose = false;
                
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dz = -2; dz <= 2; dz++) {
                        const ngx = gx + dx;
                        const ngz = gz + dz;
                        
                        if (ngx >= 0 && ngx < gridWidth && ngz >= 0 && ngz < gridHeight) {
                            const neighbor = grid[ngz * gridWidth + ngx];
                            
                            if (neighbor) {
                                const dist = Math.sqrt(
                                    Math.pow(newPoint.x - neighbor.x, 2) +
                                    Math.pow(newPoint.z - neighbor.z, 2)
                                );
                                
                                if (dist < minDistance) {
                                    tooClose = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (tooClose) break;
                }
                
                if (!tooClose) {
                    points.push(newPoint);
                    activeList.push(newPoint);
                    grid[gz * gridWidth + gx] = newPoint;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                activeList.splice(randIndex, 1);
            }
        }
        
        return points;
    }

    /**
     * Chunk'ı kaldır (memory yönetimi)
     */
    removeChunk(chunkX, chunkZ) {
        const chunkKey = `${chunkX}_${chunkZ}`;
        
        if (this.placedFlora.has(chunkKey)) {
            const group = this.placedFlora.get(chunkKey);
            
            // Scene'den kaldır
            this.scene.remove(group);
            
            // Geometri ve materyalleri temizle
            group.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            
            this.placedFlora.delete(chunkKey);
        }
    }

    /**
     * Kameraya yakın chunk'ları yükle
     */
    updateFloraForCamera(cameraPosition, viewDistance) {
        const chunkSize = this.terrain.chunkSize;
        const chunkX = Math.floor((cameraPosition.x + this.terrain.worldSize / 2) / chunkSize);
        const chunkZ = Math.floor((cameraPosition.z + this.terrain.worldSize / 2) / chunkSize);
        
        const radius = Math.ceil(viewDistance / chunkSize);
        
        // Yakın chunk'ları yükle
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dz = -radius; dz <= radius; dz++) {
                const targetX = chunkX + dx;
                const targetZ = chunkZ + dz;
                
                if (targetX >= 0 && targetX < this.terrain.chunksPerSide &&
                    targetZ >= 0 && targetZ < this.terrain.chunksPerSide) {
                    
                    const chunkKey = `${targetX}_${targetZ}`;
                    
                    if (!this.placedFlora.has(chunkKey)) {
                        // Biom bilgisini al
                        const worldX = (targetX - this.terrain.chunksPerSide / 2) * chunkSize;
                        const worldZ = (targetZ - this.terrain.chunksPerSide / 2) * chunkSize;
                        const biome = this.terrain.getBiomeAt(worldX, worldZ);
                        
                        // Flora yerleştir
                        this.placeFloraForChunk(targetX, targetZ, chunkSize, biome);
                    }
                }
            }
        }
        
        // Uzak chunk'ları kaldır
        this.placedFlora.forEach((group, chunkKey) => {
            const [cx, cz] = chunkKey.split('_').map(Number);
            const dx = cx - chunkX;
            const dz = cz - chunkZ;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            if (distance > radius * 2) {
                this.removeChunk(cx, cz);
            }
        });
    }

    /**
     * İstatistikler
     */
    getStats() {
        return {
            totalPlaced: this.totalPlaced,
            activeChunks: this.placedFlora.size,
            floraPerChunk: this.totalPlaced / (this.placedFlora.size || 1)
        };
    }

    /**
     * Tüm flora'yı temizle
     */
    clearAll() {
        this.placedFlora.forEach((group, key) => {
            this.scene.remove(group);
            group.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });
        
        this.placedFlora.clear();
        this.totalPlaced = 0;
        
        console.log('🌳 All flora cleared');
    }
}

console.log('🌳 Flora Placement Engine loaded');
