// 🌿 Farm Dominion v2.1 - Realistic Biome & Vegetation System
import * as THREE from './three.module.js';
import { perlin, random, randomInt } from './utils.js';

// Biome types
export const BiomeTypes = {
    TROPICAL_RAINFOREST: 'tropical_rainforest',
    TROPICAL_DRY: 'tropical_dry',
    TEMPERATE_DECIDUOUS: 'temperate_deciduous',
    TEMPERATE_CONIFEROUS: 'temperate_coniferous',
    BOREAL: 'boreal',
    SAVANNA: 'savanna',
    TEMPERATE_GRASSLAND: 'temperate_grassland',
    MEDITERRANEAN: 'mediterranean',
    HOT_DESERT: 'hot_desert',
    COLD_DESERT: 'cold_desert',
    ARCTIC_TUNDRA: 'arctic_tundra',
    ALPINE_TUNDRA: 'alpine_tundra'
};

// Plant growth requirements
class PlantRequirements {
    constructor(moisture, temperature, soilQuality, sunlight) {
        this.moisture = moisture; // 0-100%
        this.temperature = temperature; // -50 to +50°C
        this.soilQuality = soilQuality; // 0-100%
        this.sunlight = sunlight; // 0-100%
    }

    canGrow(environment) {
        return (
            environment.moisture >= this.moisture[0] && environment.moisture <= this.moisture[1] &&
            environment.temperature >= this.temperature[0] && environment.temperature <= this.temperature[1] &&
            environment.soilQuality >= this.soilQuality &&
            environment.sunlight >= this.sunlight
        );
    }
}

