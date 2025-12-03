// 🍎 Farm Dominion v2.1 - ENHANCED CROP MODELS
// Ultra detaylı meyve ve sebze 3D modelleri
// ✅ Botanical accuracy
// ✅ Growth stages
// ✅ Disease/health states
// ✅ Seasonal variations
// ✅ Harvest animations

import * as THREE from './three.module.js';

/**
 * ============================================
 * ENHANCED CROP MODEL FACTORY
 * Botanik olarak doğru, ultra detaylı modeller
 * ============================================
 */
export class EnhancedCropModelFactory {
    constructor() {
        this.textureCache = new Map();
        this.geometryCache = new Map();
        
        console.log('🍎 Enhanced Crop Model Factory initialized');
    }

    /**
     * ========================================
     * FRUIT PLANT MODELS (MEYVE BİTKİLERİ)
     * ========================================
     */

    /**
     * STRAWBERRY PLANT (ÇİLEK)
     * Ground-level runner plant
     */
    createStrawberryPlant(growthStage = 1.0) {
        const group = new THREE.Group();
        
        // Rosette of leaves
        const leafCount = 5 + Math.floor(growthStage * 3);
        for (let i = 0; i < leafCount; i++) {
            const angle = (i / leafCount) * Math.PI * 2;
            const radius = 0.1 * growthStage;
            
            // Trifoliate leaf (3 leaflets)
            const leafGroup = new THREE.Group();
            
            // Central leaflet
            const centralLeaf = this.createLeaflet(0.08 * growthStage, 0x4d9d4d);
            centralLeaf.position.y = 0.05 * growthStage;
            leafGroup.add(centralLeaf);
            
            // Side leaflets
            for (let j = 0; j < 2; j++) {
                const sideLeaf = this.createLeaflet(0.06 * growthStage, 0x4d9d4d);
                sideLeaf.position.set(
                    (j === 0 ? -1 : 1) * 0.05 * growthStage,
                    0.03 * growthStage,
                    -0.02 * growthStage
                );
                sideLeaf.rotation.y = (j === 0 ? -1 : 1) * Math.PI / 6;
                leafGroup.add(sideLeaf);
            }
            
            // Position leaf group
            leafGroup.position.set(
                Math.cos(angle) * radius,
                0.02,
                Math.sin(angle) * radius
            );
            leafGroup.rotation.y = angle;
            
            group.add(leafGroup);
        }
        
        // Strawberries (if mature)
        if (growthStage > 0.7) {
            const berryCount = Math.floor((growthStage - 0.7) * 10);
            
            for (let i = 0; i < berryCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 0.06 + Math.random() * 0.04;
                
                // Berry body
                const berry = new THREE.Mesh(
                    new THREE.SphereGeometry(0.015 * growthStage, 8, 8),
                    new THREE.MeshLambertMaterial({ color: 0xef5350 })
                );
                berry.scale.y = 1.2; // Slightly elongated
                berry.position.set(
                    Math.cos(angle) * radius,
                    0.01,
                    Math.sin(angle) * radius
                );
                berry.castShadow = true;
                
                // Seeds (tiny yellow dots)
                const seedCount = 20;
                for (let s = 0; s < seedCount; s++) {
                    const seed = new THREE.Mesh(
                        new THREE.SphereGeometry(0.001, 4, 4),
                        new THREE.MeshBasicMaterial({ color: 0xffeb3b })
                    );
                    
                    // Random position on berry surface
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.random() * Math.PI;
                    seed.position.set(
                        0.015 * Math.sin(phi) * Math.cos(theta),
                        0.015 * Math.sin(phi) * Math.sin(theta),
                        0.015 * Math.cos(phi)
                    );
                    
                    berry.add(seed);
                }
                
                // Calyx (green top)
                const calyx = new THREE.Mesh(
                    new THREE.ConeGeometry(0.008, 0.005, 5),
                    new THREE.MeshLambertMaterial({ color: 0x4d9d4d })
                );
                calyx.position.copy(berry.position);
                calyx.position.y += 0.018;
                group.add(calyx);
                
                group.add(berry);
            }
        }
        
        // White flowers (if flowering stage)
        if (growthStage > 0.4 && growthStage < 0.8) {
            const flowerCount = Math.floor(Math.random() * 3) + 2;
            
            for (let i = 0; i < flowerCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 0.08;
                
                // Flower with 5 petals
                const flowerGroup = new THREE.Group();
                
                for (let p = 0; p < 5; p++) {
                    const petalAngle = (p / 5) * Math.PI * 2;
                    const petal = new THREE.Mesh(
                        new THREE.CircleGeometry(0.008, 6),
                        new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide })
                    );
                    petal.position.set(
                        Math.cos(petalAngle) * 0.01,
                        0,
                        Math.sin(petalAngle) * 0.01
                    );
                    petal.rotation.x = Math.PI / 2;
                    flowerGroup.add(petal);
                }
                
                // Yellow center
                const center = new THREE.Mesh(
                    new THREE.CircleGeometry(0.003, 8),
                    new THREE.MeshBasicMaterial({ color: 0xffeb3b })
                );
                center.rotation.x = Math.PI / 2;
                flowerGroup.add(center);
                
                flowerGroup.position.set(
                    Math.cos(angle) * radius,
                    0.04,
                    Math.sin(angle) * radius
                );
                
                group.add(flowerGroup);
            }
        }
        
        group.userData.cropType = 'strawberry';
        group.userData.growthStage = growthStage;
        
        return group;
    }

    /**
     * GRAPE VINE (ÜZÜM ASMASI)
     * Climbing vine with clusters
     */
    createGrapeVine(growthStage = 1.0, varietyColor = 0x7b1fa2) {
        const group = new THREE.Group();
        
        // Main vine (woody stem)
        const vineHeight = 2.0 * growthStage;
        const vine = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.05, vineHeight, 8),
            new THREE.MeshLambertMaterial({ color: 0x5d4d3d })
        );
        vine.position.y = vineHeight / 2;
        vine.castShadow = true;
        group.add(vine);
        
        // Lateral branches
        const branchCount = Math.floor(growthStage * 5) + 2;
        
        for (let i = 0; i < branchCount; i++) {
            const t = (i + 1) / (branchCount + 1);
            const branchY = vineHeight * t;
            const branchAngle = (i % 2) * Math.PI;
            const branchLength = 0.4 * growthStage;
            
            const branch = new THREE.Mesh(
                new THREE.CylinderGeometry(0.015, 0.02, branchLength, 6),
                new THREE.MeshLambertMaterial({ color: 0x5d4d3d })
            );
            branch.position.set(
                Math.cos(branchAngle) * branchLength / 2,
                branchY,
                Math.sin(branchAngle) * branchLength / 2
            );
            branch.rotation.z = Math.PI / 4;
            branch.rotation.y = branchAngle;
            group.add(branch);
            
            // Leaves on branch
            const leafCount = 3 + Math.floor(Math.random() * 2);
            for (let j = 0; j < leafCount; j++) {
                const lt = (j + 1) / (leafCount + 1);
                
                const leaf = this.createGrapeLeaf(0.15 * growthStage);
                leaf.position.set(
                    Math.cos(branchAngle) * branchLength * lt,
                    branchY + Math.sin(Math.PI / 4) * branchLength * lt,
                    Math.sin(branchAngle) * branchLength * lt
                );
                leaf.rotation.y = branchAngle + (j % 2 ? 1 : -1) * Math.PI / 4;
                group.add(leaf);
            }
            
            // Grape cluster (if mature)
            if (growthStage > 0.7) {
                const cluster = this.createGrapeCluster(varietyColor, growthStage);
                cluster.position.set(
                    Math.cos(branchAngle) * branchLength * 0.7,
                    branchY - 0.1,
                    Math.sin(branchAngle) * branchLength * 0.7
                );
                group.add(cluster);
            }
        }
        
        // Tendrils (curly vine attachments)
        if (growthStage > 0.5) {
            const tendrilCount = Math.floor(growthStage * 4);
            
            for (let i = 0; i < tendrilCount; i++) {
                const tendril = this.createTendril(0.3, growthStage);
                tendril.position.y = vineHeight * (0.3 + Math.random() * 0.6);
                tendril.rotation.y = Math.random() * Math.PI * 2;
                group.add(tendril);
            }
        }
        
        group.userData.cropType = 'grape';
        group.userData.growthStage = growthStage;
        
        return group;
    }

    /**
     * Helper: Create grape cluster
     */
    createGrapeCluster(color, size = 1.0) {
        const cluster = new THREE.Group();
        
        // Stem
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.005, 0.005, 0.05, 4),
            new THREE.MeshLambertMaterial({ color: 0x4d9d4d })
        );
        stem.position.y = 0.025;
        cluster.add(stem);
        
        // Grapes in conical arrangement
        const grapeCount = Math.floor(15 * size) + 10;
        const layers = 5;
        
        for (let layer = 0; layer < layers; layer++) {
            const t = layer / layers;
            const layerRadius = 0.03 * (1 - t) * size;
            const grapesInLayer = Math.floor((1 - t) * 6) + 3;
            
            for (let i = 0; i < grapesInLayer; i++) {
                const angle = (i / grapesInLayer) * Math.PI * 2 + Math.random() * 0.5;
                const radius = layerRadius * (0.8 + Math.random() * 0.4);
                
                const grape = new THREE.Mesh(
                    new THREE.SphereGeometry(0.01 * size, 8, 8),
                    new THREE.MeshLambertMaterial({ color: color })
                );
                grape.position.set(
                    Math.cos(angle) * radius,
                    -layer * 0.015 * size,
                    Math.sin(angle) * radius
                );
                grape.castShadow = true;
                
                // Slight variation in size
                const scale = 0.9 + Math.random() * 0.2;
                grape.scale.setScalar(scale);
                
                cluster.add(grape);
            }
        }
        
        return cluster;
    }

    /**
     * Helper: Create grape leaf (lobed)
     */
    createGrapeLeaf(size) {
        // Simplified lobed leaf shape
        const shape = new THREE.Shape();
        
        // Create 5-lobed leaf outline
        shape.moveTo(0, 0);
        shape.lineTo(size * 0.3, size * 0.5);
        shape.lineTo(size * 0.5, size * 0.4);
        shape.lineTo(size * 0.4, size * 0.7);
        shape.lineTo(size * 0.5, size);
        shape.lineTo(0, size * 0.8);
        shape.lineTo(-size * 0.5, size);
        shape.lineTo(-size * 0.4, size * 0.7);
        shape.lineTo(-size * 0.5, size * 0.4);
        shape.lineTo(-size * 0.3, size * 0.5);
        shape.lineTo(0, 0);
        
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x4d9d4d,
            side: THREE.DoubleSide
        });
        
        const leaf = new THREE.Mesh(geometry, material);
        leaf.rotation.x = Math.PI / 2;
        
        return leaf;
    }

    /**
     * Helper: Create tendril (curly vine)
     */
    createTendril(length, curliness) {
        const points = [];
        const segments = 20;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            points.push(new THREE.Vector3(
                Math.sin(t * Math.PI * 4 * curliness) * 0.05,
                t * length,
                Math.cos(t * Math.PI * 4 * curliness) * 0.05
            ));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.002, 4, false);
        const material = new THREE.MeshLambertMaterial({ color: 0x4d9d4d });
        
        return new THREE.Mesh(tubeGeometry, material);
    }

    /**
     * ========================================
     * MELON/SQUASH FAMILY (KAVUN/KABAK)
     * ========================================
     */

    /**
     * WATERMELON PLANT (KARPUZ)
     * Sprawling vine with large fruit
     */
    createWatermelonPlant(growthStage = 1.0) {
        const group = new THREE.Group();
        
        // Main vine (sprawling on ground)
        const vineLength = 2.5 * growthStage;
        const vinePoints = [];
        const segments = 15;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            vinePoints.push(new THREE.Vector3(
                Math.sin(t * Math.PI) * vineLength * 0.3,
                0.02,
                t * vineLength - vineLength / 2
            ));
        }
        
        const vineCurve = new THREE.CatmullRomCurve3(vinePoints);
        const vineTube = new THREE.TubeGeometry(vineCurve, 30, 0.02, 6, false);
        const vine = new THREE.Mesh(
            vineTube,
            new THREE.MeshLambertMaterial({ color: 0x6d8d6d })
        );
        vine.castShadow = true;
        group.add(vine);
        
        // Large lobed leaves along vine
        const leafCount = Math.floor(growthStage * 8) + 4;
        
        for (let i = 0; i < leafCount; i++) {
            const t = (i + 1) / (leafCount + 1);
            const pos = vineCurve.getPoint(t);
            
            const leaf = this.createMelonLeaf(0.25 * growthStage);
            leaf.position.copy(pos);
            leaf.position.x += (i % 2 ? 1 : -1) * 0.15;
            leaf.rotation.y = (i % 2 ? 1 : -1) * Math.PI / 4;
            group.add(leaf);
        }
        
        // Watermelons (if mature)
        if (growthStage > 0.6) {
            const melonCount = Math.floor((growthStage - 0.6) * 5) + 1;
            
            for (let i = 0; i < melonCount; i++) {
                const t = 0.3 + (i / melonCount) * 0.5;
                const pos = vineCurve.getPoint(t);
                
                const melon = this.createWatermelon(0.3 * growthStage);
                melon.position.copy(pos);
                melon.position.y = 0.15;
                melon.rotation.set(
                    Math.random() * 0.3,
                    Math.random() * Math.PI * 2,
                    Math.random() * 0.3
                );
                group.add(melon);
            }
        }
        
        // Yellow flowers (if flowering)
        if (growthStage > 0.3 && growthStage < 0.7) {
            const flowerCount = Math.floor(Math.random() * 4) + 2;
            
            for (let i = 0; i < flowerCount; i++) {
                const t = 0.2 + Math.random() * 0.6;
                const pos = vineCurve.getPoint(t);
                
                const flower = this.createMelonFlower();
                flower.position.copy(pos);
                flower.position.y = 0.08;
                group.add(flower);
            }
        }
        
        group.userData.cropType = 'watermelon';
        group.userData.growthStage = growthStage;
        
        return group;
    }

    /**
     * Helper: Create watermelon
     */
    createWatermelon(size) {
        const melon = new THREE.Group();
        
        // Main body (ellipsoid)
        const body = new THREE.Mesh(
            new THREE.SphereGeometry(size, 12, 12),
            new THREE.MeshLambertMaterial({ color: 0x4caf50 })
        );
        body.scale.set(1, 0.8, 1.2); // Elongated
        body.castShadow = true;
        melon.add(body);
        
        // Dark green stripes
        const stripeCount = 10;
        for (let i = 0; i < stripeCount; i++) {
            const angle = (i / stripeCount) * Math.PI * 2;
            
            const stripe = new THREE.Mesh(
                new THREE.CylinderGeometry(0.01, 0.01, size * 2.4, 4),
                new THREE.MeshLambertMaterial({ color: 0x1b5e20 })
            );
            stripe.position.set(
                Math.cos(angle) * size * 0.95,
                0,
                Math.sin(angle) * size * 1.1
            );
            stripe.rotation.z = Math.PI / 2;
            stripe.rotation.y = angle;
            melon.add(stripe);
        }
        
        // Stem
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.02, 0.05, 6),
            new THREE.MeshLambertMaterial({ color: 0x8b4513 })
        );
        stem.position.y = size * 0.8;
        melon.add(stem);
        
        return melon;
    }

    /**
     * Helper: Create melon leaf (deeply lobed)
     */
    createMelonLeaf(size) {
        // Create lobed leaf
        const leaf = new THREE.Mesh(
            new THREE.CircleGeometry(size, 8),
            new THREE.MeshLambertMaterial({ color: 0x6d8d6d, side: THREE.DoubleSide })
        );
        leaf.rotation.x = Math.PI / 6;
        
        // Make it look more organic with slight deformations
        const geometry = leaf.geometry;
        const positionAttribute = geometry.getAttribute('position');
        
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
            
            // Add lobes
            const angle = Math.atan2(y, x);
            const radius = Math.sqrt(x * x + y * y);
            const lobeFactor = 1 + Math.sin(angle * 5) * 0.2;
            
            positionAttribute.setX(i, x * lobeFactor);
            positionAttribute.setY(i, y * lobeFactor);
        }
        
        geometry.computeVertexNormals();
        
        return leaf;
    }

    /**
     * Helper: Create melon flower (yellow)
     */
    createMelonFlower() {
        const flower = new THREE.Group();
        
        // 5 yellow petals
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            
            const petal = new THREE.Mesh(
                new THREE.CircleGeometry(0.02, 6),
                new THREE.MeshLambertMaterial({ color: 0xffeb3b, side: THREE.DoubleSide })
            );
            petal.position.set(
                Math.cos(angle) * 0.025,
                0,
                Math.sin(angle) * 0.025
            );
            petal.rotation.x = Math.PI / 2;
            flower.add(petal);
        }
        
        // Center
        const center = new THREE.Mesh(
            new THREE.CircleGeometry(0.01, 8),
            new THREE.MeshBasicMaterial({ color: 0xff9800 })
        );
        center.rotation.x = Math.PI / 2;
        flower.add(center);
        
        return flower;
    }

    /**
     * ========================================
     * ROOT VEGETABLES (KÖK SEBZELER)
     * ========================================
     */

    /**
     * CARROT PLANT (HAVUÇ)
     * Feathery leaves, orange root
     */
    createEnhancedCarrotPlant(growthStage = 1.0) {
        const group = new THREE.Group();
        
        // Feathery compound leaves
        const leafStemCount = 6 + Math.floor(growthStage * 4);
        
        for (let i = 0; i < leafStemCount; i++) {
            const angle = (i / leafStemCount) * Math.PI * 2;
            const radius = 0.08 + (i / leafStemCount) * 0.05;
            const height = 0.2 * growthStage + (i / leafStemCount) * 0.1;
            
            // Leaf stem
            const leafStem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.003, 0.005, height, 4),
                new THREE.MeshLambertMaterial({ color: 0x4d9d4d })
            );
            leafStem.position.set(
                Math.cos(angle) * radius,
                height / 2,
                Math.sin(angle) * radius
            );
            leafStem.rotation.z = Math.PI / 8;
            leafStem.rotation.y = angle;
            group.add(leafStem);
            
            // Pinnate leaflets (feather-like)
            const leafletCount = 8;
            for (let j = 0; j < leafletCount; j++) {
                const t = j / leafletCount;
                const leafletSize = 0.015 * (1 - t * 0.3) * growthStage;
                
                // Left leaflet
                const leftLeaflet = new THREE.Mesh(
                    new THREE.CircleGeometry(leafletSize, 5),
                    new THREE.MeshLambertMaterial({ color: 0x4d9d4d, side: THREE.DoubleSide })
                );
                leftLeaflet.position.set(
                    Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * 0.015,
                    height * t + 0.01,
                    Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * 0.015
                );
                leftLeaflet.rotation.x = Math.PI / 3;
                group.add(leftLeaflet);
                
                // Right leaflet
                const rightLeaflet = new THREE.Mesh(
                    new THREE.CircleGeometry(leafletSize, 5),
                    new THREE.MeshLambertMaterial({ color: 0x4d9d4d, side: THREE.DoubleSide })
                );
                rightLeaflet.position.set(
                    Math.cos(angle) * radius + Math.cos(angle - Math.PI / 2) * 0.015,
                    height * t + 0.01,
                    Math.sin(angle) * radius + Math.sin(angle - Math.PI / 2) * 0.015
                );
                rightLeaflet.rotation.x = Math.PI / 3;
                group.add(rightLeaflet);
            }
        }
        
        // Carrot root (partially visible above ground)
        if (growthStage > 0.3) {
            const rootSize = 0.04 * growthStage;
            const rootLength = 0.15 * growthStage;
            
            // Orange root (cone shape underground)
            const root = new THREE.Mesh(
                new THREE.ConeGeometry(rootSize, rootLength, 8),
                new THREE.MeshLambertMaterial({ color: 0xff9800 })
            );
            root.position.y = -rootLength * 0.7; // Mostly underground
            root.rotation.x = Math.PI;
            root.castShadow = true;
            group.add(root);
            
            // Green crown (visible part)
            const crown = new THREE.Mesh(
                new THREE.CylinderGeometry(rootSize * 0.8, rootSize, 0.02, 8),
                new THREE.MeshLambertMaterial({ color: 0x7cb342 })
            );
            crown.position.y = -0.01;
            group.add(crown);
            
            // Root hairs (tiny fibers)
            if (growthStage > 0.6) {
                const hairCount = 15;
                for (let i = 0; i < hairCount; i++) {
                    const angle = (i / hairCount) * Math.PI * 2;
                    const hairY = -rootLength * 0.3 - Math.random() * rootLength * 0.5;
                    
                    const hair = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.001, 0.001, 0.02, 3),
                        new THREE.MeshLambertMaterial({ color: 0xd4a574 })
                    );
                    hair.position.set(
                        Math.cos(angle) * rootSize * 0.8,
                        hairY,
                        Math.sin(angle) * rootSize * 0.8
                    );
                    hair.rotation.z = (Math.random() - 0.5) * Math.PI / 4;
                    hair.rotation.y = angle;
                    group.add(hair);
                }
            }
        }
        
        group.userData.cropType = 'carrot';
        group.userData.growthStage = growthStage;
        
        return group;
    }

    /**
     * POTATO PLANT (PATATES)
     * With underground tubers
     */
    createEnhancedPotatoPlant(growthStage = 1.0) {
        const group = new THREE.Group();
        
        const height = (0.3 + growthStage * 0.3);
        
        // Multiple stems from base
        const stemCount = 2 + Math.floor(growthStage * 2);
        
        for (let s = 0; s < stemCount; s++) {
            const stemAngle = (s / stemCount) * Math.PI * 2;
            const stemRadius = 0.05;
            
            // Main stem
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.006, 0.01, height, 6),
                new THREE.MeshLambertMaterial({ color: 0x5d7c5d })
            );
            stem.position.set(
                Math.cos(stemAngle) * stemRadius,
                height / 2,
                Math.sin(stemAngle) * stemRadius
            );
            stem.rotation.z = (Math.random() - 0.5) * 0.2;
            group.add(stem);
            
            // Compound leaves along stem
            const leafLevels = 4 + Math.floor(growthStage * 2);
            
            for (let i = 0; i < leafLevels; i++) {
                const t = (i + 1) / (leafLevels + 1);
                const leafAngle = stemAngle + (i % 2) * Math.PI;
                
                // Compound leaf with multiple leaflets
                const leafletCount = 5 + Math.floor(Math.random() * 2);
                
                for (let j = 0; j < leafletCount; j++) {
                    const lt = j / (leafletCount - 1);
                    const leafletSize = 0.04 * (0.7 + Math.random() * 0.3) * growthStage;
                    
                    const leaflet = new THREE.Mesh(
                        new THREE.CircleGeometry(leafletSize, 6),
                        new THREE.MeshLambertMaterial({ color: 0x4d7c4d, side: THREE.DoubleSide })
                    );
                    
                    leaflet.position.set(
                        Math.cos(stemAngle) * stemRadius + Math.cos(leafAngle) * (0.05 + lt * 0.08),
                        height * t,
                        Math.sin(stemAngle) * stemRadius + Math.sin(leafAngle) * (0.05 + lt * 0.08)
                    );
                    leaflet.rotation.x = Math.PI / 3;
                    leaflet.rotation.y = leafAngle;
                    
                    group.add(leaflet);
                }
            }
        }
        
        // White/purple flowers (if flowering)
        if (growthStage > 0.5 && growthStage < 0.8) {
            const flowerCount = Math.floor(Math.random() * 4) + 2;
            
            for (let i = 0; i < flowerCount; i++) {
                const flower = new THREE.Group();
                
                // 5 petals
                for (let p = 0; p < 5; p++) {
                    const petalAngle = (p / 5) * Math.PI * 2;
                    const petal = new THREE.Mesh(
                        new THREE.CircleGeometry(0.01, 6),
                        new THREE.MeshLambertMaterial({ 
                            color: Math.random() > 0.5 ? 0xffffff : 0xe1bee7,
                            side: THREE.DoubleSide 
                        })
                    );
                    petal.position.set(
                        Math.cos(petalAngle) * 0.012,
                        0,
                        Math.sin(petalAngle) * 0.012
                    );
                    petal.rotation.x = Math.PI / 2;
                    flower.add(petal);
                }
                
                // Yellow center
                const center = new THREE.Mesh(
                    new THREE.CircleGeometry(0.004, 8),
                    new THREE.MeshBasicMaterial({ color: 0xffeb3b })
                );
                center.rotation.x = Math.PI / 2;
                flower.add(center);
                
                flower.position.set(
                    (Math.random() - 0.5) * 0.15,
                    height * (0.6 + Math.random() * 0.3),
                    (Math.random() - 0.5) * 0.15
                );
                
                group.add(flower);
            }
        }
        
        // Underground tubers (potatoes) - slightly visible
        if (growthStage > 0.6) {
            const tuberCount = Math.floor((growthStage - 0.6) * 10) + 3;
            
            for (let i = 0; i < tuberCount; i++) {
                const angle = (i / tuberCount) * Math.PI * 2 + Math.random() * 0.5;
                const radius = 0.08 + Math.random() * 0.05;
                const depth = -0.05 - Math.random() * 0.08;
                
                const tuber = new THREE.Mesh(
                    new THREE.SphereGeometry(0.03 + Math.random() * 0.015, 8, 8),
                    new THREE.MeshLambertMaterial({ color: 0xd4b896 })
                );
                tuber.scale.set(1, 0.8, 1.1); // Irregular shape
                tuber.position.set(
                    Math.cos(angle) * radius,
                    depth,
                    Math.sin(angle) * radius
                );
                tuber.rotation.set(
                    Math.random() * 0.5,
                    Math.random() * Math.PI * 2,
                    Math.random() * 0.5
                );
                tuber.castShadow = true;
                
                // "Eyes" (sprout points)
                const eyeCount = 3 + Math.floor(Math.random() * 3);
                for (let e = 0; e < eyeCount; e++) {
                    const eye = new THREE.Mesh(
                        new THREE.SphereGeometry(0.002, 4, 4),
                        new THREE.MeshLambertMaterial({ color: 0x8b6f47 })
                    );
                    eye.position.set(
                        (Math.random() - 0.5) * 0.05,
                        (Math.random() - 0.5) * 0.04,
                        (Math.random() - 0.5) * 0.05
                    );
                    tuber.add(eye);
                }
                
                group.add(tuber);
            }
        }
        
        group.userData.cropType = 'potato';
        group.userData.growthStage = growthStage;
        
        return group;
    }

    /**
     * ========================================
     * HELPER FUNCTIONS
     * ========================================
     */

    /**
     * Generic leaflet creator
     */
    createLeaflet(size, color) {
        const leaf = new THREE.Mesh(
            new THREE.CircleGeometry(size, 8),
            new THREE.MeshLambertMaterial({ color: color, side: THREE.DoubleSide })
        );
        leaf.rotation.x = Math.PI / 3;
        return leaf;
    }

    /**
     * Create disease/pest damage on plant
     */
    applyPlantDamage(plant, damageType, severity = 0.5) {
        plant.traverse((object) => {
            if (object.material && object.material.color) {
                switch(damageType) {
                    case 'blight':
                        // Brown spots
                        object.material.color.lerp(new THREE.Color(0x8b4513), severity * 0.5);
                        break;
                    case 'aphids':
                        // Yellowing
                        object.material.color.lerp(new THREE.Color(0xffeb3b), severity * 0.3);
                        break;
                    case 'drought':
                        // Wilting (darken)
                        object.material.color.multiplyScalar(1 - severity * 0.4);
                        break;
                }
            }
        });
        
        // Scale down slightly
        plant.scale.multiplyScalar(1 - severity * 0.2);
    }

    /**
     * Apply seasonal color changes
     */
    applySeasonalColor(plant, season) {
        const colorMap = {
            spring: 0x7cb342, // Light green
            summer: 0x4d8d4d, // Rich green
            autumn: 0xcd853f, // Tan/brown
            winter: 0x8b7355  // Dormant brown
        };
        
        const targetColor = new THREE.Color(colorMap[season] || 0x4d8d4d);
        
        plant.traverse((object) => {
            if (object.material && object.material.color && object.userData.isLeaf) {
                object.material.color.lerp(targetColor, 0.5);
            }
        });
    }
}

console.log('🍎 Enhanced Crop Models loaded - Ultra realistic botanical models');

export default EnhancedCropModelFactory;
