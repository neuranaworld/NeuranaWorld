// Minecraft-style block colors and materials
export const getBlockMaterial = (blockType, scene, BABYLON) => {
  const mat = new BABYLON.StandardMaterial(`mat_${blockType}_${Date.now()}`, scene);
  
  switch (blockType) {
    // Temel Bloklar
    case 'grass':
      mat.diffuseColor = new BABYLON.Color3(0.35, 0.75, 0.25);
      mat.ambientColor = new BABYLON.Color3(0.1, 0.3, 0.1);
      mat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
      break;
    
    case 'dirt':
      mat.diffuseColor = new BABYLON.Color3(0.55, 0.35, 0.2);
      mat.ambientColor = new BABYLON.Color3(0.2, 0.1, 0.05);
      mat.specularColor = new BABYLON.Color3(0.02, 0.02, 0.02);
      break;
    
    case 'stone':
      mat.diffuseColor = new BABYLON.Color3(0.55, 0.55, 0.55);
      mat.ambientColor = new BABYLON.Color3(0.15, 0.15, 0.15);
      mat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      break;
    
    case 'sand':
      mat.diffuseColor = new BABYLON.Color3(0.9, 0.85, 0.6);
      mat.ambientColor = new BABYLON.Color3(0.3, 0.28, 0.2);
      mat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      break;
    
    case 'gravel':
      mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
      mat.ambientColor = new BABYLON.Color3(0.15, 0.15, 0.15);
      mat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
      break;
    
    case 'cobblestone':
      mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      mat.ambientColor = new BABYLON.Color3(0.12, 0.12, 0.12);
      mat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      break;
    
    case 'clay':
      mat.diffuseColor = new BABYLON.Color3(0.65, 0.65, 0.7);
      mat.ambientColor = new BABYLON.Color3(0.2, 0.2, 0.22);
      mat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
      break;
    
    case 'wood':
      mat.diffuseColor = new BABYLON.Color3(0.5, 0.25, 0.1);
      mat.ambientColor = new BABYLON.Color3(0.15, 0.08, 0.03);
      mat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      break;
    
    // İnşaat Blokları
    case 'brick':
      mat.diffuseColor = new BABYLON.Color3(0.7, 0.3, 0.2);
      mat.ambientColor = new BABYLON.Color3(0.2, 0.1, 0.06);
      mat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.15);
      break;
    
    case 'granite':
      mat.diffuseColor = new BABYLON.Color3(0.6, 0.45, 0.4);
      mat.ambientColor = new BABYLON.Color3(0.18, 0.14, 0.12);
      mat.specularColor = new BABYLON.Color3(0.25, 0.25, 0.25);
      break;
    
    case 'andesite':
      mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.52);
      mat.ambientColor = new BABYLON.Color3(0.15, 0.15, 0.16);
      mat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      break;
    
    case 'glass':
      mat.diffuseColor = new BABYLON.Color3(0.8, 0.9, 1.0);
      mat.alpha = 0.5;
      mat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
      mat.specularPower = 128;
      break;
    
    case 'amethyst':
      mat.diffuseColor = new BABYLON.Color3(0.6, 0.3, 0.8);
      mat.emissiveColor = new BABYLON.Color3(0.2, 0.1, 0.3);
      mat.specularColor = new BABYLON.Color3(0.7, 0.5, 0.8);
      mat.specularPower = 96;
      break;
    
    case 'chest':
      mat.diffuseColor = new BABYLON.Color3(0.55, 0.35, 0.15);
      mat.ambientColor = new BABYLON.Color3(0.18, 0.11, 0.05);
      mat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.15);
      break;
    
    // Sıvılar
    case 'water':
      mat.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
      mat.alpha = 0.7;
      mat.specularColor = new BABYLON.Color3(0.5, 0.7, 0.9);
      mat.specularPower = 64;
      break;
    
    case 'lava':
      mat.diffuseColor = new BABYLON.Color3(1.0, 0.3, 0.1);
      mat.emissiveColor = new BABYLON.Color3(0.8, 0.2, 0.0);
      mat.specularColor = new BABYLON.Color3(0.9, 0.4, 0.2);
      break;
    
    // Madenler
    case 'coal_ore':
      mat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
      mat.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      mat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
      break;
    
    case 'iron_ore':
      mat.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.75);
      mat.ambientColor = new BABYLON.Color3(0.2, 0.2, 0.22);
      mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      break;
    
    case 'copper_ore':
      mat.diffuseColor = new BABYLON.Color3(0.8, 0.5, 0.3);
      mat.ambientColor = new BABYLON.Color3(0.25, 0.15, 0.1);
      mat.specularColor = new BABYLON.Color3(0.5, 0.3, 0.2);
      break;
    
    case 'gold_ore':
      mat.diffuseColor = new BABYLON.Color3(0.9, 0.75, 0.2);
      mat.emissiveColor = new BABYLON.Color3(0.2, 0.15, 0.05);
      mat.specularColor = new BABYLON.Color3(0.95, 0.85, 0.5);
      mat.specularPower = 80;
      break;
    
    case 'diamond_ore':
      mat.diffuseColor = new BABYLON.Color3(0.3, 0.8, 0.9);
      mat.emissiveColor = new BABYLON.Color3(0.1, 0.3, 0.4);
      mat.specularColor = new BABYLON.Color3(0.5, 0.9, 1.0);
      mat.specularPower = 96;
      break;
    
    case 'lapis_ore':
      mat.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
      mat.emissiveColor = new BABYLON.Color3(0.05, 0.1, 0.2);
      mat.specularColor = new BABYLON.Color3(0.4, 0.6, 0.9);
      mat.specularPower = 70;
      break;
    
    case 'emerald_ore':
      mat.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.4);
      mat.emissiveColor = new BABYLON.Color3(0.05, 0.2, 0.1);
      mat.specularColor = new BABYLON.Color3(0.4, 0.9, 0.6);
      mat.specularPower = 90;
      break;
    
    case 'ruby_ore':
      mat.diffuseColor = new BABYLON.Color3(0.9, 0.1, 0.2);
      mat.emissiveColor = new BABYLON.Color3(0.3, 0.05, 0.05);
      mat.specularColor = new BABYLON.Color3(0.95, 0.3, 0.4);
      mat.specularPower = 85;
      break;
    
    case 'platinum_ore':
      mat.diffuseColor = new BABYLON.Color3(0.85, 0.85, 0.9);
      mat.emissiveColor = new BABYLON.Color3(0.15, 0.15, 0.2);
      mat.specularColor = new BABYLON.Color3(0.95, 0.95, 0.98);
      mat.specularPower = 100;
      break;
    
    case 'quartz_ore':
      mat.diffuseColor = new BABYLON.Color3(0.95, 0.95, 0.98);
      mat.emissiveColor = new BABYLON.Color3(0.15, 0.15, 0.15);
      mat.specularColor = new BABYLON.Color3(1.0, 1.0, 1.0);
      mat.specularPower = 110;
      break;
    
    default:
      mat.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
      mat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  }
  
  mat.specularPower = mat.specularPower || 32;
  return mat;
};

