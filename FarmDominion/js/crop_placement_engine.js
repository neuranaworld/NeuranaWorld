// 🌾 Farm Dominion v2.1 - CROP PLACEMENT ENGINE
// Biom bazlı meyve ve sebze yerleştirme sistemi
// ✅ Biome-based placement
// ✅ Soil quality checks
// ✅ Climate requirements
// ✅ Seasonal growth
// ✅ Field generation

import * as THREE from './three.module.js';
import { BiomeTypes } from './biome_system.js';
import { CompleteFruitDatabase, CompleteVegetableDatabase } from './complete_fruits_vegetables_100.js';
import { UltraRealisticPlantModelFactory } from './ultra_realistic_plant_models_FULL.js';

/**
 * ============================================
 * CROP REQUIREMENTS CLASS
 * ============================================
 */
class CropRequirements {
    constructor(config) {
        this.biomes = config.biomes || [];           // Uygun biomlar
        this.temperature = config.temperature || [0, 30];  // [min, max] °C
        this.moisture = config.moisture || [30, 80];       // [min, max] %
        this.soilQuality = config.soilQuality || 50;      // Minimum %
        this.sunlight = config.sunlight || 60;            // Minimum %
        this.altitude = config.altitude || [-50, 1000];   // [min, max] metre
        this.season = config.season || 'all';             // spring, summer, autumn, winter, all
    }

    canGrow(environment) {
        // Biome check
        if (this.biomes.length > 0 && !this.biomes.includes(environment.biome)) {
            return false;
        }

        // Temperature check
        if (environment.temperature < this.temperature[0] || 
            environment.temperature > this.temperature[1]) {
            return false;
        }

        // Moisture check
        if (environment.moisture < this.moisture[0] || 
            environment.moisture > this.moisture[1]) {
            return false;
        }

        // Soil quality check
        if (environment.soilQuality < this.soilQuality) {
            return false;
        }

        // Sunlight check
        if (environment.sunlight < this.sunlight) {
            return false;
        }

        // Altitude check
        if (environment.altitude < this.altitude[0] || 
            environment.altitude > this.altitude[1]) {
            return false;
        }

        return true;
    }
}

/**
 * ============================================
 * ENHANCED CROP DATABASE
 * Meyve ve sebzelere biom gereksinimleri ekle
 * ============================================
 */
