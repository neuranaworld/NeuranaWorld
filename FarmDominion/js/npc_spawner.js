// 🐄 Farm Dominion v2.1 - NPC Spawner System
// ✅ Config loader entegrasyonu ile hayvan oluşturma

import * as THREE from './three.module.js';

/**
 * NPCSpawner
 * 
 * Özellikler:
 * ✅ Config'den hayvan yükleme
 * ✅ Farklı hayvan modelleri (cow, sheep, chicken, horse)
 * ✅ Otomatik AI hareketi
 * ✅ Terrain takibi
 * ✅ Boundary kontrolü
 */

export class NPCSpawner {
    constructor(scene, terrain) {
        this.scene = scene;
        this.terrain = terrain;
        this.npcs = [];
        this.materials = this.createMaterials();
        this.configNPCs = null;
    }

    /**
     * Materyal oluştur
     */
    createMaterials() {
        return {
            cow: new THREE.MeshLambertMaterial({ color: 0xffffff }),
            sheep: new THREE.MeshLambertMaterial({ color: 0xf5f5f5 }),
            chicken: new THREE.MeshLambertMaterial({ color: 0xff6347 }),
            horse: new THREE.MeshLambertMaterial({ color: 0x8b4513 }),
            default: new THREE.MeshLambertMaterial({ color: 0xcccccc })
        };
    }

    /**
     * ✅ Config'den NPCler yükle
     */
    loadFromConfig(npcsConfig) {
        if (!npcsConfig || npcsConfig.length === 0) {
            console.warn('⚠️ No NPCs in config, using defaults');
            return this.createDefaultNPCs();
        }
        
        this.configNPCs = npcsConfig;
        console.log(`🐄 Loading ${npcsConfig.length} NPCs from config...`);
        
        npcsConfig.forEach((npcData, index) => {
            try {
                const npc = this.createNPCFromConfig(npcData);
                if (npc) {
                    this.npcs.push(npc);
                }
            } catch (error) {
                console.error(`Error creating NPC ${index}:`, error);
            }
        });
        
        console.log(`✅ Loaded ${this.npcs.length} NPCs from config`);
        return this.npcs.length;
    }

    /**
     * ✅ Config verisinden NPC oluştur
     */
    createNPCFromConfig(data) {
        const { type, name, x, y, z, color } = data;
        
        // Terrain yüksekliğini al
        const terrainY = this.terrain ? this.terrain.getHeightAt(x, z) : y || 0;
        
        let mesh = null;
        
        switch(type.toLowerCase()) {
            case 'cow':
                mesh = this.createCow(x, terrainY, z, color);
                break;
            case 'sheep':
                mesh = this.createSheep(x, terrainY, z, color);
                break;
            case 'chicken':
                mesh = this.createChicken(x, terrainY, z, color);
                break;
            case 'horse':
                mesh = this.createHorse(x, terrainY, z, color);
                break;
            default:
                console.warn(`Unknown NPC type: ${type}`);
                mesh = this.createGenericNPC(x, terrainY, z, color);
        }
        
        if (mesh) {
            mesh.userData.type = type;
            mesh.userData.name = name;
            mesh.userData.originalPosition = { x, y: terrainY, z };
            
            // AI data
            mesh.userData.velocity = new THREE.Vector3();
            mesh.userData.direction = Math.random() * Math.PI * 2;
            mesh.userData.speed = 5 + Math.random() * 10;
            mesh.userData.changeDirectionTimer = 0;
            mesh.userData.changeDirectionInterval = 3 + Math.random() * 5;
            
            return {
                mesh: mesh,
                type: type,
                name: name
            };
        }
        
        return null;
    }