export const blockCategories = {
  basic: ['grass', 'dirt', 'stone', 'sand', 'gravel', 'cobblestone', 'clay', 'wood'],
  building: ['brick', 'granite', 'andesite', 'glass', 'amethyst'],
  special: ['chest'],
  liquids: ['water', 'lava'],
  ores: ['coal_ore', 'iron_ore', 'copper_ore', 'gold_ore', 'diamond_ore', 'lapis_ore', 'emerald_ore', 'ruby_ore', 'platinum_ore', 'quartz_ore']
};

export const blockNames = {
  grass: 'Çimen',
  dirt: 'Toprak',
  stone: 'Taş',
  sand: 'Kum',
  gravel: 'Çakıl',
  cobblestone: 'Kırık Taş',
  clay: 'Kil',
  wood: 'Tahta',
  brick: 'Tuğla',
  granite: 'Granit',
  andesite: 'Andezit',
  glass: 'Cam',
  amethyst: 'Ametist',
  chest: 'Sandık',
  water: 'Su',
  lava: 'Lav',
  coal_ore: 'Kömür',
  iron_ore: 'Demir',
  copper_ore: 'Bakır',
  gold_ore: 'Altın',
  diamond_ore: 'Elmas',
  lapis_ore: 'Lapis Lazuli',
  emerald_ore: 'Zümrüt',
  ruby_ore: 'Yakut',
  platinum_ore: 'Platin',
  quartz_ore: 'Kuvars'
};