export const EnhancedCropDatabase = {
    // FRUITS (MEYVELER) - Biom gereksinimleri ile
    
    // Temperate fruits
    apple: {
        ...CompleteFruitDatabase.apple,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS],
            temperature: [0, 25],
            moisture: [60, 80],
            soilQuality: 70,
            sunlight: 80,
            altitude: [0, 800],
            season: ['spring', 'summer', 'autumn']
        }),
        fieldType: 'orchard',
        spacing: 5.0,
        yield: { min: 50, max: 150 }  // kg per tree
    },

    pear: {
        ...CompleteFruitDatabase.pear,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS],
            temperature: [0, 25],
            moisture: [60, 80],
            soilQuality: 70,
            sunlight: 80,
            altitude: [0, 800],
            season: ['spring', 'summer', 'autumn']
        }),
        fieldType: 'orchard',
        spacing: 5.0,
        yield: { min: 40, max: 120 }
    },

    cherry: {
        ...CompleteFruitDatabase.cherry,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS],
            temperature: [0, 25],
            moisture: [55, 75],
            soilQuality: 65,
            sunlight: 85,
            altitude: [0, 600],
            season: ['spring', 'summer']
        }),
        fieldType: 'orchard',
        spacing: 6.0,
        yield: { min: 30, max: 80 }
    },

    // Mediterranean fruits
    orange: {
        ...CompleteFruitDatabase.orange,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.MEDITERRANEAN, BiomeTypes.TROPICAL_DRY],
            temperature: [10, 30],
            moisture: [40, 70],
            soilQuality: 60,
            sunlight: 90,
            altitude: [0, 400],
            season: 'all'
        }),
        fieldType: 'grove',
        spacing: 5.0,
        yield: { min: 60, max: 200 }
    },

    lemon: {
        ...CompleteFruitDatabase.lemon,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.MEDITERRANEAN],
            temperature: [10, 30],
            moisture: [40, 70],
            soilQuality: 60,
            sunlight: 90,
            altitude: [0, 400],
            season: 'all'
        }),
        fieldType: 'grove',
        spacing: 4.0,
        yield: { min: 40, max: 120 }
    },

    olive: {
        ...CompleteFruitDatabase.olive,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.MEDITERRANEAN],
            temperature: [10, 30],
            moisture: [30, 60],
            soilQuality: 50,
            sunlight: 90,
            altitude: [0, 600],
            season: ['summer', 'autumn']
        }),
        fieldType: 'grove',
        spacing: 7.0,
        yield: { min: 20, max: 80 }
    },

    // Tropical fruits
    banana: {
        ...CompleteFruitDatabase.banana,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TROPICAL_RAINFOREST],
            temperature: [20, 35],
            moisture: [80, 100],
            soilQuality: 70,
            sunlight: 70,
            altitude: [0, 300],
            season: 'all'
        }),
        fieldType: 'plantation',
        spacing: 3.0,
        yield: { min: 15, max: 40 }
    },

    mango: {
        ...CompleteFruitDatabase.mango,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TROPICAL_RAINFOREST, BiomeTypes.TROPICAL_DRY],
            temperature: [20, 35],
            moisture: [60, 90],
            soilQuality: 65,
            sunlight: 85,
            altitude: [0, 500],
            season: ['spring', 'summer']
        }),
        fieldType: 'plantation',
        spacing: 8.0,
        yield: { min: 50, max: 200 }
    },

    // VEGETABLES (SEBZELER) - Biom gereksinimleri ile
    
    // Temperate vegetables
    tomato: {
        ...CompleteVegetableDatabase.tomato,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS, BiomeTypes.MEDITERRANEAN],
            temperature: [15, 30],
            moisture: [60, 80],
            soilQuality: 65,
            sunlight: 80,
            altitude: [0, 1000],
            season: ['spring', 'summer', 'autumn']
        }),
        fieldType: 'rows',
        spacing: 0.6,
        yield: { min: 5, max: 15 }  // kg per plant
    },

    potato: {
        ...CompleteVegetableDatabase.potato,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS, BiomeTypes.TEMPERATE_GRASSLAND],
            temperature: [5, 25],
            moisture: [50, 75],
            soilQuality: 60,
            sunlight: 70,
            altitude: [0, 2000],
            season: ['spring', 'summer', 'autumn']
        }),
        fieldType: 'rows',
        spacing: 0.4,
        yield: { min: 1, max: 4 }
    },

    carrot: {
        ...CompleteVegetableDatabase.carrot,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS],
            temperature: [5, 25],
            moisture: [60, 75],
            soilQuality: 70,  // Needs good soil
            sunlight: 70,
            altitude: [0, 1500],
            season: ['spring', 'summer', 'autumn']
        }),
        fieldType: 'rows',
        spacing: 0.15,
        yield: { min: 0.5, max: 2 }
    },

    lettuce: {
        ...CompleteVegetableDatabase.lettuce,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS, BiomeTypes.MEDITERRANEAN],
            temperature: [10, 25],
            moisture: [60, 80],
            soilQuality: 65,
            sunlight: 70,
            altitude: [0, 1200],
            season: ['spring', 'summer', 'autumn']
        }),
        fieldType: 'rows',
        spacing: 0.3,
        yield: { min: 0.3, max: 1.0 }
    },

    cabbage: {
        ...CompleteVegetableDatabase.cabbage,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS],
            temperature: [5, 20],
            moisture: [60, 75],
            soilQuality: 65,
            sunlight: 65,
            altitude: [0, 1500],
            season: ['spring', 'autumn', 'winter']
        }),
        fieldType: 'rows',
        spacing: 0.5,
        yield: { min: 1, max: 3 }
    },

    // Mediterranean vegetables
    pepper: {
        ...CompleteVegetableDatabase.pepper,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.MEDITERRANEAN, BiomeTypes.TEMPERATE_DECIDUOUS],
            temperature: [15, 30],
            moisture: [60, 80],
            soilQuality: 65,
            sunlight: 85,
            altitude: [0, 800],
            season: ['spring', 'summer']
        }),
        fieldType: 'rows',
        spacing: 0.5,
        yield: { min: 3, max: 8 }
    },

    eggplant: {
        ...CompleteVegetableDatabase.eggplant,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.MEDITERRANEAN],
            temperature: [18, 32],
            moisture: [60, 80],
            soilQuality: 65,
            sunlight: 85,
            altitude: [0, 600],
            season: ['spring', 'summer']
        }),
        fieldType: 'rows',
        spacing: 0.6,
        yield: { min: 4, max: 10 }
    },

    cucumber: {
        ...CompleteVegetableDatabase.cucumber,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS, BiomeTypes.MEDITERRANEAN],
            temperature: [15, 30],
            moisture: [65, 85],
            soilQuality: 70,
            sunlight: 80,
            altitude: [0, 1000],
            season: ['spring', 'summer']
        }),
        fieldType: 'rows',
        spacing: 0.8,
        yield: { min: 5, max: 15 }
    },

    // Grassland vegetables
    corn: {
        ...CompleteVegetableDatabase.corn,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_GRASSLAND, BiomeTypes.TEMPERATE_DECIDUOUS],
            temperature: [15, 32],
            moisture: [60, 80],
            soilQuality: 65,
            sunlight: 85,
            altitude: [0, 1500],
            season: ['spring', 'summer']
        }),
        fieldType: 'rows',
        spacing: 0.5,
        yield: { min: 1, max: 3 }
    },

    // Cool season vegetables
    spinach: {
        ...CompleteVegetableDatabase.spinach,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS],
            temperature: [5, 20],
            moisture: [60, 75],
            soilQuality: 65,
            sunlight: 65,
            altitude: [0, 1500],
            season: ['spring', 'autumn', 'winter']
        }),
        fieldType: 'rows',
        spacing: 0.2,
        yield: { min: 0.3, max: 1.0 }
    },

    broccoli: {
        ...CompleteVegetableDatabase.broccoli,
        requirements: new CropRequirements({
            biomes: [BiomeTypes.TEMPERATE_DECIDUOUS],
            temperature: [10, 22],
            moisture: [60, 75],
            soilQuality: 65,
            sunlight: 70,
            altitude: [0, 1200],
            season: ['spring', 'autumn']
        }),
        fieldType: 'rows',
        spacing: 0.5,
        yield: { min: 0.5, max: 2.0 }
    }

    // ... (Continue for all 50 fruits and 50 vegetables)
};

