// 🌍 Farm Dominion v2.1 - WORLD.JS INTEGRATION CODE
// Bu kod world.js içine eklenecek
// ✅ Crop placement system
// ✅ Biome-based crops
// ✅ Enhanced models
// ✅ Full integration

/**
 * ============================================
 * WORLD.JS'E EKLENECEK IMPORT'LAR
 * ============================================
 * 
 * Dosyanın EN ÜSTÜNE ekle:
 */

// === YENİ IMPORT'LAR (CROP SYSTEM) ===
import { CropPlacementEngine } from './crop_placement_engine.js';
import { EnhancedCropModelFactory } from './enhanced_crop_models.js';
import { CompleteBiomeDatabase, getCropsForBiome, canCropGrow } from './complete_biome_requirements.js';

/**
 * ============================================
 * GLOBAL VARIABLES'A EKLE
 * ============================================
 * 
 * Global variables bölümüne ekle:
 */

// Crop system
let cropPlacementEngine;
let enhancedCropFactory;
let activeCropFields = new Map();

/**
 * ============================================
 * initWorld FONKSİYONUNA EKLE
 * ============================================
 * 
 * Flora placement'tan SONRA, buildings'ten ÖNCE ekle:
 */

// ========================================
// PHASE: CROP PLACEMENT ENGINE (75-80%)
// ========================================
console.log('🌾 === CROP PLACEMENT ENGINE ===');
if (progressCallback) progressCallback(0.75, 'Initializing crop system...');

// Enhanced crop model factory
enhancedCropFactory = new EnhancedCropModelFactory();
window.enhancedCropFactory = enhancedCropFactory; // Global access

// Crop placement engine
cropPlacementEngine = new CropPlacementEngine(scene, terrain);
window.cropPlacementEngine = cropPlacementEngine; // Global access

console.log('✅ Crop system initialized');

// Analyze suitable crop locations for starting area
const startChunkX = Math.floor(terrain.chunksPerSide / 2);
const startChunkZ = Math.floor(terrain.chunksPerSide / 2);

console.log('🌾 Analyzing crop locations...');
const cropAnalysis = cropPlacementEngine.analyzeSuitableCropLocations(startChunkX, startChunkZ);

console.log('🌾 Suitable crops found:');
console.log(`   🍎 Fruits: ${cropAnalysis.suitableCrops.fruits.length}`);
console.log(`   🥬 Vegetables: ${cropAnalysis.suitableCrops.vegetables.length}`);

// Create sample crop fields (demo)
if (cropAnalysis.suitableCrops.vegetables.length > 0) {
    const sampleVeg = cropAnalysis.suitableCrops.vegetables[0];
    console.log(`🌾 Creating demo field: ${sampleVeg.id}`);
    
    const field = cropPlacementEngine.createCropField(
        sampleVeg.id,
        cropAnalysis.location.worldX + 50,
        cropAnalysis.location.worldZ + 50,
        20, // width
        30  // length
    );
    
    if (field) {
        activeCropFields.set(field.id, field);
        console.log(`✅ Demo field created with ${field.plantCount} plants`);
    }
}

/**
 * ============================================
 * ANIMATION LOOP'A EKLE
 * ============================================
 * 
 * animate() fonksiyonuna, NPC updates'ten SONRA ekle:
 */

// === CROP SYSTEM UPDATES ===
if (cropPlacementEngine) {
    cropPlacementEngine.update(delta);
}

/**
 * ============================================
 * DEBUG & HELPER FUNCTIONS
 * ============================================
 * 
 * Dosyanın SONUNA ekle:
 */

/**
 * Show crops suitable for current biome
 */
export function showAvailableCrops(x, z) {
    const biome = terrain.getBiomeAt(x, z);
    const crops = getCropsForBiome(biome);
    
    console.log('🌾 === AVAILABLE CROPS ===');
    console.log(`📍 Location: (${x}, ${z})`);
    console.log(`🗺️ Biome: ${biome}`);
    console.log(`🍎 Fruits: ${crops.fruits.length}`);
    crops.fruits.forEach(f => console.log(`   - ${f.id}`));
    console.log(`🥬 Vegetables: ${crops.vegetables.length}`);
    crops.vegetables.forEach(v => console.log(`   - ${v.id}`));
    
    return crops;
}

/**
 * Create crop field at position
 */
export function createCropFieldAt(cropId, x, z, width = 20, length = 30) {
    console.log(`🌾 Creating field: ${cropId} at (${x}, ${z})`);
    
    // Check if crop can grow
    const environment = cropPlacementEngine.getEnvironmentData(x, z);
    if (!canCropGrow(cropId, environment)) {
        console.error(`❌ ${cropId} cannot grow in this environment`);
        console.log('Environment:', environment);
        return null;
    }
    
    const field = cropPlacementEngine.createCropField(cropId, x, z, width, length);
    
    if (field) {
        activeCropFields.set(field.id, field);
        console.log(`✅ Field created: ${field.plantCount} plants`);
        return field;
    }
    
    return null;
}

