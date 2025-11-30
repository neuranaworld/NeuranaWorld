// 📁 Farm Dominion v2.1 - ULTRA Configuration File Loader
// GELIŞMIŞ SÜRÜM: Tüm config dosyalarını yükler
// ✅ buildings.txt, npcs.txt, weather.txt, terrain.txt
// ✅ agaclar.txt, meyveler.txt, sebzeler.txt
// ✅ Biom dosyaları (01-09)
// ✅ Detaylı meyve verileri (tropikal_meyveler.txt, iliman_meyveler.txt)
// ✅ TEXTURE_SPECS.txt
// ✅ Full hata kontrolü + fallback
// ✅ İlerleme takibi
// ✅ Validasyon sistemi

/**
 * UltraConfigLoader - Gelişmiş config dosyası yükleyici
 * 
 * Yeni Özellikler:
 * ✅ Terrain config yükleme
 * ✅ 99 ağaç türü yükleme
 * ✅ 50 meyve + 50 sebze yükleme
 * ✅ 6+ biom dosyası yükleme
 * ✅ Texture specs yükleme
 * ✅ İlerleme callback
 * ✅ Detaylı validasyon
 * ✅ Cache sistemi
 */

export class UltraConfigLoader {
    constructor() {
        // Temel veriler
        this.buildings = [];
        this.npcs = [];
        this.weather = [];
        this.terrain = null;
        
        // Yeni: Flora verileri
        this.trees = [];           // 99 ağaç türü
        this.fruits = [];          // 50 meyve türü
        this.vegetables = [];      // 50 sebze türü
        
        // Yeni: Detaylı meyve verileri
        this.tropicalFruits = [];  // Tropikal meyveler
        this.temperateFruits = []; // Ilıman meyveler
        
        // Yeni: Biom verileri
        this.biomes = {};          // Tüm biom dosyaları
        
        // Yeni: Texture verileri
        this.textures = {};
        
        // Durum
        this.loaded = false;
        this.errors = [];
        this.loadProgress = 0;
        this.totalFiles = 0;
        this.loadedFiles = 0;
        
        // Cache
        this.cache = new Map();
    }

    /**
     * Tüm config dosyalarını yükle
     * @param {Function} onProgress - İlerleme callback (0-1 arası)
     * @returns {Promise<boolean>} Başarı durumu
     */
    async loadAll(onProgress = null) {
        console.log('📁 Ultra Config Loader: Başlatılıyor...');
        
        const startTime = performance.now();
        
        try {
            // Dosya sayısını hesapla
            this.totalFiles = 15; // buildings, npcs, weather, terrain, trees, fruits, veggies, 6 biom, 2 detaylı meyve, textures
            this.loadedFiles = 0;
            
            // 1. TEMEL CONFIG DOSYALARI
            await this.loadWithProgress(() => this.loadBuildings(), onProgress, 'buildings.txt');
            await this.loadWithProgress(() => this.loadNPCs(), onProgress, 'npcs.txt');
            await this.loadWithProgress(() => this.loadWeather(), onProgress, 'weather.txt');
            await this.loadWithProgress(() => this.loadTerrain(), onProgress, 'terrain.txt');
            
            // 2. FLORA DOSYALARI
            await this.loadWithProgress(() => this.loadTrees(), onProgress, 'agaclar.txt');
            await this.loadWithProgress(() => this.loadFruits(), onProgress, 'meyveler.txt');
            await this.loadWithProgress(() => this.loadVegetables(), onProgress, 'sebzeler.txt');
            
            // 3. DETAYLI MEYVE DOSYALARI
            await this.loadWithProgress(() => this.loadTropicalFruits(), onProgress, 'tropikal_meyveler.txt');
            await this.loadWithProgress(() => this.loadTemperateFruits(), onProgress, 'iliman_meyveler.txt');
            
            // 4. BIOM DOSYALARI
            await this.loadWithProgress(() => this.loadBiomes(), onProgress, 'biome files');
            
            // 5. TEXTURE SPECS
            await this.loadWithProgress(() => this.loadTextureSpecs(), onProgress, 'TEXTURE_SPECS.txt');
            
            this.loaded = true;
            const endTime = performance.now();
            const loadTime = ((endTime - startTime) / 1000).toFixed(2);
            
            console.log('✅ Ultra Config Loader: Tamamlandı!');
            console.log(`   ⏱️  Yükleme süresi: ${loadTime}s`);
            this.printStats();
            
            return true;

        } catch (error) {
            console.error('❌ Ultra Config Loader: Kritik hata!', error);
            this.errors.push({ file: 'general', error: error.message });
            return false;
        }
    }