    /**
     * ✅ Varsayılan NPCler oluştur
     */
    createDefaultNPCs() {
        const defaults = [
            { type: 'cow', name: 'Bessie', x: 100, y: 0, z: 50, color: 0xffffff },
            { type: 'cow', name: 'Daisy', x: -80, y: 0, z: 70, color: 0xf0e68c },
            { type: 'sheep', name: 'Fluffy', x: 120, y: 0, z: -30, color: 0xffffff },
            { type: 'horse', name: 'Thunder', x: -120, y: 0, z: 100, color: 0x8b4513 }
        ];
        
        console.log('🐄 Creating default NPCs...');
        
        defaults.forEach(npcData => {
            const npc = this.createNPCFromConfig(npcData);
            if (npc) {
                this.npcs.push(npc);
            }
        });
        
        return this.npcs.length;
    }

    /**
     * İnek modeli oluştur
     */
    createCow(x, y, z, color = 0xffffff) {
        const group = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({ color });
        
        // Gövde
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(4, 3, 6),
            material
        );
        body.position.y = 2;
        body.castShadow = true;
        group.add(body);
        
        // Baş
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 2.5, 3),
            material
        );
        head.position.set(0, 2.5, 4.5);
        head.castShadow = true;
        group.add(head);
        
        // Boynuzlar
        const horn1 = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 1, 4),
            new THREE.MeshLambertMaterial({ color: 0x888888 })
        );
        horn1.position.set(-0.8, 3.5, 5);
        horn1.rotation.z = Math.PI / 6;
        group.add(horn1);
        
        const horn2 = horn1.clone();
        horn2.position.x = 0.8;
        horn2.rotation.z = -Math.PI / 6;
        group.add(horn2);
        
        // Bacaklar
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.4, 0.4, 2),
                material
            );
            const xPos = (i % 2) * 3 - 1.5;
            const zPos = Math.floor(i / 2) * 4 - 2;
            leg.position.set(xPos, 0, zPos);
            leg.castShadow = true;
            group.add(leg);
        }
        
        group.position.set(x, y, z);
        this.scene.add(group);
        
        return group;
    }

    /**
     * Koyun modeli oluştur
     */
    createSheep(x, y, z, color = 0xf5f5f5) {
        const group = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({ color });
        
        // Gövde (yuvarlak)
        const body = new THREE.Mesh(
            new THREE.SphereGeometry(2, 8, 8),
            material
        );
        body.position.y = 2;
        body.scale.set(1, 0.8, 1.2);
        body.castShadow = true;
        group.add(body);
        
        // Baş (daha koyu)
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(1, 8, 8),
            new THREE.MeshLambertMaterial({ color: 0x333333 })
        );
        head.position.set(0, 2, 3);
        head.scale.set(0.8, 0.8, 1);
        head.castShadow = true;
        group.add(head);
        
        // Bacaklar
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.3, 1.5),
                new THREE.MeshLambertMaterial({ color: 0x333333 })
            );
            const xPos = (i % 2) * 2 - 1;
            const zPos = Math.floor(i / 2) * 2 - 1;
            leg.position.set(xPos, 0, zPos);
            leg.castShadow = true;
            group.add(leg);
        }
        
        group.position.set(x, y, z);
        this.scene.add(group);
        
        return group;
    }

    /**
     * Tavuk modeli oluştur
     */
    createChicken(x, y, z, color = 0xff6347) {
        const group = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({ color });
        
        // Gövde
        const body = new THREE.Mesh(
            new THREE.SphereGeometry(1, 8, 8),
            material
        );
        body.position.y = 1;
        body.scale.set(0.8, 1, 1);
        body.castShadow = true;
        group.add(body);
        
        // Baş
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 6, 6),
            material
        );
        head.position.set(0, 1.5, 0.8);
        head.castShadow = true;
        group.add(head);
        
        // Gaga
        const beak = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 0.4, 4),
            new THREE.MeshLambertMaterial({ color: 0xffa500 })
        );
        beak.position.set(0, 1.5, 1.3);
        beak.rotation.x = Math.PI / 2;
        group.add(beak);
        
        // Bacaklar
        for (let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.1, 0.8),
                new THREE.MeshLambertMaterial({ color: 0xffa500 })
            );
            leg.position.set(i * 0.5 - 0.25, 0, 0);
            leg.castShadow = true;
            group.add(leg);
        }
        
        group.position.set(x, y, z);
        this.scene.add(group);
        
        return group;
    }

    /**
     * At modeli oluştur
     */
    createHorse(x, y, z, color = 0x8b4513) {
        const group = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({ color });
        
        // Gövde
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 7),
            material
        );
        body.position.y = 3.5;
        body.castShadow = true;
        group.add(body);
        
        // Boyun
        const neck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.8, 1, 3),
            material
        );
        neck.position.set(0, 4.5, 4);
        neck.rotation.x = Math.PI / 6;
        neck.castShadow = true;
        group.add(neck);
        
        // Baş
        const head = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 2, 2.5),
            material
        );
        head.position.set(0, 6, 5);
        head.castShadow = true;
        group.add(head);
        
        // Bacaklar
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.4, 0.3, 3),
                material
            );
            const xPos = (i % 2) * 2 - 1;
            const zPos = Math.floor(i / 2) * 4 - 2;
            leg.position.set(xPos, 1, zPos);
            leg.castShadow = true;
            group.add(leg);
        }
        
        // Kuyruk
        const tail = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.1, 2),
            material
        );
        tail.position.set(0, 3, -4);
        tail.rotation.x = Math.PI / 4;
        group.add(tail);
        
        group.position.set(x, y, z);
        this.scene.add(group);
        
        return group;
    }

    /**
     * Generic NPC (fallback)
     */
    createGenericNPC(x, y, z, color = 0xcccccc) {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshLambertMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(x, y + 1, z);
        mesh.castShadow = true;
        
        this.scene.add(mesh);
        
        return mesh;
    }

    /**
     * ✅ NPCleri güncelle (AI hareketi)
     */
    update(delta) {
        this.npcs.forEach(npc => {
            if (!npc.mesh) return;
            
            const mesh = npc.mesh;
            const userData = mesh.userData;
            
            // Yön değiştirme zamanı
            userData.changeDirectionTimer += delta;
            
            if (userData.changeDirectionTimer >= userData.changeDirectionInterval) {
                userData.direction = Math.random() * Math.PI * 2;
                userData.changeDirectionTimer = 0;
                userData.changeDirectionInterval = 3 + Math.random() * 5;
            }
            
            // Hareket hesapla
            const moveSpeed = userData.speed * delta;
            const dx = Math.cos(userData.direction) * moveSpeed;
            const dz = Math.sin(userData.direction) * moveSpeed;
            
            // Yeni pozisyon
            const newX = mesh.position.x + dx;
            const newZ = mesh.position.z + dz;
            
            // Sınır kontrolü (terrain boyutları içinde kal)
            const worldSize = this.terrain ? this.terrain.getWorldSize() : 4000;
            const halfWorld = worldSize / 2;
            
            if (Math.abs(newX) < halfWorld - 50 && Math.abs(newZ) < halfWorld - 50) {
                mesh.position.x = newX;
                mesh.position.z = newZ;
                
                // Terrain yüksekliğine ayarla
                if (this.terrain) {
                    mesh.position.y = this.terrain.getHeightAt(newX, newZ);
                }
                
                // Yönü göster (rotation)
                mesh.rotation.y = userData.direction;
            } else {
                // Sınıra çarptı, yön değiştir
                userData.direction += Math.PI;
                userData.changeDirectionTimer = 0;
            }
        });
    }

    /**
     * Tüm NPCleri al
     */
    getNPCs() {
        return this.npcs;
    }

    /**
     * Temizle
     */
    clear() {
        this.npcs.forEach(npc => {
            if (npc.mesh) {
                this.scene.remove(npc.mesh);
                if (npc.mesh.geometry) npc.mesh.geometry.dispose();
                if (npc.mesh.material) npc.mesh.material.dispose();
            }
        });
        this.npcs = [];
    }

    /**
     * İstatistikler
     */
    getStats() {
        const types = {};
        this.npcs.forEach(npc => {
            types[npc.type] = (types[npc.type] || 0) + 1;
        });
        
        return {
            total: this.npcs.length,
            byType: types
        };
    }
}

console.log('🐄 NPC Spawner loaded (with config support!)');