/**
 * Get crop stats
 */
export function getCropStats() {
    const stats = cropPlacementEngine.getStats();
    console.log('🌾 === CROP STATS ===');
    console.log(`   Total Fields: ${stats.totalFields}`);
    console.log(`   Total Crops: ${stats.totalCrops}`);
    console.log(`   Harvest Ready: ${stats.harvestReadyFields}`);
    console.log('   Fields by Type:');
    Object.entries(stats.fieldsByType).forEach(([type, count]) => {
        console.log(`      ${type}: ${count}`);
    });
    
    return stats;
}

/**
 * Test crop model
 */
export function testCropModel(cropId, x, y, z) {
    console.log(`🌾 Testing crop model: ${cropId}`);
    
    const cropData = CompleteBiomeDatabase[cropId];
    if (!cropData) {
        console.error(`❌ Unknown crop: ${cropId}`);
        return null;
    }
    
    // Create test plant
    let plant;
    if (cropData.tree || cropData.requirements.spacing > 3) {
        // Fruit tree
        plant = plantFactory.createRealisticTree(cropData);
    } else {
        // Vegetable
        plant = enhancedCropFactory.createVegetable(cropData, x, y, z);
        
        // Try specific enhanced models
        switch(cropId) {
            case 'strawberry':
                plant = enhancedCropFactory.createStrawberryPlant(1.0);
                break;
            case 'grape':
                plant = enhancedCropFactory.createGrapeVine(1.0);
                break;
            case 'watermelon':
                plant = enhancedCropFactory.createWatermelonPlant(1.0);
                break;
            case 'carrot':
                plant = enhancedCropFactory.createEnhancedCarrotPlant(1.0);
                break;
            case 'potato':
                plant = enhancedCropFactory.createEnhancedPotatoPlant(1.0);
                break;
        }
    }
    
    if (plant) {
        plant.position.set(x, y, z);
        scene.add(plant);
        console.log(`✅ Test plant created at (${x}, ${y}, ${z})`);
        return plant;
    }
    
    return null;
}

/**
 * Show biome map for crops
 */
export function showBiomeMap() {
    console.log('🗺️ === BIOME CROP MAP ===');
    
    const biomes = [
        'tropical_rainforest',
        'temperate_deciduous',
        'mediterranean',
        'temperate_grassland',
        'hot_desert'
    ];
    
    biomes.forEach(biome => {
        const crops = getCropsForBiome(biome);
        console.log(`\n${biome.toUpperCase()}:`);
        console.log(`   🍎 ${crops.fruits.length} fruits: ${crops.fruits.map(f => f.id).slice(0, 5).join(', ')}...`);
        console.log(`   🥬 ${crops.vegetables.length} vegetables: ${crops.vegetables.map(v => v.id).slice(0, 5).join(', ')}...`);
    });
}

/**
 * Create growth stage demo
 */
export function createGrowthDemo(cropId, x, z) {
    console.log(`🌾 Creating growth stage demo: ${cropId}`);
    
    const stages = [0.2, 0.4, 0.6, 0.8, 1.0];
    const spacing = 5;
    
    stages.forEach((stage, i) => {
        const offsetX = x + i * spacing;
        const y = terrain.getHeightAt(offsetX, z);
        
        const cropData = CompleteBiomeDatabase[cropId];
        let plant;
        
        switch(cropId) {
            case 'strawberry':
                plant = enhancedCropFactory.createStrawberryPlant(stage);
                break;
            case 'grape':
                plant = enhancedCropFactory.createGrapeVine(stage);
                break;
            case 'watermelon':
                plant = enhancedCropFactory.createWatermelonPlant(stage);
                break;
            case 'carrot':
                plant = enhancedCropFactory.createEnhancedCarrotPlant(stage);
                break;
            case 'potato':
                plant = enhancedCropFactory.createEnhancedPotatoPlant(stage);
                break;
            default:
                plant = plantFactory.createRealisticTree(cropData);
                plant.scale.setScalar(stage);
        }
        
        if (plant) {
            plant.position.set(offsetX, y, z);
            scene.add(plant);
        }
    });
    
    console.log(`✅ Growth demo created (stages: ${stages.join(', ')})`);
}

// Make functions globally accessible
window.showAvailableCrops = showAvailableCrops;
window.createCropFieldAt = createCropFieldAt;
window.getCropStats = getCropStats;
window.testCropModel = testCropModel;
window.showBiomeMap = showBiomeMap;
window.createGrowthDemo = createGrowthDemo;

console.log('🌾 Crop system integration complete');
console.log('💡 Debug functions available:');
console.log('   - showAvailableCrops(x, z)');
console.log('   - createCropFieldAt(cropId, x, z)');
console.log('   - getCropStats()');
console.log('   - testCropModel(cropId, x, y, z)');
console.log('   - showBiomeMap()');
console.log('   - createGrowthDemo(cropId, x, z)');