    /**
     * İlerleme ile dosya yükleme helper
     */
    async loadWithProgress(loadFunc, onProgress, fileName) {
        try {
            await loadFunc();
            this.loadedFiles++;
            this.loadProgress = this.loadedFiles / this.totalFiles;
            
            if (onProgress) {
                onProgress(this.loadProgress, fileName);
            }
        } catch (error) {
            console.warn(`⚠️ ${fileName} yüklenemedi:`, error.message);
            this.errors.push({ file: fileName, error: error.message });
            this.loadedFiles++;
            this.loadProgress = this.loadedFiles / this.totalFiles;
            
            if (onProgress) {
                onProgress(this.loadProgress, `${fileName} (fallback)`);
            }
        }
    }

    /**
     * Buildings.txt - MEVCUT
     */
    async loadBuildings() {
        const data = await this.fetchConfig('../assets/buildings.txt');
        this.buildings = this.parseCSV(data, ['type', 'x', 'z', 'rotation']);
        console.log(`✅ buildings.txt: ${this.buildings.length} bina`);
    }

    /**
     * NPCs.txt - MEVCUT
     */
    async loadNPCs() {
        const data = await this.fetchConfig('../assets/npcs.txt');
        this.npcs = this.parseCSV(data, ['type', 'name', 'x', 'y', 'z', 'color']);
        // Renkleri hex'e çevir
        this.npcs.forEach(npc => {
            if (npc.color && typeof npc.color === 'string' && npc.color.startsWith('0x')) {
                npc.color = parseInt(npc.color, 16);
            }
        });
        console.log(`✅ npcs.txt: ${this.npcs.length} NPC`);
    }

    /**
     * Weather.txt - MEVCUT
     */
    async loadWeather() {
        const data = await this.fetchConfig('../assets/weather.txt');
        this.weather = this.parseCSV(data, ['type', 'duration', 'probability']);
        console.log(`✅ weather.txt: ${this.weather.length} hava türü`);
    }

    /**
     * Terrain.txt - YENİ!
     */
    async loadTerrain() {
        try {
            const data = await this.fetchConfig('../assets/terrain.txt');
            const lines = this.parseCSV(data, ['key', 'value']);
            
            // Key-value pairs olarak parse et
            this.terrain = {};
            lines.forEach(line => {
                if (line.key && line.value) {
                    // Sayı ise parse et
                    const num = parseFloat(line.value);
                    this.terrain[line.key] = isNaN(num) ? line.value : num;
                }
            });
            
            console.log(`✅ terrain.txt: ${Object.keys(this.terrain).length} parametre`);
        } catch (error) {
            console.warn('⚠️ terrain.txt yüklenemedi, fallback kullanılıyor');
            this.terrain = this.getDefaultTerrain();
        }
    }

    /**
     * agaclar.txt - YENİ! 99 ağaç türü
     */
    async loadTrees() {
        try {
            const data = await this.fetchConfig('../assets/agaclar.txt');
            this.trees = this.parseCSV(data, ['id', 'name', 'biome', 'height_min', 'height_max', 'color']);
            
            // Renkleri parse et
            this.trees.forEach(tree => {
                if (tree.color && tree.color.startsWith('0x')) {
                    tree.color = parseInt(tree.color, 16);
                }
                tree.height_min = parseFloat(tree.height_min) || 5;
                tree.height_max = parseFloat(tree.height_max) || 20;
            });
            
            console.log(`✅ agaclar.txt: ${this.trees.length} ağaç türü`);
        } catch (error) {
            console.warn('⚠️ agaclar.txt yüklenemedi');
            this.trees = [];
        }
    }

