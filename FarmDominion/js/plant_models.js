// 🌳 Farm Dominion v2.1 - Realistic Plant Models
import * as THREE from './three.module.js';
import { PlantDatabase } from './biome_system.js';

export class PlantModelFactory {
    constructor() {
        this.materials = this.createMaterials();
        this.geometries = this.createGeometries();
    }

    createMaterials() {
        return {
            // Tree materials
            darkGreen: new THREE.MeshLambertMaterial({ color: 0x1a4d1a }),
            green: new THREE.MeshLambertMaterial({ color: 0x2d6b2d }),
            lightGreen: new THREE.MeshLambertMaterial({ color: 0x4d9d4d }),
            oliveGreen: new THREE.MeshLambertMaterial({ color: 0x808060 }),
            
            // Bark materials
            darkBark: new THREE.MeshLambertMaterial({ color: 0x3d2817 }),
            lightBark: new THREE.MeshLambertMaterial({ color: 0x5d4a3a }),
            
            // Fruit materials
            red: new THREE.MeshLambertMaterial({ color: 0xef5350 }),
            orange: new THREE.MeshLambertMaterial({ color: 0xff9800 }),
            yellow: new THREE.MeshLambertMaterial({ color: 0xffeb3b }),
            purple: new THREE.MeshLambertMaterial({ color: 0x7b1fa2 }),
            brown: new THREE.MeshLambertMaterial({ color: 0x8b6f47 })
        };
    }

    createGeometries() {
        return {
            // Tree crowns
            coneCrown: new THREE.ConeGeometry(1, 2, 8),
            sphereCrown: new THREE.SphereGeometry(1, 8, 8),
            cylinderCrown: new THREE.CylinderGeometry(0.8, 1.2, 2, 8),
            
            // Trunks
            trunk: new THREE.CylinderGeometry(0.2, 0.3, 1, 8),
            
            // Fruits
            fruitSphere: new THREE.SphereGeometry(0.1, 6, 6)
        };
    }

    // Create tree model based on plant data
    createTree(plantId, x, y, z) {
        const plant = PlantDatabase[plantId];
        if (!plant || plant.type !== 'tree') return null;

        const group = new THREE.Group();

        // Determine height
        const height = plant.height[0] + Math.random() * (plant.height[1] - plant.height[0]);
        const trunkHeight = height * 0.4;
        const crownHeight = height * 0.6;

        // Create trunk
        const trunk = this.createTrunk(trunkHeight);
        trunk.position.y = trunkHeight / 2;
        group.add(trunk);

        // Create crown based on tree type
        let crown;
        if (plant.coniferous) {
            crown = this.createConiferousCrown(crownHeight, plant.color);
        } else if (plant.deciduous) {
            crown = this.createDeciduousCrown(crownHeight, plant.color);
        } else if (plant.evergreen) {
            crown = this.createEvergreenCrown(crownHeight, plant.color);
        } else if (plant.droughtResistant) {
            crown = this.createAcaciaCrown(crownHeight, plant.color);
        } else {
            crown = this.createGenericCrown(crownHeight, plant.color);
        }

        crown.position.y = trunkHeight + crownHeight / 2;
        group.add(crown);

        // Add fruits if plant has them
        if (plant.fruit) {
            this.addFruits(group, plant.fruit, trunkHeight, crownHeight);
        }

        group.position.set(x, y, z);
        group.userData.plantId = plantId;
        group.userData.age = 0;
        group.userData.mature = plant.growthTime;

        // Shadow casting
        group.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return group;
    }

    // Create trunk
    createTrunk(height) {
        const radius = height * 0.08;
        const geometry = new THREE.CylinderGeometry(radius, radius * 1.3, height, 8);
        const trunk = new THREE.Mesh(geometry, this.materials.darkBark);
        return trunk;
    }

    // Coniferous crown (pine, spruce)
    createConiferousCrown(height, color) {
        const group = new THREE.Group();
        const layers = 4;
        
        for (let i = 0; i < layers; i++) {
            const radius = (layers - i) * 0.6;
            const layerHeight = height / layers;
            const geometry = new THREE.ConeGeometry(radius, layerHeight * 1.5, 8);
            const material = new THREE.MeshLambertMaterial({ color });
            const cone = new THREE.Mesh(geometry, material);
            cone.position.y = (i - layers / 2) * layerHeight;
            group.add(cone);
        }

        return group;
    }

    // Deciduous crown (oak, maple)
    createDeciduousCrown(height, color) {
        const radius = height * 0.8;
        const geometry = new THREE.SphereGeometry(radius, 8, 8);
        geometry.scale(1, 0.8, 1); // Flatten slightly
        const material = new THREE.MeshLambertMaterial({ color });
        return new THREE.Mesh(geometry, material);
    }

    // Evergreen crown (olive, citrus)
    createEvergreenCrown(height, color) {
        const radius = height * 0.7;
        const geometry = new THREE.SphereGeometry(radius, 8, 8);
        geometry.scale(1, 0.9, 1);
        const material = new THREE.MeshLambertMaterial({ color });
        return new THREE.Mesh(geometry, material);
    }

