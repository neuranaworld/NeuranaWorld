// 🍎 Farm Dominion v2.1 - COMPLETE FRUITS & VEGETABLES DATABASE
// TAM 50 MEYVE + 50 SEBZE
// Tüm veriler meyveler.txt ve sebzeler.txt'den

import { BiomeTypes } from './biome_system.js';

/**
 * ============================================
 * TAM 50 MEYVE TÜRLERİ (meyveler.txt)
 * ============================================
 */

export const CompleteFruitDatabase = {
    // 1-10: Temel Meyveler
    apple: { id: 'apple', name: 'Apple', turkishName: 'Elma', tree: 'apple', color: 0xef5350, weight: 0.2, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    pear: { id: 'pear', name: 'Pear', turkishName: 'Armut', tree: 'pear', color: 0xffeb3b, weight: 0.15, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    orange: { id: 'orange', name: 'Orange', turkishName: 'Portakal', tree: 'orange', color: 0xff9800, weight: 0.2, season: 'winter', biome: [BiomeTypes.MEDITERRANEAN] },
    mandarin: { id: 'mandarin', name: 'Mandarin', turkishName: 'Mandalina', tree: 'mandarin', color: 0xff9800, weight: 0.15, season: 'winter', biome: [BiomeTypes.MEDITERRANEAN] },
    lemon: { id: 'lemon', name: 'Lemon', turkishName: 'Limon', tree: 'lemon', color: 0xffeb3b, weight: 0.1, season: 'all', biome: [BiomeTypes.MEDITERRANEAN] },
    grapefruit: { id: 'grapefruit', name: 'Grapefruit', turkishName: 'Greyfurt', tree: 'grapefruit', color: 0xffc107, weight: 0.3, season: 'winter', biome: [BiomeTypes.MEDITERRANEAN] },
    banana: { id: 'banana', name: 'Banana', turkishName: 'Muz', tree: 'banana', color: 0xffeb3b, weight: 0.12, season: 'all', biome: [BiomeTypes.TROPICAL_RAINFOREST] },
    strawberry: { id: 'strawberry', name: 'Strawberry', turkishName: 'Çilek', color: 0xef5350, weight: 0.015, season: 'spring', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    cherry: { id: 'cherry', name: 'Cherry', turkishName: 'Kiraz', tree: 'cherry', color: 0xef5350, weight: 0.008, season: 'summer', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    sour_cherry: { id: 'sour_cherry', name: 'Sour Cherry', turkishName: 'Vişne', tree: 'sour_cherry', color: 0xef5350, weight: 0.006, season: 'summer', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },

    // 11-20: Üzüm ve Kavunlar
    grape: { id: 'grape', name: 'Grape', turkishName: 'Üzüm', color: 0x7b1fa2, weight: 0.003, season: 'autumn', biome: [BiomeTypes.MEDITERRANEAN] },
    watermelon: { id: 'watermelon', name: 'Watermelon', turkishName: 'Karpuz', color: 0x4caf50, weight: 5.0, season: 'summer', biome: [BiomeTypes.MEDITERRANEAN] },
    melon: { id: 'melon', name: 'Melon', turkishName: 'Kavun', color: 0xffeb3b, weight: 2.0, season: 'summer', biome: [BiomeTypes.MEDITERRANEAN] },
    peach: { id: 'peach', name: 'Peach', turkishName: 'Şeftali', tree: 'peach', color: 0xffa726, weight: 0.15, season: 'summer', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    nectarine: { id: 'nectarine', name: 'Nectarine', turkishName: 'Nektarin', tree: 'nectarine', color: 0xff6347, weight: 0.14, season: 'summer', biome: [BiomeTypes.MEDITERRANEAN] },
    apricot: { id: 'apricot', name: 'Apricot', turkishName: 'Kayısı', tree: 'apricot', color: 0xffa726, weight: 0.05, season: 'summer', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    plum: { id: 'plum', name: 'Plum', turkishName: 'Erik', tree: 'plum', color: 0x7b1fa2, weight: 0.08, season: 'summer', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    pomegranate: { id: 'pomegranate', name: 'Pomegranate', turkishName: 'Nar', tree: 'pomegranate', color: 0xef5350, weight: 0.25, season: 'autumn', biome: [BiomeTypes.MEDITERRANEAN] },
    fig: { id: 'fig', name: 'Fig', turkishName: 'İncir', tree: 'fig', color: 0x7b1fa2, weight: 0.05, season: 'summer', biome: [BiomeTypes.MEDITERRANEAN] },
    date: { id: 'date', name: 'Date', turkishName: 'Hurma', tree: 'date_palm', color: 0x8b6f47, weight: 0.02, season: 'summer', biome: [BiomeTypes.HOT_DESERT] },

    // 21-30: Tropikal ve Egzotik
    avocado: { id: 'avocado', name: 'Avocado', turkishName: 'Avokado', tree: 'avocado', color: 0x4d7c3d, weight: 0.2, season: 'spring', biome: [BiomeTypes.TROPICAL_RAINFOREST] },
    kiwi: { id: 'kiwi', name: 'Kiwi', turkishName: 'Kivi', color: 0x9acd32, weight: 0.08, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    mango: { id: 'mango', name: 'Mango', turkishName: 'Mango', tree: 'mango', color: 0xffa726, weight: 0.4, season: 'summer', biome: [BiomeTypes.TROPICAL_RAINFOREST] },
    pineapple: { id: 'pineapple', name: 'Pineapple', turkishName: 'Ananas', color: 0xffeb3b, weight: 1.5, season: 'all', biome: [BiomeTypes.TROPICAL_RAINFOREST] },
    papaya: { id: 'papaya', name: 'Papaya', turkishName: 'Papaya', color: 0xff9800, weight: 0.8, season: 'all', biome: [BiomeTypes.TROPICAL_RAINFOREST] },
    raspberry: { id: 'raspberry', name: 'Raspberry', turkishName: 'Ahududu', color: 0xef5350, weight: 0.005, season: 'summer', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    blackberry: { id: 'blackberry', name: 'Blackberry', turkishName: 'Böğürtlen', color: 0x1a1a1a, weight: 0.005, season: 'summer', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    blueberry: { id: 'blueberry', name: 'Blueberry', turkishName: 'Yaban Mersini', color: 0x1976d2, weight: 0.002, season: 'summer', biome: [BiomeTypes.BOREAL] },
    mulberry: { id: 'mulberry', name: 'Mulberry', turkishName: 'Dut', tree: 'mulberry', color: 0x7b1fa2, weight: 0.003, season: 'summer', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    quince: { id: 'quince', name: 'Quince', turkishName: 'Ayva', tree: 'quince', color: 0xffc107, weight: 0.25, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },

    // 31-40: Özel Meyveler
    persimmon: { id: 'persimmon', name: 'Persimmon', turkishName: 'Trabzon Hurması', tree: 'persimmon', color: 0xff5722, weight: 0.15, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    cornus: { id: 'cornus', name: 'Cornus', turkishName: 'Kızılcık', tree: 'cornus', color: 0xef5350, weight: 0.003, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    medlar: { id: 'medlar', name: 'Medlar', turkishName: 'Muşmula', tree: 'medlar', color: 0x8b4513, weight: 0.04, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    cherry_tomato: { id: 'cherry_tomato', name: 'Cherry Tomato', turkishName: 'Kokteyl Domates', color: 0xef5350, weight: 0.02, season: 'summer', biome: [BiomeTypes.MEDITERRANEAN] },
    passion_fruit: { id: 'passion_fruit', name: 'Passion Fruit', turkishName: 'Marakuya', color: 0x7b1fa2, weight: 0.06, season: 'all', biome: [BiomeTypes.TROPICAL_RAINFOREST] },
    lychee: { id: 'lychee', name: 'Lychee', turkishName: 'Liçi', color: 0xef5350, weight: 0.015, season: 'summer', biome: [BiomeTypes.TROPICAL_RAINFOREST] },
    guava: { id: 'guava', name: 'Guava', turkishName: 'Guava', color: 0x9acd32, weight: 0.15, season: 'all', biome: [BiomeTypes.TROPICAL_RAINFOREST] },
    pomelo: { id: 'pomelo', name: 'Pomelo', turkishName: 'Pomelo', color: 0xffeb3b, weight: 1.0, season: 'winter', biome: [BiomeTypes.TROPICAL_RAINFOREST] },
    blackcurrant: { id: 'blackcurrant', name: 'Blackcurrant', turkishName: 'Karahıdır', color: 0x1a1a1a, weight: 0.002, season: 'summer', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    bitter_orange: { id: 'bitter_orange', name: 'Bitter Orange', turkishName: 'Turunç', color: 0xff9800, weight: 0.15, season: 'winter', biome: [BiomeTypes.MEDITERRANEAN] },

    // 41-50: Ceviz ve Sert Kabuklu
    indian_persimmon: { id: 'indian_persimmon', name: 'Indian Persimmon', turkishName: 'Hint Hurması', color: 0xff5722, weight: 0.12, season: 'autumn', biome: [BiomeTypes.TROPICAL_DRY] },
    rosehip: { id: 'rosehip', name: 'Rosehip', turkishName: 'Kuşburnu', color: 0xef5350, weight: 0.003, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    myrtle_berry: { id: 'myrtle_berry', name: 'Myrtle Berry', turkishName: 'Mersin Meyvesi', color: 0x1a1a4d, weight: 0.002, season: 'autumn', biome: [BiomeTypes.MEDITERRANEAN] },
    feijoa: { id: 'feijoa', name: 'Feijoa', turkishName: 'Feijoa', color: 0x9acd32, weight: 0.08, season: 'autumn', biome: [BiomeTypes.MEDITERRANEAN] },
    pecan: { id: 'pecan', name: 'Pecan', turkishName: 'Pikan Cevizi', color: 0x8b6f47, weight: 0.01, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    walnut: { id: 'walnut', name: 'Walnut', turkishName: 'Ceviz', tree: 'walnut', color: 0x8b6f47, weight: 0.05, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    almond: { id: 'almond', name: 'Almond', turkishName: 'Badem', tree: 'almond', color: 0xd4c4b4, weight: 0.004, season: 'summer', biome: [BiomeTypes.MEDITERRANEAN] },
    hazelnut: { id: 'hazelnut', name: 'Hazelnut', turkishName: 'Fındık', tree: 'hazelnut', color: 0x8b6f47, weight: 0.003, season: 'autumn', biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    pistachio: { id: 'pistachio', name: 'Pistachio', turkishName: 'Antep Fıstığı', tree: 'pistachio', color: 0x9acd32, weight: 0.002, season: 'autumn', biome: [BiomeTypes.MEDITERRANEAN] },
    coconut: { id: 'coconut', name: 'Coconut', turkishName: 'Hindistan Cevizi', tree: 'coconut_palm', color: 0x8b6f47, weight: 1.5, season: 'all', biome: [BiomeTypes.TROPICAL_RAINFOREST] }
};

/**
 * ============================================
 * TAM 50 SEBZE TÜRLERİ (sebzeler.txt)
 * ============================================
 */

export const CompleteVegetableDatabase = {
    // 1-10: Temel Sebzeler
    tomato: { id: 'tomato', name: 'Tomato', turkishName: 'Domates', height: [0.5, 1.5], color: 0x4caf50, fruitColor: 0xef5350, growthTime: 90, biome: [BiomeTypes.TEMPERATE_DECIDUOUS, BiomeTypes.MEDITERRANEAN] },
    potato: { id: 'potato', name: 'Potato', turkishName: 'Patates', height: [0.3, 0.6], color: 0x4d7c4d, harvestColor: 0xd4b896, growthTime: 120, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    carrot: { id: 'carrot', name: 'Carrot', turkishName: 'Havuç', height: [0.2, 0.4], color: 0x4d9d4d, harvestColor: 0xff9800, growthTime: 80, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    onion: { id: 'onion', name: 'Onion', turkishName: 'Soğan', height: [0.3, 0.5], color: 0x6d8d6d, harvestColor: 0xffc107, growthTime: 100, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    lettuce: { id: 'lettuce', name: 'Lettuce', turkishName: 'Marul', height: [0.2, 0.4], color: 0x7cb342, growthTime: 60, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    cabbage: { id: 'cabbage', name: 'Cabbage', turkishName: 'Lahana', height: [0.3, 0.5], color: 0x6d9d6d, growthTime: 100, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    cucumber: { id: 'cucumber', name: 'Cucumber', turkishName: 'Salatalık', height: [0.3, 2.0], color: 0x4d9d4d, fruitColor: 0x4d9d4d, growthTime: 70, biome: [BiomeTypes.MEDITERRANEAN] },
    pepper: { id: 'pepper', name: 'Pepper', turkishName: 'Biber', height: [0.5, 1.0], color: 0x5d8d5d, fruitColor: 0xef5350, growthTime: 85, biome: [BiomeTypes.MEDITERRANEAN] },
    eggplant: { id: 'eggplant', name: 'Eggplant', turkishName: 'Patlıcan', height: [0.6, 1.2], color: 0x4d7c4d, fruitColor: 0x4a148c, growthTime: 95, biome: [BiomeTypes.MEDITERRANEAN] },
    zucchini: { id: 'zucchini', name: 'Zucchini', turkishName: 'Kabak', height: [0.4, 0.8], color: 0x6d8d6d, fruitColor: 0x7cb342, growthTime: 65, biome: [BiomeTypes.MEDITERRANEAN] },

    // 11-20: Diğer Yaygın Sebzeler
    pumpkin: { id: 'pumpkin', name: 'Pumpkin', turkishName: 'Balkabağı', height: [0.3, 0.6], color: 0x7cb342, fruitColor: 0xff9800, growthTime: 110, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    garlic: { id: 'garlic', name: 'Garlic', turkishName: 'Sarımsak', height: [0.3, 0.6], color: 0x6d8d6d, harvestColor: 0xf5f5f5, growthTime: 120, biome: [BiomeTypes.MEDITERRANEAN] },
    spinach: { id: 'spinach', name: 'Spinach', turkishName: 'Ispanak', height: [0.2, 0.4], color: 0x2d6b2d, growthTime: 50, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    broccoli: { id: 'broccoli', name: 'Broccoli', turkishName: 'Brokoli', height: [0.4, 0.8], color: 0x4d7c4d, growthTime: 85, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    cauliflower: { id: 'cauliflower', name: 'Cauliflower', turkishName: 'Karnabahar', height: [0.4, 0.7], color: 0x6d8d6d, harvestColor: 0xf5f5f5, growthTime: 90, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    corn: { id: 'corn', name: 'Corn', turkishName: 'Mısır', height: [1.5, 2.5], color: 0x7cb342, fruitColor: 0xffeb3b, growthTime: 100, biome: [BiomeTypes.TEMPERATE_GRASSLAND] },
    beans: { id: 'beans', name: 'Beans', turkishName: 'Fasulye', height: [0.4, 2.0], color: 0x4d9d4d, fruitColor: 0x4d9d4d, growthTime: 70, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    peas: { id: 'peas', name: 'Peas', turkishName: 'Bezelye', height: [0.5, 1.5], color: 0x6d9d6d, fruitColor: 0x6d9d6d, growthTime: 65, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    radish: { id: 'radish', name: 'Radish', turkishName: 'Turp', height: [0.2, 0.3], color: 0x6d8d6d, harvestColor: 0xef5350, growthTime: 35, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    beet: { id: 'beet', name: 'Beet', turkishName: 'Pancar', height: [0.3, 0.5], color: 0x5d7c5d, harvestColor: 0x880e4f, growthTime: 75, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },

    // 21-30: Yeşillikler ve Otlar
    parsley: { id: 'parsley', name: 'Parsley', turkishName: 'Maydanoz', height: [0.2, 0.4], color: 0x2d6b2d, growthTime: 80, biome: [BiomeTypes.MEDITERRANEAN] },
    dill: { id: 'dill', name: 'Dill', turkishName: 'Dereotu', height: [0.3, 0.6], color: 0x4d8d4d, growthTime: 70, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    mint: { id: 'mint', name: 'Mint', turkishName: 'Nane', height: [0.2, 0.5], color: 0x3d7c3d, growthTime: 90, biome: [BiomeTypes.MEDITERRANEAN] },
    basil: { id: 'basil', name: 'Basil', turkishName: 'Fesleğen', height: [0.3, 0.6], color: 0x4d8d4d, growthTime: 75, biome: [BiomeTypes.MEDITERRANEAN] },
    celery: { id: 'celery', name: 'Celery', turkishName: 'Kereviz', height: [0.4, 0.7], color: 0x7cb342, growthTime: 120, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    leek: { id: 'leek', name: 'Leek', turkishName: 'Pırasa', height: [0.4, 0.8], color: 0x6d8d6d, growthTime: 120, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    asparagus: { id: 'asparagus', name: 'Asparagus', turkishName: 'Kuşkonmaz', height: [0.5, 1.0], color: 0x4d8d4d, growthTime: 730, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    artichoke: { id: 'artichoke', name: 'Artichoke', turkishName: 'Enginar', height: [0.6, 1.2], color: 0x6d8d6d, growthTime: 150, biome: [BiomeTypes.MEDITERRANEAN] },
    chard: { id: 'chard', name: 'Chard', turkishName: 'Pazı', height: [0.3, 0.6], color: 0x7cb342, growthTime: 60, biome: [BiomeTypes.MEDITERRANEAN] },
    kale: { id: 'kale', name: 'Kale', turkishName: 'Karalahana', height: [0.4, 0.8], color: 0x2d6b2d, growthTime: 80, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },

    // 31-40: Kök Sebzeler ve Diğerleri
    turnip: { id: 'turnip', name: 'Turnip', turkishName: 'Şalgam', height: [0.3, 0.5], color: 0x6d8d6d, harvestColor: 0xef5350, growthTime: 70, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    sweet_potato: { id: 'sweet_potato', name: 'Sweet Potato', turkishName: 'Tatlı Patates', height: [0.3, 0.5], color: 0x5d7c5d, harvestColor: 0xff5722, growthTime: 130, biome: [BiomeTypes.TROPICAL_DRY] },
    okra: { id: 'okra', name: 'Okra', turkishName: 'Bamya', height: [0.6, 1.2], color: 0x5d8d5d, fruitColor: 0x7cb342, growthTime: 70, biome: [BiomeTypes.MEDITERRANEAN] },
    brussels_sprouts: { id: 'brussels_sprouts', name: 'Brussels Sprouts', turkishName: 'Brüksel Lahanası', height: [0.6, 1.0], color: 0x6d8d6d, growthTime: 110, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    kohlrabi: { id: 'kohlrabi', name: 'Kohlrabi', turkishName: 'Alabaş', height: [0.3, 0.5], color: 0x7cb342, growthTime: 65, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    fennel: { id: 'fennel', name: 'Fennel', turkishName: 'Rezene', height: [0.5, 1.0], color: 0x6d8d6d, growthTime: 90, biome: [BiomeTypes.MEDITERRANEAN] },
    rhubarb: { id: 'rhubarb', name: 'Rhubarb', turkishName: 'Ravent', height: [0.5, 1.0], color: 0xef5350, growthTime: 730, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    squash: { id: 'squash', name: 'Squash', turkishName: 'Sakız Kabağı', height: [0.4, 0.8], color: 0x7cb342, fruitColor: 0xff9800, growthTime: 95, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    rutabaga: { id: 'rutabaga', name: 'Rutabaga', turkishName: 'Yemlik Şalgam', height: [0.3, 0.5], color: 0x6d8d6d, harvestColor: 0xffa726, growthTime: 100, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    parsnip: { id: 'parsnip', name: 'Parsnip', turkishName: 'Yaban Havucu', height: [0.3, 0.5], color: 0x6d8d6d, harvestColor: 0xf5f5dc, growthTime: 120, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },

    // 41-50: Diğer Sebzeler
    chili_pepper: { id: 'chili_pepper', name: 'Chili Pepper', turkishName: 'Acı Biber', height: [0.4, 0.8], color: 0x5d8d5d, fruitColor: 0xef5350, growthTime: 90, biome: [BiomeTypes.TROPICAL_DRY] },
    bell_pepper: { id: 'bell_pepper', name: 'Bell Pepper', turkishName: 'Dolma Biber', height: [0.5, 1.0], color: 0x5d8d5d, fruitColor: 0xffeb3b, growthTime: 85, biome: [BiomeTypes.MEDITERRANEAN] },
    green_bean: { id: 'green_bean', name: 'Green Bean', turkishName: 'Taze Fasulye', height: [0.4, 2.0], color: 0x4d9d4d, fruitColor: 0x4d9d4d, growthTime: 65, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    snow_pea: { id: 'snow_pea', name: 'Snow Pea', turkishName: 'Kar Bezelyesi', height: [0.5, 1.5], color: 0x6d9d6d, fruitColor: 0x6d9d6d, growthTime: 60, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    watercress: { id: 'watercress', name: 'Watercress', turkishName: 'Su Teresi', height: [0.1, 0.3], color: 0x2d6b2d, growthTime: 45, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    arugula: { id: 'arugula', name: 'Arugula', turkishName: 'Roka', height: [0.2, 0.4], color: 0x4d8d4d, growthTime: 40, biome: [BiomeTypes.MEDITERRANEAN] },
    endive: { id: 'endive', name: 'Endive', turkishName: 'Hindiba', height: [0.2, 0.4], color: 0x7cb342, growthTime: 85, biome: [BiomeTypes.MEDITERRANEAN] },
    radicchio: { id: 'radicchio', name: 'Radicchio', turkishName: 'Kırmızı Hindiba', height: [0.2, 0.4], color: 0x7b1fa2, growthTime: 90, biome: [BiomeTypes.MEDITERRANEAN] },
    horseradish: { id: 'horseradish', name: 'Horseradish', turkishName: 'Yaban Turpu', height: [0.3, 0.6], color: 0x6d8d6d, harvestColor: 0xf5f5f5, growthTime: 150, biome: [BiomeTypes.TEMPERATE_DECIDUOUS] },
    ginger: { id: 'ginger', name: 'Ginger', turkishName: 'Zencefil', height: [0.5, 1.0], color: 0x7cb342, harvestColor: 0xd4b896, growthTime: 300, biome: [BiomeTypes.TROPICAL_RAINFOREST] }
};

console.log('🍎 Complete Fruits & Vegetables Database loaded!');
console.log(`   Fruits: ${Object.keys(CompleteFruitDatabase).length}`);
console.log(`   Vegetables: ${Object.keys(CompleteVegetableDatabase).length}`);

export default { CompleteFruitDatabase, CompleteVegetableDatabase };
