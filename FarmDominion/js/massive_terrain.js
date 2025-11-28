// 🌍 Farm Dominion v2.1 - ULTRA MASSIVE Terrain System (500x!)
import * as THREE from './three.module.js';
import { perlin, multiOctaveNoise } from './utils.js';

export class MassiveTerrain {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // 500x büyük harita = 3,400,000 km²! (Hindistan büyüklüğü!)
        this.worldSize = 4000 * 500; // 2,000,000 units (2000 km x 2000 km)
        this.chunkSize = 500; // Her chunk 500x500 (daha büyük chunk'lar)
        this.chunksPerSide = Math.ceil(this.worldSize / this.chunkSize);
        this.viewDistance = 2000; // Görüş mesafesi 2 km
        
        this.chunks = new Map();
        this.loadedChunks = new Set();
        this.loadingQueue = [];
        this.isLoading = false;
        this.totalChunks = 0;
        this.loadedChunksCount = 0;
        
        // LOD (Level of Detail) ayarları - çok büyük harita için
        this.lodLevels = {
            ultra: { distance: 500, divisions: 128 },    // Çok yakın
            high: { distance: 1000, divisions: 64 },     // Yakın
            medium: { distance: 1500, divisions: 32 },   // Orta
            low: { distance: 2000, divisions: 16 },      // Uzak
            veryLow: { distance: 3000, divisions: 8 }    // Çok uzak
        };