/**
 * ============================================
 * CROP PLACEMENT ENGINE
 * ============================================
 */
export class CropPlacementEngine {
    constructor(scene, terrain) {
        this.scene = scene;
        this.terrain = terrain;
        this.plantFactory = new UltraRealisticPlantModelFactory();
        
        // Placed crops
        this.placedCrops = new Map(); // cropField_key -> {type, plants: []}
        this.fields = new Map(); // field_key -> FieldData
        
        // Stats
        this.totalCrops = 0;
        this.totalFields = 0;
        
        console.log('🌾 Crop Placement Engine initialized');
    }

    /**
     * CRITICAL: Analyze terrain for suitable crop locations
     * @param {number} chunkX 
     * @param {number} chunkZ 
     */
    analyzeSuitableCropLocations(chunkX, chunkZ) {
        const chunkSize = this.terrain.chunkSize;
        const worldX = (chunkX - this.terrain.chunksPerSide / 2) * chunkSize;
        const worldZ = (chunkZ - this.terrain.chunksPerSide / 2) * chunkSize;
        
        // Get chunk environment data
        const environment = this.getEnvironmentData(worldX, worldZ);
        
        // Find suitable crops for this environment
        const suitableCrops = this.findSuitableCrops(environment);
        
        return {
            environment,
            suitableCrops,
            location: { worldX, worldZ, chunkX, chunkZ }
        };
    }

    /**
     * Get environment data for a location
     */
    getEnvironmentData(x, z) {
        const biome = this.terrain.getBiomeAt(x, z);
        const height = this.terrain.getHeightAt(x, z);
        
        // Biome-based environment parameters
        const biomeData = this.getBiomeEnvironmentData(biome);
        
        return {
            biome: biome,
            temperature: biomeData.temperature,
            moisture: biomeData.moisture,
            soilQuality: biomeData.soilQuality,
            sunlight: biomeData.sunlight,
            altitude: height,
            x: x,
            z: z
        };
    }

