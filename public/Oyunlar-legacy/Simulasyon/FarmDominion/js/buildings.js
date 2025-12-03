// 🏠 Farm Dominion v2.1 - Building System
// ✅ UPDATED: Config loader entegrasyonu eklendi!

import * as THREE from './three.module.js';
import { loadTexture, random, randomInt } from './utils.js';

// Building types
export const BuildingTypes = {
    HOUSE: 'house',
    BARN: 'barn',
    WINDMILL: 'windmill',
    WELL: 'well',
    SILO: 'silo',
    GREENHOUSE: 'greenhouse',
    SHED: 'shed',
    FENCE: 'fence'
};

export class BuildingManager {
    constructor(scene) {
        this.scene = scene;
        this.buildings = [];
        this.materials = this.createMaterials();
        this.configBuildings = null; // Config'den yüklenen binalar
    }

    // Create building materials
    createMaterials() {
        return {
            wall: new THREE.MeshLambertMaterial({ color: 0xbb6644 }),
            roof: new THREE.MeshLambertMaterial({ color: 0x773333 }),
            wood: new THREE.MeshLambertMaterial({ color: 0x8b6f47 }),
            stone: new THREE.MeshLambertMaterial({ color: 0x999999 }),
            glass: new THREE.MeshPhongMaterial({ 
                color: 0x88ccff, 
                transparent: true, 
                opacity: 0.6,
                shininess: 100
            }),
            metal: new THREE.MeshStandardMaterial({ 
                color: 0x888888,
                metalness: 0.8,
                roughness: 0.2
            })
        };
    }

    /**
     * ✅ YENİ: Config'den binaları yükle
     * @param {Array} buildingsConfig - Config loader'dan gelen binalar
     */
    loadFromConfig(buildingsConfig) {
        if (!buildingsConfig || buildingsConfig.length === 0) {
            console.warn('⚠️ No buildings in config, using defaults');
            return this.createDefaultBuildings();
        }
        
        this.configBuildings = buildingsConfig;
        console.log(`🏠 Loading ${buildingsConfig.length} buildings from config...`);
        
        buildingsConfig.forEach((buildingData, index) => {
            try {
                const building = this.createBuildingFromConfig(buildingData);
                if (building) {
                    this.buildings.push({
                        type: buildingData.type,
                        mesh: building,
                        position: { x: buildingData.x, y: 0, z: buildingData.z },
                        rotation: buildingData.rotation
                    });
                }
            } catch (error) {
                console.error(`Error creating building ${index}:`, error);
            }
        });
        
        console.log(`✅ Loaded ${this.buildings.length} buildings from config`);
        return this.buildings.length;
    }

    /**
     * ✅ YENİ: Config verisinden bina oluştur
     */
    createBuildingFromConfig(data) {
        const { type, x, z, rotation } = data;
        
        // Terrain yüksekliğini al (varsa)
        const y = window.gameWorld ? window.gameWorld.terrain.getHeightAt(x, z) : 0;
        
        let building = null;
        
        switch(type.toLowerCase()) {
            case 'house':
                building = this.createHouse(x, y, z);
                break;
            case 'barn':
                building = this.createBarn(x, y, z);
                break;
            case 'windmill':
                building = this.createWindmill(x, y, z);
                break;
            case 'well':
                building = this.createWell(x, y, z);
                break;
            case 'silo':
                building = this.createSilo(x, y, z);
                break;
            case 'greenhouse':
                building = this.createGreenhouse(x, y, z);
                break;
            case 'shed':
                building = this.createShed(x, y, z);
                break;
            case 'fence':
                building = this.createFence(x, y, z);
                break;
            default:
                console.warn(`Unknown building type: ${type}`);
                return null;
        }
        
        if (building && rotation !== undefined) {
            building.rotation.y = (rotation * Math.PI) / 180; // Degrees to radians
        }
        
        return building;
    }

    /**
     * ✅ YENİ: Varsayılan binaları oluştur (config yoksa)
     */
    createDefaultBuildings() {
        const defaultPositions = [
            { type: 'house', x: 0, z: -200, rotation: 0 },
            { type: 'barn', x: 100, z: -180, rotation: 45 },
            { type: 'windmill', x: -150, z: -200, rotation: 0 },
            { type: 'well', x: 50, z: -150, rotation: 0 },
            { type: 'silo', x: 180, z: -160, rotation: 0 }
        ];
        
        console.log('🏠 Creating default buildings...');
        
        defaultPositions.forEach(pos => {
            const building = this.createBuildingFromConfig(pos);
            if (building) {
                this.buildings.push({
                    type: pos.type,
                    mesh: building,
                    position: { x: pos.x, y: 0, z: pos.z },
                    rotation: pos.rotation
                });
            }
        });
        
        return this.buildings.length;
    }

