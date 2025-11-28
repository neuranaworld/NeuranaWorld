// 🌄 Farm Dominion v2 - Advanced Terrain System
import * as THREE from './three.module.js';
import { perlin, multiOctaveNoise, loadTexture, getTerrainColor } from './utils.js';

export class TerrainManager {
    constructor(scene) {
        this.scene = scene;
        this.terrainMesh = null;
        this.size = 4000;
        this.divisions = 256;
        this.waterLevel = 10;
    }

    // Create terrain with procedural generation
    createTerrain() {
        const geometry = new THREE.PlaneGeometry(
            this.size, 
            this.size, 
            this.divisions, 
            this.divisions
        );

        const vertices = geometry.attributes.position.array;

        // Generate height map using noise
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            
            // Multi-octave noise for natural looking terrain
            const height = this.generateHeight(x, z);
            vertices[i + 1] = height;
        }

        geometry.computeVertexNormals();

        // Load and apply textures
        const material = this.createTerrainMaterial();

        this.terrainMesh = new THREE.Mesh(geometry, material);
        this.terrainMesh.rotation.x = -Math.PI / 2;
        this.terrainMesh.receiveShadow = true;
        this.terrainMesh.name = 'terrain';

        this.scene.add(this.terrainMesh);
        console.log('🌄 Terrain created');

        return this.terrainMesh;
    }

    // Generate height at position
    generateHeight(x, z) {
        // Base terrain
        const baseHeight = perlin(x, z) * 200;
        
        // Add hills
        const hills = Math.sin(x * 0.001) * 20;
        
        // Add detail
        const detail = multiOctaveNoise(x, z, 3) * 30;
        
        return baseHeight + hills + detail;
    }

    // Create material with textures
    createTerrainMaterial() {
        try {
            // Try to load grass texture
            const grassTexture = new THREE.TextureLoader().load(
                '../assets/textures/grass.jpg',
                undefined,
                undefined,
                () => {
                    console.warn('⚠️ Grass texture not found, using color');
                }
            );
            
            grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
            grassTexture.repeat.set(50, 50);

            return new THREE.MeshLambertMaterial({
                map: grassTexture,
                color: 0x4fa64f
            });
        } catch (e) {
            // Fallback to simple color material
            return new THREE.MeshLambertMaterial({ color: 0x4fa64f });
        }
    }

    // Get height at world position
    getHeightAt(x, z) {
        if (!this.terrainMesh) return 0;

        const geometry = this.terrainMesh.geometry;
        const vertices = geometry.attributes.position.array;
        const size = Math.sqrt(vertices.length / 3);

        // Convert world coords to grid coords
        const gridX = Math.floor((x + this.size / 2) / this.size * size);
        const gridZ = Math.floor((z + this.size / 2) / this.size * size);

        if (gridX < 0 || gridX >= size || gridZ < 0 || gridZ >= size) {
            return 0;
        }

        const index = (gridZ * size + gridX) * 3;
        return vertices[index + 1] || 0;
    }

    // Update terrain (for dynamic changes)
    update(delta) {
        // Can be used for dynamic terrain deformation
    }

    // Get terrain mesh
    getMesh() {
        return this.terrainMesh;
    }

    // Dispose terrain
    dispose() {
        if (this.terrainMesh) {
            this.terrainMesh.geometry.dispose();
            this.terrainMesh.material.dispose();
            this.scene.remove(this.terrainMesh);
            this.terrainMesh = null;
        }
    }
}

// Legacy function for backwards compatibility
export async function loadTerrain(scene) {
    const manager = new TerrainManager(scene);
    return manager.createTerrain();
}

console.log('🌄 Terrain system loaded');