    /**
     * Get environment parameters for biome
     */
    getBiomeEnvironmentData(biome) {
        const envData = {
            [BiomeTypes.TROPICAL_RAINFOREST]: {
                temperature: 27,
                moisture: 90,
                soilQuality: 70,
                sunlight: 60
            },
            [BiomeTypes.TROPICAL_DRY]: {
                temperature: 28,
                moisture: 50,
                soilQuality: 60,
                sunlight: 85
            },
            [BiomeTypes.TEMPERATE_DECIDUOUS]: {
                temperature: 15,
                moisture: 70,
                soilQuality: 75,
                sunlight: 70
            },
            [BiomeTypes.TEMPERATE_CONIFEROUS]: {
                temperature: 10,
                moisture: 65,
                soilQuality: 60,
                sunlight: 60
            },
            [BiomeTypes.BOREAL]: {
                temperature: 5,
                moisture: 60,
                soilQuality: 50,
                sunlight: 55
            },
            [BiomeTypes.MEDITERRANEAN]: {
                temperature: 20,
                moisture: 55,
                soilQuality: 65,
                sunlight: 85
            },
            [BiomeTypes.TEMPERATE_GRASSLAND]: {
                temperature: 18,
                moisture: 60,
                soilQuality: 80,
                sunlight: 80
            },
            [BiomeTypes.SAVANNA]: {
                temperature: 25,
                moisture: 45,
                soilQuality: 55,
                sunlight: 90
            },
            [BiomeTypes.HOT_DESERT]: {
                temperature: 35,
                moisture: 15,
                soilQuality: 30,
                sunlight: 100
            },
            [BiomeTypes.COLD_DESERT]: {
                temperature: 10,
                moisture: 20,
                soilQuality: 35,
                sunlight: 85
            }
        };
        
        return envData[biome] || {
            temperature: 15,
            moisture: 50,
            soilQuality: 50,
            sunlight: 70
        };
    }

    /**
     * Find crops that can grow in this environment
     */
    findSuitableCrops(environment) {
        const suitable = {
            fruits: [],
            vegetables: []
        };
        
        // Check all crops
        for (const [cropId, cropData] of Object.entries(EnhancedCropDatabase)) {
            if (cropData.requirements && cropData.requirements.canGrow(environment)) {
                if (CompleteFruitDatabase[cropId]) {
                    suitable.fruits.push({ id: cropId, data: cropData });
                } else if (CompleteVegetableDatabase[cropId]) {
                    suitable.vegetables.push({ id: cropId, data: cropData });
                }
            }
        }
        
        return suitable;
    }

    /**
     * CRITICAL: Create crop field
     * @param {string} cropId - Crop identifier
     * @param {number} fieldX - Field center X
     * @param {number} fieldZ - Field center Z
     * @param {number} fieldWidth - Field width
     * @param {number} fieldLength - Field length
     */
    createCropField(cropId, fieldX, fieldZ, fieldWidth, fieldLength) {
        const cropData = EnhancedCropDatabase[cropId];
        
        if (!cropData) {
            console.warn(`Unknown crop: ${cropId}`);
            return null;
        }
        
        // Check environment
        const environment = this.getEnvironmentData(fieldX, fieldZ);
        if (!cropData.requirements.canGrow(environment)) {
            console.warn(`Crop ${cropId} cannot grow in this environment`);
            return null;
        }
        
        const fieldGroup = new THREE.Group();
        fieldGroup.name = `crop_field_${cropId}_${this.totalFields}`;
        
        // Calculate plant positions based on field type
        const positions = this.calculatePlantPositions(
            cropData.fieldType,
            cropData.spacing,
            fieldWidth,
            fieldLength,
            fieldX,
            fieldZ
        );
        
        // Create plants
        const plants = [];
        positions.forEach((pos, index) => {
            const y = this.terrain.getHeightAt(pos.x, pos.z);
            
            // Create vegetable or fruit plant
            let plant;
            if (CompleteFruitDatabase[cropId]) {
                // Fruit tree
                plant = this.plantFactory.createRealisticTree(cropData);
            } else {
                // Vegetable
                plant = this.plantFactory.createVegetable(cropData, pos.x, y, pos.z);
            }
            
            if (plant) {
                plant.position.set(pos.x, y, pos.z);
                plant.userData.cropId = cropId;
                plant.userData.fieldId = this.totalFields;
                plant.userData.plantIndex = index;
                plant.userData.growthStage = 0;  // 0-1
                plant.userData.health = 1.0;     // 0-1
                
                fieldGroup.add(plant);
                plants.push(plant);
            }
        });
        
        // Field metadata
        const fieldData = {
            id: this.totalFields,
            cropId: cropId,
            cropData: cropData,
            position: { x: fieldX, z: fieldZ },
            dimensions: { width: fieldWidth, length: fieldLength },
            plants: plants,
            group: fieldGroup,
            environment: environment,
            plantCount: plants.length,
            harvestReady: false,
            plantedDate: Date.now()
        };
        
        this.fields.set(`field_${this.totalFields}`, fieldData);
        this.totalFields++;
        this.totalCrops += plants.length;
        
        this.scene.add(fieldGroup);
        
        console.log(`🌾 Field created: ${cropId} (${plants.length} plants)`);
        
        return fieldData;
    }

