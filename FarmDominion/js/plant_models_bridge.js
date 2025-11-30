// 🌉 Plant Models Bridge
import { UltraRealisticPlantModelFactory } from './ultra_realistic_plant_models_FULL.js';
import { CompleteTreeDatabase } from './complete_plant_database_99_trees.js';

const factory = new UltraRealisticPlantModelFactory();

export function createTree(treeId) {
    const treeData = CompleteTreeDatabase[treeId];
    if (!treeData) {
        console.warn(`❌ Unknown tree: ${treeId}`);
        return null;
    }
    return factory.createRealisticTree(treeData);
}

export function createRandomTreeForBiome(biome) {
    const trees = Object.values(CompleteTreeDatabase).filter(tree => {
        if (Array.isArray(tree.biome)) return tree.biome.includes(biome);
        return tree.biome === biome;
    });
    
    if (trees.length === 0) return null;
    
    const randomTree = trees[Math.floor(Math.random() * trees.length)];
    return factory.createRealisticTree(randomTree);
}

export function getPlantFactory() {
    return factory;
}

export function updateWindAnimation(delta, strength = 0.5) {
    factory.updateWindAnimation(delta, strength);
}

export function applyWindToLeafCluster(leafCluster, strength = 0.5) {
    factory.applyWindToLeafCluster(leafCluster, strength);
}

console.log('🌉 Plant Models Bridge loaded');