        console.log(`🌍 ULTRA MASSIVE Terrain: ${this.worldSize}x${this.worldSize} units`);
        console.log(`📊 Area: ${(this.worldSize/1000)}x${(this.worldSize/1000)} km = ${Math.pow(this.worldSize/1000, 2).toFixed(0)} km²`);
        console.log(`🗺️ Chunks: ${this.chunksPerSide}x${this.chunksPerSide} = ${this.chunksPerSide * this.chunksPerSide} total`);
    }

    // Initialize terrain generation
    async initialize(onProgress) {
        console.log('🌍 Initializing ULTRA massive terrain (500x scale)...');
        
        // Calculate total chunks to load
        const centerChunkX = Math.floor(this.chunksPerSide / 2);
        const centerChunkZ = Math.floor(this.chunksPerSide / 2);
        const initialRadius = 3; // İlk yüklemede 3 chunk yarıçapı (daha az yükleme)
        
        this.totalChunks = (initialRadius * 2 + 1) * (initialRadius * 2 + 1);
        this.loadedChunksCount = 0;

        // Queue initial chunks around center
        for (let x = -initialRadius; x <= initialRadius; x++) {
            for (let z = -initialRadius; z <= initialRadius; z++) {
                const chunkX = centerChunkX + x;
                const chunkZ = centerChunkZ + z;
                
                if (chunkX >= 0 && chunkX < this.chunksPerSide && 
                    chunkZ >= 0 && chunkZ < this.chunksPerSide) {
                    await this.loadChunk(chunkX, chunkZ);
                    this.loadedChunksCount++;
                    
                    if (onProgress) {
                        onProgress(this.loadedChunksCount / this.totalChunks);
                    }
                }
            }
        }

        console.log(`✅ Loaded ${this.loadedChunksCount}/${this.totalChunks} initial chunks`);
        console.log(`📏 Each chunk: ${this.chunkSize}x${this.chunkSize} units (0.5km x 0.5km)`);
        return true;
    }

    // Load a single chunk
    async loadChunk(chunkX, chunkZ) {
        const key = `${chunkX}_${chunkZ}`;
        
        if (this.chunks.has(key)) {
            return this.chunks.get(key);
        }

        const chunk = this.generateChunk(chunkX, chunkZ);
        this.chunks.set(key, chunk);
        this.scene.add(chunk);
        
        return chunk;
    }

    // Generate chunk geometry with biome data
    generateChunk(chunkX, chunkZ) {
        const group = new THREE.Group();
        group.name = `chunk_${chunkX}_${chunkZ}`;

        // World position
        const worldX = (chunkX - this.chunksPerSide / 2) * this.chunkSize;
        const worldZ = (chunkZ - this.chunksPerSide / 2) * this.chunkSize;

        // Determine biome for this chunk
        const biome = this.getBiomeAt(worldX, worldZ);
        
        // High detail for close chunks
        const divisions = 64;
        const geometry = new THREE.PlaneGeometry(
            this.chunkSize,
            this.chunkSize,
            divisions,
            divisions
        );

        const vertices = geometry.attributes.position.array;

        // Generate heightmap based on biome
        for (let i = 0; i < vertices.length; i += 3) {
            const localX = vertices[i];
            const localZ = vertices[i + 2];
            const globalX = worldX + localX;
            const globalZ = worldZ + localZ;

            const height = this.generateHeight(globalX, globalZ, biome);
            vertices[i + 1] = height;
        }

        geometry.computeVertexNormals();

        // Material based on biome
        const color = this.getBiomeColor(biome);
        const material = new THREE.MeshLambertMaterial({
            color: color,
            flatShading: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(worldX, 0, worldZ);
        mesh.receiveShadow = true;
        mesh.userData.chunkX = chunkX;
        mesh.userData.chunkZ = chunkZ;
        mesh.userData.biome = biome;

        group.add(mesh);
        group.position.set(0, 0, 0);

        return group;
    }

    // Determine biome based on position - Realistic distribution
    getBiomeAt(x, z) {
        // Latitude effect (distance from equator)
        const latitude = Math.abs(z / 10000); // 0-200 range
        
        // Temperature: Hot at equator, cold at poles
        const baseTemp = 30 - (latitude * 0.3);
        const tempVariation = perlin(x * 0.00001, z * 0.00001) * 15;
        const temperature = baseTemp + tempVariation;
        
        // Moisture: Based on Perlin noise
        const moistureNoise = perlin(x * 0.00003, z * 0.00003);
        const moisture = ((moistureNoise + 1) / 2) * 100; // 0-100%
        
        // Elevation
        const elevation = this.getElevationSimple(x, z);

        // Biome selection based on temperature, moisture, elevation
        
        // Mountains (high elevation)
        if (elevation > 400) {
            if (temperature < -5) return 'arctic_tundra';
            if (temperature < 10) return 'alpine_tundra';
            return 'montane_forest';
        }

        // Hot regions (tropical)
        if (temperature > 25) {
            if (moisture > 80) return 'tropical_rainforest';
            if (moisture > 50) return 'tropical_dry_forest';
            if (moisture > 30) return 'savanna';
            return 'hot_desert';
        }

        // Warm regions (subtropical/Mediterranean)
        if (temperature > 15) {
            if (moisture < 40) return 'mediterranean';
            if (moisture < 70) return 'temperate_grassland';
            return 'temperate_deciduous';
        }

        // Cool regions (temperate)
        if (temperature > 5) {
            if (moisture < 40) return 'cold_desert';
            if (moisture < 70) return 'temperate_coniferous';
            return 'temperate_deciduous';
        }

        // Cold regions (boreal/tundra)
        if (temperature > -10) {
            return 'boreal_forest';
        }

        // Very cold
        return 'arctic_tundra';
    }

    // Get biome color
    getBiomeColor(biome) {
        const colors = {
            tropical_rainforest: 0x1a4d1a,
            tropical_dry_forest: 0x4d7c4d,
            savanna: 0x9acd32,
            hot_desert: 0xe8d4b4,
            mediterranean: 0x6b8e23,
            temperate_grassland: 0x7cb342,
            temperate_deciduous: 0x4d9d4d,
            temperate_coniferous: 0x2d6b2d,
            boreal_forest: 0x1a3a1a,
            arctic_tundra: 0xe8f4f8,
            alpine_tundra: 0xc8dce8,
            cold_desert: 0xd4c4b4,
            montane_forest: 0x3d6b3d
        };
        return colors[biome] || 0x4d9d4d;
    }

    // Generate height at position with biome consideration
    generateHeight(x, z, biome) {
        // Base terrain
        const baseHeight = perlin(x * 0.0001, z * 0.0001) * 300;
        
        // Large scale features (mountains, valleys)
        const mountains = Math.max(0, perlin(x * 0.00003, z * 0.00003)) * 800;
        
        // Medium scale (hills)
        const hills = Math.sin(x * 0.0003) * Math.cos(z * 0.0003) * 100;
        
        // Small scale detail
        const detail = multiOctaveNoise(x, z, 4) * 30;

        // Biome-specific adjustments
        let biomeHeight = baseHeight + hills + detail;
        
        switch(biome) {
            case 'tropical_rainforest':
                biomeHeight += mountains * 0.3; // Moderate mountains
                break;
            case 'savanna':
                biomeHeight = baseHeight * 0.5; // Flat plains
                break;
            case 'hot_desert':
                biomeHeight = baseHeight * 0.3 + Math.abs(perlin(x * 0.0005, z * 0.0005)) * 100; // Dunes
                break;
            case 'boreal_forest':
                biomeHeight += mountains * 0.6; // Rolling hills
                break;
            case 'montane_forest':
            case 'alpine_tundra':
                biomeHeight += mountains; // High mountains
                break;
            default:
                biomeHeight += mountains * 0.4;
        }

        return biomeHeight;
    }

    // Simple elevation for biome determination
    getElevationSimple(x, z) {
        return perlin(x * 0.00003, z * 0.00003) * 500;
    }

    // Update chunks based on camera position
    update(cameraPosition) {
        // Calculate which chunks should be visible
        const chunkX = Math.floor((cameraPosition.x + this.worldSize / 2) / this.chunkSize);
        const chunkZ = Math.floor((cameraPosition.z + this.worldSize / 2) / this.chunkSize);

        const radius = Math.ceil(this.viewDistance / this.chunkSize);

        // Load nearby chunks
        for (let x = -radius; x <= radius; x++) {
            for (let z = -radius; z <= radius; z++) {
                const targetX = chunkX + x;
                const targetZ = chunkZ + z;

                if (targetX >= 0 && targetX < this.chunksPerSide &&
                    targetZ >= 0 && targetZ < this.chunksPerSide) {
                    
                    const key = `${targetX}_${targetZ}`;
                    const distance = Math.sqrt(x * x + z * z) * this.chunkSize;

                    if (!this.chunks.has(key) && distance < this.viewDistance) {
                        this.loadChunk(targetX, targetZ);
                    }
                }
            }
        }

        // Unload far chunks to save memory
        this.chunks.forEach((chunk, key) => {
            const [cx, cz] = key.split('_').map(Number);
            const dx = cx - chunkX;
            const dz = cz - chunkZ;
            const distance = Math.sqrt(dx * dx + dz * dz) * this.chunkSize;

            if (distance > this.viewDistance * 2) { // Double distance for unload
                this.scene.remove(chunk);
                chunk.traverse(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                });
                this.chunks.delete(key);
            }
        });

        // Update LOD based on distance
        this.updateLOD(cameraPosition);
    }

    // Update Level of Detail
    updateLOD(cameraPosition) {
        this.chunks.forEach((chunk) => {
            chunk.traverse(child => {
                if (child.isMesh && child.geometry) {
                    const distance = child.position.distanceTo(cameraPosition);

                    // Adjust detail based on distance
                    if (distance < this.lodLevels.ultra.distance) {
                        child.visible = true;
                    } else if (distance < this.lodLevels.high.distance) {
                        child.visible = true;
                    } else if (distance < this.lodLevels.medium.distance) {
                        child.visible = true;
                    } else if (distance < this.lodLevels.low.distance) {
                        child.visible = true;
                    } else {
                        child.visible = distance < this.lodLevels.veryLow.distance;
                    }
                }
            });
        });
    }

    // Get height at world position
    getHeightAt(x, z) {
        // Determine biome first
        const biome = this.getBiomeAt(x, z);
        return this.generateHeight(x, z, biome);
    }

    // Get chunk count
    getChunkCount() {
        return this.chunks.size;
    }

    // Get world size
    getWorldSize() {
        return this.worldSize;
    }

    // Get world size in km
    getWorldSizeKm() {
        return this.worldSize / 1000;
    }

    // Get biome at position (public method)
    getBiomeAtPosition(x, z) {
        return this.getBiomeAt(x, z);
    }

    // Dispose all chunks
    dispose() {
        this.chunks.forEach((chunk) => {
            this.scene.remove(chunk);
            chunk.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        });
        this.chunks.clear();
    }
}

console.log('🌍 ULTRA MASSIVE terrain system loaded (500x scale!)');