    // Create a house
    createHouse(x, y, z) {
        const group = new THREE.Group();

        // Main structure
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(30, 15, 30),
            this.materials.wall
        );
        wall.castShadow = true;
        wall.receiveShadow = true;
        group.add(wall);

        // Roof
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(22, 10, 4),
            this.materials.roof
        );
        roof.position.y = 12.5;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);

        // Door
        const door = new THREE.Mesh(
            new THREE.BoxGeometry(5, 8, 0.5),
            this.materials.wood
        );
        door.position.set(0, -3.5, 15);
        door.castShadow = true;
        group.add(door);

        // Windows
        for (let i = 0; i < 2; i++) {
            const window = new THREE.Mesh(
                new THREE.BoxGeometry(3, 4, 0.5),
                this.materials.glass
            );
            window.position.set((i - 0.5) * 10, 2, 15);
            group.add(window);
        }

        group.position.set(x, y, z);
        group.userData.buildingType = 'house';
        this.scene.add(group);
        
        return group;
    }

    // Create a barn
    createBarn(x, y, z) {
        const group = new THREE.Group();

        // Main structure (larger than house)
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(40, 20, 35),
            this.materials.wall
        );
        wall.castShadow = true;
        wall.receiveShadow = true;
        group.add(wall);

        // Roof
        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(42, 2, 37),
            this.materials.roof
        );
        roof.position.y = 11;
        roof.castShadow = true;
        group.add(roof);

        // Peaked roof
        const peakRoof = new THREE.Mesh(
            new THREE.ConeGeometry(25, 8, 4),
            this.materials.roof
        );
        peakRoof.position.y = 15;
        peakRoof.rotation.y = Math.PI / 4;
        peakRoof.castShadow = true;
        group.add(peakRoof);

        // Large doors
        const door = new THREE.Mesh(
            new THREE.BoxGeometry(15, 15, 0.5),
            this.materials.wood
        );
        door.position.set(0, -2.5, 17.5);
        door.castShadow = true;
        group.add(door);

        group.position.set(x, y, z);
        group.userData.buildingType = 'barn';
        this.scene.add(group);
        
        return group;
    }

    // Create a windmill
    createWindmill(x, y, z) {
        const group = new THREE.Group();

        // Tower
        const tower = new THREE.Mesh(
            new THREE.CylinderGeometry(4, 6, 30, 8),
            this.materials.stone
        );
        tower.castShadow = true;
        tower.receiveShadow = true;
        group.add(tower);

        // Top cap
        const cap = new THREE.Mesh(
            new THREE.ConeGeometry(5, 5, 8),
            this.materials.roof
        );
        cap.position.y = 17.5;
        cap.castShadow = true;
        group.add(cap);

        // Blades (will rotate in animation)
        const bladesGroup = new THREE.Group();
        for (let i = 0; i < 4; i++) {
            const blade = new THREE.Mesh(
                new THREE.BoxGeometry(1, 12, 0.5),
                this.materials.wood
            );
            blade.position.y = 6;
            blade.rotation.z = (i * Math.PI / 2);
            bladesGroup.add(blade);
        }
        bladesGroup.position.set(0, 15, 6);
        group.add(bladesGroup);

        // Store blades for animation
        group.userData.blades = bladesGroup;
        group.userData.buildingType = 'windmill';

        group.position.set(x, y, z);
        this.scene.add(group);
        
        return group;
    }

    // Create a well
    createWell(x, y, z) {
        const group = new THREE.Group();

        // Well base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(4, 4, 5, 12),
            this.materials.stone
        );
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Well roof supports
        const support1 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 8),
            this.materials.wood
        );
        support1.position.set(3, 6.5, 0);
        group.add(support1);

        const support2 = support1.clone();
        support2.position.set(-3, 6.5, 0);
        group.add(support2);

        // Well roof
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(5, 4, 4),
            this.materials.roof
        );
        roof.position.y = 12;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        // Bucket rope (decorative)
        const rope = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 6),
            new THREE.MeshBasicMaterial({ color: 0x654321 })
        );
        rope.position.set(0, 7, 0);
        group.add(rope);

        group.position.set(x, y, z);
        group.userData.buildingType = 'well';
        this.scene.add(group);
        
        return group;
    }

    // Create a silo
    createSilo(x, y, z) {
        const group = new THREE.Group();

        // Main cylinder
        const silo = new THREE.Mesh(
            new THREE.CylinderGeometry(5, 5, 35, 16),
            this.materials.metal
        );
        silo.castShadow = true;
        silo.receiveShadow = true;
        group.add(silo);

        // Dome top
        const dome = new THREE.Mesh(
            new THREE.SphereGeometry(5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
            this.materials.metal
        );
        dome.position.y = 17.5;
        dome.castShadow = true;
        group.add(dome);

        // Horizontal bands (decorative)
        for (let i = 0; i < 5; i++) {
            const band = new THREE.Mesh(
                new THREE.CylinderGeometry(5.2, 5.2, 0.5, 16),
                new THREE.MeshStandardMaterial({ 
                    color: 0x666666,
                    metalness: 0.9,
                    roughness: 0.1
                })
            );
            band.position.y = -15 + (i * 7);
            group.add(band);
        }

        group.position.set(x, y, z);
        group.userData.buildingType = 'silo';
        this.scene.add(group);
        
        return group;
    }

    // Create a greenhouse
    createGreenhouse(x, y, z) {
        const group = new THREE.Group();

        // Frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(25, 12, 20),
            this.materials.wood
        );
        frame.castShadow = true;
        group.add(frame);

        // Glass panels
        const glass = new THREE.Mesh(
            new THREE.BoxGeometry(24, 11, 19),
            this.materials.glass
        );
        group.add(glass);

        // Roof
        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(26, 1, 21),
            this.materials.glass
        );
        roof.position.y = 6.5;
        roof.rotation.x = Math.PI / 12;
        group.add(roof);

        group.position.set(x, y, z);
        group.userData.buildingType = 'greenhouse';
        this.scene.add(group);
        
        return group;
    }

    // Create fence section
    createFence(x, y, z, length = 10) {
        const group = new THREE.Group();

        // Posts
        for (let i = 0; i <= length / 5; i++) {
            const post = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.3, 4),
                this.materials.wood
            );
            post.position.set(i * 5, 2, 0);
            post.castShadow = true;
            group.add(post);
        }

        // Horizontal rails
        for (let i = 0; i < 3; i++) {
            const rail = new THREE.Mesh(
                new THREE.BoxGeometry(length, 0.2, 0.2),
                this.materials.wood
            );
            rail.position.set(length / 2, 1 + i, 0);
            rail.castShadow = true;
            group.add(rail);
        }

        group.position.set(x, y, z);
        group.userData.buildingType = 'fence';
        this.scene.add(group);
        
        return group;
    }

    // Create a shed
    createShed(x, y, z) {
        const group = new THREE.Group();

        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(15, 10, 12),
            this.materials.wood
        );
        wall.castShadow = true;
        wall.receiveShadow = true;
        group.add(wall);

        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(16, 1, 13),
            this.materials.roof
        );
        roof.position.y = 5.5;
        roof.rotation.x = Math.PI / 12;
        roof.castShadow = true;
        group.add(roof);

        const door = new THREE.Mesh(
            new THREE.BoxGeometry(4, 6, 0.5),
            new THREE.MeshLambertMaterial({ color: 0x654321 })
        );
        door.position.set(0, -2, 6);
        door.castShadow = true;
        group.add(door);

        group.position.set(x, y, z);
        group.userData.buildingType = 'shed';
        this.scene.add(group);
        
        return group;
    }

    // Update buildings (animate windmills, etc.)
    update(delta) {
        this.buildings.forEach(building => {
            if (building.type === BuildingTypes.WINDMILL && building.mesh.userData.blades) {
                building.mesh.userData.blades.rotation.z += delta * 0.5;
            }
        });
    }

    // Remove building
    removeBuilding(building) {
        const index = this.buildings.indexOf(building);
        if (index > -1) {
            this.scene.remove(building.mesh);
            this.buildings.splice(index, 1);
        }
    }

    // Get all buildings
    getBuildings() {
        return this.buildings;
    }

    // Clear all buildings
    clear() {
        this.buildings.forEach(building => {
            this.scene.remove(building.mesh);
        });
        this.buildings = [];
    }
}

console.log('🏠 Building system loaded (with config support!)');