// Plant species database
export const PlantDatabase = {
    // TROPICAL RAINFOREST
    mahogany_tree: {
        name: 'Mahun Ağacı',
        biome: BiomeTypes.TROPICAL_RAINFOREST,
        type: 'tree',
        height: [20, 30],
        color: 0x1a4d1a,
        requirements: new PlantRequirements([80, 100], [20, 35], 60, 30),
        growthTime: 365 * 20, // 20 years
        fruit: null
    },
    banana_tree: {
        name: 'Muz Ağacı',
        biome: BiomeTypes.TROPICAL_RAINFOREST,
        type: 'tree',
        height: [3, 5],
        color: 0x4d9d4d,
        requirements: new PlantRequirements([85, 100], [20, 30], 70, 60),
        growthTime: 365 * 1, // 1 year
        fruit: { name: 'Muz', color: 0xffeb3b, weight: 3.5, season: 'all' }
    },
    mango_tree: {
        name: 'Mango Ağacı',
        biome: BiomeTypes.TROPICAL_RAINFOREST,
        type: 'tree',
        height: [15, 20],
        color: 0x2d6b2d,
        requirements: new PlantRequirements([70, 95], [20, 35], 65, 70),
        growthTime: 365 * 5, // 5 years
        fruit: { name: 'Mango', color: 0xffa726, weight: 1.2, season: 'summer' }
    },
    avocado_tree: {
        name: 'Avokado Ağacı',
        biome: BiomeTypes.TROPICAL_RAINFOREST,
        type: 'tree',
        height: [10, 15],
        color: 0x3d6b3d,
        requirements: new PlantRequirements([60, 90], [15, 30], 70, 65),
        growthTime: 365 * 3, // 3 years
        fruit: { name: 'Avokado', color: 0x4d7c3d, weight: 0.7, season: 'spring' }
    },

    // TEMPERATE DECIDUOUS
    oak_tree: {
        name: 'Meşe',
        biome: BiomeTypes.TEMPERATE_DECIDUOUS,
        type: 'tree',
        height: [15, 25],
        color: 0x4d7c4d,
        requirements: new PlantRequirements([50, 80], [-5, 25], 60, 70),
        growthTime: 365 * 30, // 30 years
        fruit: null,
        deciduous: true
    },
    apple_tree: {
        name: 'Elma Ağacı',
        biome: BiomeTypes.TEMPERATE_DECIDUOUS,
        type: 'tree',
        height: [5, 8],
        color: 0x5a9d5a,
        requirements: new PlantRequirements([60, 80], [0, 25], 70, 80),
        growthTime: 365 * 3, // 3 years
        fruit: { name: 'Elma', color: 0xef5350, weight: 0.2, season: 'autumn' },
        deciduous: true
    },
    pear_tree: {
        name: 'Armut Ağacı',
        biome: BiomeTypes.TEMPERATE_DECIDUOUS,
        type: 'tree',
        height: [6, 9],
        color: 0x5aaa5a,
        requirements: new PlantRequirements([60, 80], [0, 25], 70, 80),
        growthTime: 365 * 3, // 3 years
        fruit: { name: 'Armut', color: 0xffeb3b, weight: 0.15, season: 'autumn' },
        deciduous: true
    },
    walnut_tree: {
        name: 'Ceviz Ağacı',
        biome: BiomeTypes.TEMPERATE_DECIDUOUS,
        type: 'tree',
        height: [15, 20],
        color: 0x4d7c4d,
        requirements: new PlantRequirements([55, 75], [-5, 25], 65, 75),
        growthTime: 365 * 7, // 7 years
        fruit: { name: 'Ceviz', color: 0x8b6f47, weight: 0.05, season: 'autumn' },
        deciduous: true
    },

    // MEDITERRANEAN
    olive_tree: {
        name: 'Zeytin Ağacı',
        biome: BiomeTypes.MEDITERRANEAN,
        type: 'tree',
        height: [8, 15],
        color: 0x808060,
        requirements: new PlantRequirements([30, 60], [10, 30], 50, 85),
        growthTime: 365 * 10, // 10 years
        fruit: { name: 'Zeytin', color: 0x2e2e2e, weight: 0.005, season: 'autumn' },
        evergreen: true
    },
    orange_tree: {
        name: 'Portakal Ağacı',
        biome: BiomeTypes.MEDITERRANEAN,
        type: 'tree',
        height: [5, 8],
        color: 0x4d7c4d,
        requirements: new PlantRequirements([40, 70], [10, 30], 60, 80),
        growthTime: 365 * 4, // 4 years
        fruit: { name: 'Portakal', color: 0xff9800, weight: 0.2, season: 'winter' },
        evergreen: true
    },
    lemon_tree: {
        name: 'Limon Ağacı',
        biome: BiomeTypes.MEDITERRANEAN,
        type: 'tree',
        height: [5, 7],
        color: 0x5a9d5a,
        requirements: new PlantRequirements([40, 70], [10, 30], 60, 80),
        growthTime: 365 * 3, // 3 years
        fruit: { name: 'Limon', color: 0xffeb3b, weight: 0.1, season: 'all' },
        evergreen: true
    },
    fig_tree: {
        name: 'İncir Ağacı',
        biome: BiomeTypes.MEDITERRANEAN,
        type: 'tree',
        height: [7, 10],
        color: 0x4d6b4d,
        requirements: new PlantRequirements([35, 65], [10, 30], 55, 85),
        growthTime: 365 * 2, // 2 years
        fruit: { name: 'İncir', color: 0x7b1fa2, weight: 0.05, season: 'summer' },
        deciduous: true
    },

    // BOREAL
    spruce_tree: {
        name: 'Ladin',
        biome: BiomeTypes.BOREAL,
        type: 'tree',
        height: [20, 40],
        color: 0x1a3a1a,
        requirements: new PlantRequirements([40, 60], [-40, 20], 40, 50),
        growthTime: 365 * 40, // 40 years
        fruit: null,
        coniferous: true
    },
    pine_tree: {
        name: 'Çam',
        biome: BiomeTypes.BOREAL,
        type: 'tree',
        height: [15, 30],
        color: 0x2d4d2d,
        requirements: new PlantRequirements([40, 60], [-30, 25], 40, 50),
        growthTime: 365 * 30, // 30 years
        fruit: null,
        coniferous: true
    },

    // SAVANNA
    acacia_tree: {
        name: 'Akasya',
        biome: BiomeTypes.SAVANNA,
        type: 'tree',
        height: [5, 10],
        color: 0x6b8e23,
        requirements: new PlantRequirements([30, 60], [15, 35], 40, 90),
        growthTime: 365 * 10, // 10 years
        fruit: null,
        droughtResistant: true
    },
    baobab_tree: {
        name: 'Baobab',
        biome: BiomeTypes.SAVANNA,
        type: 'tree',
        height: [10, 20],
        color: 0x7cbb00,
        requirements: new PlantRequirements([20, 50], [20, 35], 35, 90),
        growthTime: 365 * 50, // 50 years
        fruit: { name: 'Baobab meyvesi', color: 0x8b7355, weight: 0.5, season: 'dry' },
        droughtResistant: true
    },

    // DESERT
    date_palm: {
        name: 'Hurma Ağacı',
        biome: BiomeTypes.HOT_DESERT,
        type: 'tree',
        height: [15, 25],
        color: 0x6b8e23,
        requirements: new PlantRequirements([10, 40], [20, 50], 30, 100),
        growthTime: 365 * 5, // 5 years
        fruit: { name: 'Hurma', color: 0x8b6f47, weight: 0.02, season: 'summer' },
        oasisOnly: true
    },

    // VEGETABLES - Temperate
    tomato: {
        name: 'Domates',
        biome: [BiomeTypes.TEMPERATE_DECIDUOUS, BiomeTypes.MEDITERRANEAN],
        type: 'vegetable',
        height: [0.5, 1.5],
        color: 0x4caf50,
        requirements: new PlantRequirements([60, 80], [15, 30], 65, 80),
        growthTime: 90, // 90 days
        fruit: { name: 'Domates', color: 0xef5350, weight: 0.15, season: 'summer' }
    },
    potato: {
        name: 'Patates',
        biome: [BiomeTypes.TEMPERATE_DECIDUOUS, BiomeTypes.TEMPERATE_GRASSLAND],
        type: 'vegetable',
        height: [0.3, 0.6],
        color: 0x4d7c4d,
        requirements: new PlantRequirements([50, 75], [5, 25], 60, 70),
        growthTime: 120, // 120 days
        fruit: { name: 'Patates', color: 0xd4b896, weight: 0.15, season: 'autumn' }
    },
    carrot: {
        name: 'Havuç',
        biome: [BiomeTypes.TEMPERATE_DECIDUOUS],
        type: 'vegetable',
        height: [0.2, 0.4],
        color: 0x4d9d4d,
        requirements: new PlantRequirements([60, 75], [5, 25], 65, 70),
        growthTime: 80, // 80 days
        fruit: { name: 'Havuç', color: 0xff9800, weight: 0.1, season: 'all' }
    }
};