    // Acacia crown (flat-topped)
    createAcaciaCrown(height, color) {
        const radius = height * 1.2;
        const geometry = new THREE.CylinderGeometry(radius, radius * 0.3, height * 0.5, 8);
        const material = new THREE.MeshLambertMaterial({ color });
        const crown = new THREE.Mesh(geometry, material);
        crown.position.y = height * 0.25;
        return crown;
    }

    // Generic crown
    createGenericCrown(height, color) {
        const radius = height * 0.7;
        const geometry = new THREE.SphereGeometry(radius, 8, 8);
        const material = new THREE.MeshLambertMaterial({ color });
        return new THREE.Mesh(geometry, material);
    }

    // Add fruits to tree
    addFruits(treeGroup, fruitData, trunkHeight, crownHeight) {
        const fruitCount = 5 + Math.floor(Math.random() * 10);
        const fruitColor = fruitData.color;
        
        for (let i = 0; i < fruitCount; i++) {
            const angle = (Math.PI * 2 * i) / fruitCount;
            const radius = crownHeight * 0.5 * Math.random();
            const height = trunkHeight + crownHeight * (0.3 + Math.random() * 0.4);

            const fruitGeometry = new THREE.SphereGeometry(0.15, 4, 4);
            const fruitMaterial = new THREE.MeshLambertMaterial({ color: fruitColor });
            const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);

            fruit.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );

            treeGroup.add(fruit);
        }
    }

    // Create vegetable plant
    createVegetable(plantId, x, y, z) {
        const plant = PlantDatabase[plantId];
        if (!plant || plant.type !== 'vegetable') return null;

        const group = new THREE.Group();
        const height = plant.height[0] + Math.random() * (plant.height[1] - plant.height[0]);

        // Simple plant model
        const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, height, 6);
        const stemMaterial = new THREE.MeshLambertMaterial({ color: plant.color });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = height / 2;
        group.add(stem);

        // Add leaves
        const leafCount = 4;
        for (let i = 0; i < leafCount; i++) {
            const leafGeometry = new THREE.PlaneGeometry(0.2, 0.3);
            const leafMaterial = new THREE.MeshLambertMaterial({ 
                color: plant.color, 
                side: THREE.DoubleSide 
            });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            
            const angle = (Math.PI * 2 * i) / leafCount;
            leaf.position.set(
                Math.cos(angle) * 0.1,
                height * (0.5 + i * 0.1),
                Math.sin(angle) * 0.1
            );
            leaf.rotation.y = angle;
            
            group.add(leaf);
        }

        // Add fruit/vegetable
        if (plant.fruit) {
            const fruitGeometry = new THREE.SphereGeometry(0.1, 6, 6);
            const fruitMaterial = new THREE.MeshLambertMaterial({ color: plant.fruit.color });
            const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
            fruit.position.y = height * 0.8;
            group.add(fruit);
        }

        group.position.set(x, y, z);
        group.userData.plantId = plantId;
        group.userData.age = 0;
        group.userData.mature = plant.growthTime;

        return group;
    }

    // Create cactus (desert)
    createCactus(x, y, z) {
        const group = new THREE.Group();
        const height = 3 + Math.random() * 3;

        // Main body
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.35, height, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4d7c4d });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = height / 2;
        group.add(body);

        // Arms
        const armCount = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < armCount; i++) {
            const armHeight = height * (0.3 + Math.random() * 0.3);
            const armGeometry = new THREE.CylinderGeometry(0.2, 0.25, armHeight, 6);
            const arm = new THREE.Mesh(armGeometry, bodyMaterial);
            
            const side = i % 2 === 0 ? 1 : -1;
            arm.position.set(side * 0.4, height * 0.5, 0);
            arm.rotation.z = side * Math.PI / 6;
            
            group.add(arm);
        }

        group.position.set(x, y, z);
        return group;
    }

    // Create palm tree
    createPalm(x, y, z, height = 20) {
        const group = new THREE.Group();

        // Trunk (curved)
        const trunkSegments = 8;
        for (let i = 0; i < trunkSegments; i++) {
            const segmentHeight = height / trunkSegments;
            const radius = 0.3 - (i * 0.02);
            const geometry = new THREE.CylinderGeometry(radius, radius + 0.02, segmentHeight, 8);
            const segment = new THREE.Mesh(geometry, this.materials.lightBark);
            
            segment.position.y = i * segmentHeight + segmentHeight / 2;
            segment.position.x = Math.sin(i * 0.3) * 0.5;
            
            group.add(segment);
        }

        // Palm fronds
        const frondCount = 8;
        for (let i = 0; i < frondCount; i++) {
            const angle = (Math.PI * 2 * i) / frondCount;
            const frondGeometry = new THREE.BoxGeometry(0.2, 4, 0.1);
            const frondMaterial = new THREE.MeshLambertMaterial({ color: 0x4d9d4d });
            const frond = new THREE.Mesh(frondGeometry, frondMaterial);
            
            frond.position.set(
                Math.cos(angle) * 0.5,
                height + 2,
                Math.sin(angle) * 0.5
            );
            frond.rotation.z = angle;
            frond.rotation.x = Math.PI / 4;
            
            group.add(frond);
        }

        group.position.set(x, y, z);
        return group;
    }
}

console.log('🌳 Plant model factory loaded');