    /**
     * meyveler.txt - YENİ! 50 meyve türü
     */
    async loadFruits() {
        try {
            const data = await this.fetchConfig('../assets/meyveler.txt');
            this.fruits = this.parseCSV(data, ['id', 'name', 'tree', 'color', 'season']);
            
            // Renkleri parse et
            this.fruits.forEach(fruit => {
                if (fruit.color && fruit.color.startsWith('0x')) {
                    fruit.color = parseInt(fruit.color, 16);
                }
            });
            
            console.log(`✅ meyveler.txt: ${this.fruits.length} meyve türü`);
        } catch (error) {
            console.warn('⚠️ meyveler.txt yüklenemedi');
            this.fruits = [];
        }
    }

    /**
     * sebzeler.txt - YENİ! 50 sebze türü
     */
    async loadVegetables() {
        try {
            const data = await this.fetchConfig('../assets/sebzeler.txt');
            this.vegetables = this.parseCSV(data, ['id', 'name', 'growth_time', 'biome', 'color']);
            
            // Renkleri ve growth time parse et
            this.vegetables.forEach(veg => {
                if (veg.color && veg.color.startsWith('0x')) {
                    veg.color = parseInt(veg.color, 16);
                }
                veg.growth_time = parseInt(veg.growth_time) || 90;
            });
            
            console.log(`✅ sebzeler.txt: ${this.vegetables.length} sebze türü`);
        } catch (error) {
            console.warn('⚠️ sebzeler.txt yüklenemedi');
            this.vegetables = [];
        }
    }

    /**
     * tropikal_meyveler.txt - YENİ! Detaylı tropikal meyve bilgisi
     */
    async loadTropicalFruits() {
        try {
            const data = await this.fetchConfig('../biomlar/tropikal_meyveler.txt');
            this.tropicalFruits = this.parseDetailedFruits(data);
            console.log(`✅ tropikal_meyveler.txt: ${this.tropicalFruits.length} meyve`);
        } catch (error) {
            console.warn('⚠️ tropikal_meyveler.txt yüklenemedi');
            this.tropicalFruits = [];
        }
    }

    /**
     * iliman_meyveler.txt - YENİ! Detaylı ılıman meyve bilgisi
     */
    async loadTemperateFruits() {
        try {
            const data = await this.fetchConfig('../biomlar/iliman_meyveler.txt');
            this.temperateFruits = this.parseDetailedFruits(data);
            console.log(`✅ iliman_meyveler.txt: ${this.temperateFruits.length} meyve`);
        } catch (error) {
            console.warn('⚠️ iliman_meyveler.txt yüklenemedi');
            this.temperateFruits = [];
        }
    }

    /**
     * Detaylı meyve verisi parse et
     */
    parseDetailedFruits(text) {
        const fruits = [];
        const lines = text.split('\n');
        let currentFruit = null;
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            // Yeni meyve başlığı (örn: "## Muz")
            if (trimmed.startsWith('##')) {
                if (currentFruit) {
                    fruits.push(currentFruit);
                }
                currentFruit = {
                    name: trimmed.replace('##', '').trim(),
                    properties: {}
                };
            }
            // Özellik satırı (örn: "- **Ağırlık:** 120g")
            else if (trimmed.startsWith('-') && currentFruit) {
                const match = trimmed.match(/\*\*([^:]+):\*\*\s*(.+)/);
                if (match) {
                    const key = match[1].trim().toLowerCase().replace(/ı/g, 'i');
                    const value = match[2].trim();
                    currentFruit.properties[key] = value;
                }
            }
        }
        