// Biome environment calculator
export class BiomeSystem {
    constructor() {
        this.biomes = new Map();
        this.initializeBiomes();
    }

    initializeBiomes() {
        // Tropical Rainforest
        this.biomes.set(BiomeTypes.TROPICAL_RAINFOREST, {
            moisture: [80, 100],
            temperature: [20, 35],
            soilQuality: 70,
            sunlight: [30, 100],
            color: 0x1a4d1a,
            density: 0.9
        });

        // Temperate Deciduous
        this.biomes.set(BiomeTypes.TEMPERATE_DECIDUOUS, {
            moisture: [50, 80],
            temperature: [-5, 25],
            soilQuality: 70,
            sunlight: [50, 90],
            color: 0x4d7c4d,
            density: 0.7
        });

        // Mediterranean
        this.biomes.set(BiomeTypes.MEDITERRANEAN, {
            moisture: [30, 70],
            temperature: [10, 30],
            soilQuality: 60,
            sunlight: [70, 100],
            color: 0x6b8e23,
            density: 0.4
        });

        // Boreal
        this.biomes.set(BiomeTypes.BOREAL, {
            moisture: [40, 60],
            temperature: [-40, 20],
            soilQuality: 40,
            sunlight: [30, 60],
            color: 0x1a3a1a,
            density: 0.8
        });

        // Savanna
        this.biomes.set(BiomeTypes.SAVANNA, {
            moisture: [20, 60],
            temperature: [15, 35],
            soilQuality: 50,
            sunlight: [80, 100],
            color: 0x9acd32,
            density: 0.2
        });

        // Hot Desert
        this.biomes.set(BiomeTypes.HOT_DESERT, {
            moisture: [0, 25],
            temperature: [20, 50],
            soilQuality: 20,
            sunlight: [95, 100],
            color: 0xe8d4b4,
            density: 0.05
        });
    }

    // Determine biome based on position
    getBiomeAt(x, z) {
        // Use noise functions to create realistic biome distribution
        const temperature = this.getTemperatureAt(x, z);
        const moisture = this.getMoistureAt(x, z);
        const elevation = this.getElevationAt(x, z);

        // Biome selection logic
        if (elevation > 200) {
            if (temperature < -10) return BiomeTypes.ARCTIC_TUNDRA;
            if (temperature < 5) return BiomeTypes.ALPINE_TUNDRA;
            return BiomeTypes.TEMPERATE_CONIFEROUS;
        }

        if (temperature > 25) {
            if (moisture < 30) return BiomeTypes.HOT_DESERT;
            if (moisture < 60) return BiomeTypes.SAVANNA;
            return BiomeTypes.TROPICAL_RAINFOREST;
        }

        if (temperature > 10) {
            if (moisture < 40) return BiomeTypes.MEDITERRANEAN;
            if (moisture < 70) return BiomeTypes.TEMPERATE_GRASSLAND;
            return BiomeTypes.TEMPERATE_DECIDUOUS;
        }

        if (temperature < -10) {
            if (moisture < 40) return BiomeTypes.COLD_DESERT;
            return BiomeTypes.ARCTIC_TUNDRA;
        }

        // Default: Boreal
        return BiomeTypes.BOREAL;
    }

    getTemperatureAt(x, z) {
        // Latitude effect (distance from equator)
        const latitude = Math.abs(z / 100);
        const baseTemp = 30 - (latitude * 0.5); // Warmer at equator

        // Add noise for variation
        const variation = perlin(x * 0.001, z * 0.001) * 10;

        return baseTemp + variation;
    }

    getMoistureAt(x, z) {
        // Use Perlin noise for moisture distribution
        const moistureNoise = perlin(x * 0.0005, z * 0.0005);
        return ((moistureNoise + 1) / 2) * 100; // 0-100%
    }

    getElevationAt(x, z) {
        return perlin(x, z) * 200; // Simplified elevation
    }

    getEnvironmentAt(x, z) {
        return {
            moisture: this.getMoistureAt(x, z),
            temperature: this.getTemperatureAt(x, z),
            soilQuality: 60 + random(-20, 20),
            sunlight: 70 + random(-20, 20)
        };
    }

    canPlantGrow(plantId, x, z) {
        const plant = PlantDatabase[plantId];
        if (!plant) return false;

        const environment = this.getEnvironmentAt(x, z);
        return plant.requirements.canGrow(environment);
    }
}

console.log('🌿 Biome & vegetation system loaded');
console.log('📊 Plant species:', Object.keys(PlantDatabase).length);