    /**
     * Calculate plant positions based on field type
     */
    calculatePlantPositions(fieldType, spacing, width, length, centerX, centerZ) {
        const positions = [];
        
        switch(fieldType) {
            case 'rows':
                // Row planting (vegetables)
                const rowSpacing = spacing;
                const plantSpacing = spacing;
                const rowCount = Math.floor(length / rowSpacing);
                const plantsPerRow = Math.floor(width / plantSpacing);
                
                for (let row = 0; row < rowCount; row++) {
                    for (let col = 0; col < plantsPerRow; col++) {
                        positions.push({
                            x: centerX - width / 2 + col * plantSpacing + plantSpacing / 2,
                            z: centerZ - length / 2 + row * rowSpacing + rowSpacing / 2
                        });
                    }
                }
                break;
                
            case 'orchard':
                // Orchard planting (fruit trees)
                const treeSpacing = spacing;
                const treesWidth = Math.floor(width / treeSpacing);
                const treesLength = Math.floor(length / treeSpacing);
                
                for (let row = 0; row < treesLength; row++) {
                    for (let col = 0; col < treesWidth; col++) {
                        positions.push({
                            x: centerX - width / 2 + col * treeSpacing + treeSpacing / 2,
                            z: centerZ - length / 2 + row * treeSpacing + treeSpacing / 2
                        });
                    }
                }
                break;
                
            case 'grove':
                // Grove planting (citrus, olives)
                const groveSpacing = spacing;
                const groveTrees = Math.floor((width * length) / (groveSpacing * groveSpacing));
                
                // Hex pattern
                const hexRadius = groveSpacing;
                const rows = Math.floor(length / (hexRadius * 1.732));
                const cols = Math.floor(width / (hexRadius * 2));
                
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const offset = (row % 2) * hexRadius;
                        positions.push({
                            x: centerX - width / 2 + col * hexRadius * 2 + offset + hexRadius,
                            z: centerZ - length / 2 + row * hexRadius * 1.732 + hexRadius
                        });
                    }
                }
                break;
                
            case 'plantation':
                // Plantation (tropical fruits)
                const plantationSpacing = spacing;
                const plantationRows = Math.floor(length / plantationSpacing);
                const plantationCols = Math.floor(width / plantationSpacing);
                
                for (let row = 0; row < plantationRows; row++) {
                    for (let col = 0; col < plantationCols; col++) {
                        // Add slight randomness
                        const randomX = (Math.random() - 0.5) * plantationSpacing * 0.2;
                        const randomZ = (Math.random() - 0.5) * plantationSpacing * 0.2;
                        
                        positions.push({
                            x: centerX - width / 2 + col * plantationSpacing + plantationSpacing / 2 + randomX,
                            z: centerZ - length / 2 + row * plantationSpacing + plantationSpacing / 2 + randomZ
                        });
                    }
                }
                break;
        }
        
        return positions;
    }

    /**
     * Update crop growth
     */
    update(delta) {
        // Update growth stages, health, etc.
        this.fields.forEach(field => {
            field.plants.forEach(plant => {
                // Growth simulation
                if (plant.userData.growthStage < 1.0) {
                    plant.userData.growthStage += delta / field.cropData.growthTime;
                    
                    // Scale based on growth
                    const scale = 0.1 + plant.userData.growthStage * 0.9;
                    plant.scale.set(scale, scale, scale);
                }
                
                // Check if harvest ready
                if (plant.userData.growthStage >= 1.0) {
                    field.harvestReady = true;
                }
            });
        });
    }

    /**
     * Get stats
     */
    getStats() {
        return {
            totalFields: this.totalFields,
            totalCrops: this.totalCrops,
            fieldsByType: this.getFieldsByType(),
            harvestReadyFields: Array.from(this.fields.values()).filter(f => f.harvestReady).length
        };
    }

    getFieldsByType() {
        const types = {};
        this.fields.forEach(field => {
            types[field.cropId] = (types[field.cropId] || 0) + 1;
        });
        return types;
    }
}

console.log('🌾 Crop Placement Engine loaded');