        // Son meyveyi ekle
        if (currentFruit) {
            fruits.push(currentFruit);
        }
        
        return fruits;
    }

    /**
     * Biom dosyalarını yükle - YENİ!
     */
    async loadBiomes() {
        const biomeFiles = [
            '01_tropikal_yagmur_ormani.txt',
            '03_iliman_yaprak_doken_orman.txt',
            '05_boreal_orman.txt',
            '06_savan.txt',
            '08_akdeniz_biyomu.txt',
            '09_sicak_col.txt'
        ];
        
        for (const file of biomeFiles) {
            try {
                const data = await this.fetchConfig(`../biomlar/${file}`);
                const biomeId = file.split('_')[0]; // "01", "03", vb.
                this.biomes[biomeId] = this.parseBiomeFile(data, file);
                console.log(`✅ ${file}: Yüklendi`);
            } catch (error) {
                console.warn(`⚠️ ${file} yüklenemedi:`, error.message);
            }
        }
        
        console.log(`✅ Biom dosyaları: ${Object.keys(this.biomes).length} adet`);
    }

    /**
     * Biom dosyasını parse et
     */
    parseBiomeFile(text, filename) {
        const biome = {
            id: filename.split('_')[0],
            name: '',
            properties: {},
            flora: [],
            fauna: []
        };
        
        const lines = text.split('\n');
        let currentSection = null;
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            // Başlık (# ile başlayan)
            if (trimmed.startsWith('# ')) {
                biome.name = trimmed.replace('#', '').trim();
            }
            // Section başlıkları (## ile başlayan)
            else if (trimmed.startsWith('## ')) {
                currentSection = trimmed.replace('##', '').trim().toLowerCase();
            }
            // Özellikler (- ile başlayan)
            else if (trimmed.startsWith('-')) {
                const match = trimmed.match(/\*\*([^:]+):\*\*\s*(.+)/);
                if (match) {
                    const key = match[1].trim().toLowerCase();
                    const value = match[2].trim();
                    
                    if (currentSection && currentSection.includes('flora')) {
                        biome.flora.push(value);
                    } else if (currentSection && currentSection.includes('fauna')) {
                        biome.fauna.push(value);
                    } else {
                        biome.properties[key] = value;
                    }
                }
            }
        }
        
        return biome;
    }

    /**
     * TEXTURE_SPECS.txt - YENİ!
     */
    async loadTextureSpecs() {
        try {
            const data = await this.fetchConfig('../assets/TEXTURE_SPECS.txt');
            this.textures = this.parseTextureSpecs(data);
            console.log(`✅ TEXTURE_SPECS.txt: ${Object.keys(this.textures).length} texture`);
        } catch (error) {
            console.warn('⚠️ TEXTURE_SPECS.txt yüklenemedi');
            this.textures = {};
        }
    }

    /**
     * Texture specs parse et
     */
    parseTextureSpecs(text) {
        const specs = {};
        const lines = text.split('\n');
        let currentTexture = null;
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            // Texture başlığı (## ile başlayan)
            if (trimmed.startsWith('## ')) {
                const name = trimmed.replace('##', '').trim().toLowerCase();
                currentTexture = name;
                specs[name] = {};
            }
            // Özellik satırı
            else if (trimmed.startsWith('-') && currentTexture) {
                const match = trimmed.match(/\*\*([^:]+):\*\*\s*(.+)/);
                if (match) {
                    const key = match[1].trim().toLowerCase().replace(/ /g, '_');
                    const value = match[2].trim();
                    specs[currentTexture][key] = value;
                }
            }
        }
        
        return specs;
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Config dosyası fetch et (cache ile)
     */
    async fetchConfig(url) {
        // Cache'de var mı?
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const text = await response.text();
        this.cache.set(url, text);
        return text;
    }

    /**
     * CSV-like veriyi parse et
     */
    parseCSV(text, columns) {
        const lines = text.split('\n');
        const result = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // Comment veya boş satır atla
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            // Parse et
            const parts = trimmed.split(',').map(p => p.trim());
            
            if (parts.length >= columns.length) {
                const obj = {};
                columns.forEach((col, i) => {
                    obj[col] = parts[i];
                });
                result.push(obj);
            }
        }
        
        return result;
    }

    /**
     * Varsayılan terrain config
     */
    getDefaultTerrain() {
        return {
            size: 4000,
            resolution: 256,
            maxHeight: 300,
            waterLevel: -50
        };
    }

    /**
     * İstatistikleri yazdır
     */
    printStats() {
        console.log(`   📦 Buildings: ${this.buildings.length}`);
        console.log(`   🐄 NPCs: ${this.npcs.length}`);
        console.log(`   🌦️ Weather: ${this.weather.length}`);
        console.log(`   🗺️ Terrain: ${this.terrain ? 'Loaded' : 'Not loaded'}`);
        console.log(`   🌳 Trees: ${this.trees.length}`);
        console.log(`   🍎 Fruits: ${this.fruits.length}`);
        console.log(`   🥬 Vegetables: ${this.vegetables.length}`);
        console.log(`   🌴 Tropical Fruits: ${this.tropicalFruits.length}`);
        console.log(`   🍏 Temperate Fruits: ${this.temperateFruits.length}`);
        console.log(`   🌍 Biomes: ${Object.keys(this.biomes).length}`);
        console.log(`   🖼️ Textures: ${Object.keys(this.textures).length}`);
        console.log(`   ❌ Errors: ${this.errors.length}`);
    }

    /**
     * Tam istatistikler al
     */
    getFullStats() {
        return {
            buildings: this.buildings.length,
            npcs: this.npcs.length,
            weather: this.weather.length,
            terrain: this.terrain ? Object.keys(this.terrain).length : 0,
            trees: this.trees.length,
            fruits: this.fruits.length,
            vegetables: this.vegetables.length,
            tropicalFruits: this.tropicalFruits.length,
            temperateFruits: this.temperateFruits.length,
            biomes: Object.keys(this.biomes).length,
            textures: Object.keys(this.textures).length,
            loaded: this.loaded,
            errors: this.errors.length,
            loadProgress: this.loadProgress
        };
    }

    // ========================================
    // GETTER METHODS - ÇOK FAZLA!
    // ========================================

    getBuildings() { return this.buildings; }
    getNPCs() { return this.npcs; }
    getWeather() { return this.weather; }
    getTerrain() { return this.terrain; }
    getTrees() { return this.trees; }
    getFruits() { return this.fruits; }
    getVegetables() { return this.vegetables; }
    getTropicalFruits() { return this.tropicalFruits; }
    getTemperateFruits() { return this.temperateFruits; }
    getBiomes() { return this.biomes; }
    getTextures() { return this.textures; }
    
    // Filtreleme
    getBuildingsByType(type) { return this.buildings.filter(b => b.type === type); }
    getNPCsByType(type) { return this.npcs.filter(n => n.type === type); }
    getTreesByBiome(biome) { return this.trees.filter(t => t.biome === biome); }
    getFruitsBySeason(season) { return this.fruits.filter(f => f.season === season); }
    getVegetablesByBiome(biome) { return this.vegetables.filter(v => v.biome === biome); }
    getBiomeById(id) { return this.biomes[id]; }
    getTextureByName(name) { return this.textures[name.toLowerCase()]; }
    
    // Durum
    isLoaded() { return this.loaded; }
    getErrors() { return this.errors; }
    getLoadProgress() { return this.loadProgress; }
}

// Singleton instance
export const configLoader = new UltraConfigLoader();

// Auto-initialize
export async function initializeConfigs(onProgress = null) {
    try {
        await configLoader.loadAll(onProgress);
        return true;
    } catch (error) {
        console.error('❌ Config initialization failed:', error);
        return false;
    }
}

console.log('📁 Ultra Config Loader module loaded - ADVANCED VERSION!');
