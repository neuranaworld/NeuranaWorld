// 📁 Farm Dominion v2.1 - Configuration File Loader
// Tüm .txt config dosyalarını okur ve parse eder
// HATA KONTROLÜ: Full try-catch ile korumalı
// FALLBACK: Dosya yoksa varsayılan değerler

/**
 * ConfigLoader - Güvenli config dosyası yükleyici
 * 
 * Özellikler:
 * ✅ buildings.txt okuma
 * ✅ npcs.txt okuma
 * ✅ weather.txt okuma
 * ✅ Hata yakalama
 * ✅ Fallback değerler
 * ✅ Comment satırları (#) atlama
 * ✅ Boş satırları atlama
 * ✅ Trim ile temizlik
 */

export class ConfigLoader {
    constructor() {
        this.buildings = [];
        this.npcs = [];
        this.weather = [];
        this.loaded = false;
        this.errors = [];
    }

    /**
     * Tüm config dosyalarını yükle
     * @returns {Promise<boolean>} Başarı durumu
     */
    async loadAll() {
        console.log('📁 Config Loader: Başlatılıyor...');

        try {
            // Paralel yükleme - daha hızlı
            const results = await Promise.allSettled([
                this.loadBuildings(),
                this.loadNPCs(),
                this.loadWeather()
            ]);

            // Sonuçları kontrol et
            results.forEach((result, index) => {
                const names = ['buildings.txt', 'npcs.txt', 'weather.txt'];
                if (result.status === 'rejected') {
                    console.warn(`⚠️ ${names[index]} yüklenemedi:`, result.reason);
                    this.errors.push({ file: names[index], error: result.reason });
                }
            });

            this.loaded = true;
            console.log('✅ Config Loader: Tamamlandı!');
            console.log(`   📦 Buildings: ${this.buildings.length} adet`);
            console.log(`   🐄 NPCs: ${this.npcs.length} adet`);
            console.log(`   🌦️ Weather: ${this.weather.length} tür`);

            return true;

        } catch (error) {
            console.error('❌ Config Loader: Kritik hata!', error);
            this.errors.push({ file: 'general', error: error.message });
            return false;
        }
    }

    /**
     * Buildings.txt dosyasını yükle ve parse et
     * Format: type, x, z, rotation
     */
    async loadBuildings() {
        try {
            const response = await fetch('../assets/buildings.txt');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            const lines = text.split('\n');

            this.buildings = [];

            for (const line of lines) {
                const trimmed = line.trim();

                // Comment veya boş satır atla
                if (!trimmed || trimmed.startsWith('#')) {
                    continue;
                }

                // Parse et
                const parts = trimmed.split(',').map(p => p.trim());

                if (parts.length >= 4) {
                    this.buildings.push({
                        type: parts[0],
                        x: parseFloat(parts[1]) || 0,
                        z: parseFloat(parts[2]) || 0,
                        rotation: parseFloat(parts[3]) || 0
                    });
                }
            }

            console.log(`✅ buildings.txt yüklendi: ${this.buildings.length} bina`);
            return this.buildings;

        } catch (error) {
            console.warn('⚠️ buildings.txt yüklenemedi, fallback kullanılıyor:', error.message);
            
            // FALLBACK: Varsayılan binalar
            this.buildings = this.getDefaultBuildings();
            return this.buildings;
        }
    }

    /**
     * NPCs.txt dosyasını yükle ve parse et
     * Format: type, name, x, y, z, color
     */
    async loadNPCs() {
        try {
            const response = await fetch('../assets/npcs.txt');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            const lines = text.split('\n');

            this.npcs = [];

            for (const line of lines) {
                const trimmed = line.trim();

                // Comment veya boş satır atla
                if (!trimmed || trimmed.startsWith('#')) {
                    continue;
                }

                // Parse et
                const parts = trimmed.split(',').map(p => p.trim());

                if (parts.length >= 6) {
                    // Renk değerini integer'a çevir (0xffffff formatı)
                    let color = 0xffffff;
                    if (parts[5].startsWith('0x')) {
                        color = parseInt(parts[5], 16);
                    }

                    this.npcs.push({
                        type: parts[0],
                        name: parts[1],
                        x: parseFloat(parts[2]) || 0,
                        y: parseFloat(parts[3]) || 0,
                        z: parseFloat(parts[4]) || 0,
                        color: color
                    });
                }
            }

            console.log(`✅ npcs.txt yüklendi: ${this.npcs.length} NPC`);
            return this.npcs;

        } catch (error) {
            console.warn('⚠️ npcs.txt yüklenemedi, fallback kullanılıyor:', error.message);
            
            // FALLBACK: Varsayılan NPCler
            this.npcs = this.getDefaultNPCs();
            return this.npcs;
        }
    }

    /**
     * Weather.txt dosyasını yükle ve parse et
     * Format: type, duration, probability
     */
    async loadWeather() {
        try {
            const response = await fetch('../assets/weather.txt');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            const lines = text.split('\n');

            this.weather = [];

            for (const line of lines) {
                const trimmed = line.trim();

                // Comment veya boş satır atla
                if (!trimmed || trimmed.startsWith('#')) {
                    continue;
                }

                // Parse et
                const parts = trimmed.split(',').map(p => p.trim());

                if (parts.length >= 3) {
                    this.weather.push({
                        type: parts[0],
                        duration: parseFloat(parts[1]) || 60,
                        probability: parseFloat(parts[2]) || 0.1
                    });
                }
            }

            console.log(`✅ weather.txt yüklendi: ${this.weather.length} hava türü`);
            return this.weather;

        } catch (error) {
            console.warn('⚠️ weather.txt yüklenemedi, fallback kullanılıyor:', error.message);
            
            // FALLBACK: Varsayılan hava durumları
            this.weather = this.getDefaultWeather();
            return this.weather;
        }
    }

    // ========================================
    // FALLBACK METHODS - Dosya yoksa bunlar kullanılır
    // ========================================

    /**
     * Varsayılan bina listesi
     */
    getDefaultBuildings() {
        return [
            { type: 'house', x: 0, z: -200, rotation: 0 },
            { type: 'barn', x: 100, z: -180, rotation: 45 },
            { type: 'windmill', x: -150, z: -200, rotation: 0 },
            { type: 'well', x: 50, z: -150, rotation: 0 },
            { type: 'silo', x: 180, z: -160, rotation: 0 }
        ];
    }

    /**
     * Varsayılan NPC listesi
     */
    getDefaultNPCs() {
        return [
            { type: 'cow', name: 'Bessie', x: 100, y: 0, z: 50, color: 0xffffff },
            { type: 'cow', name: 'Daisy', x: -80, y: 0, z: 70, color: 0xf0e68c },
            { type: 'sheep', name: 'Fluffy', x: 120, y: 0, z: -30, color: 0xffffff },
            { type: 'horse', name: 'Thunder', x: -120, y: 0, z: 100, color: 0x8b4513 }
        ];
    }

    /**
     * Varsayılan hava durumu listesi
     */
    getDefaultWeather() {
        return [
            { type: 'clear', duration: 600, probability: 0.5 },
            { type: 'rain', duration: 180, probability: 0.3 },
            { type: 'fog', duration: 120, probability: 0.15 },
            { type: 'snow', duration: 150, probability: 0.1 }
        ];
    }

    // ========================================
    // GETTER METHODS
    // ========================================

    /**
     * Tüm binaları al
     */
    getBuildings() {
        return this.buildings;
    }

    /**
     * Tüm NPCleri al
     */
    getNPCs() {
        return this.npcs;
    }

    /**
     * Tüm hava durumlarını al
     */
    getWeather() {
        return this.weather;
    }

    /**
     * Belirli tip binaları al
     */
    getBuildingsByType(type) {
        return this.buildings.filter(b => b.type === type);
    }

    /**
     * Belirli tip NPCleri al
     */
    getNPCsByType(type) {
        return this.npcs.filter(n => n.type === type);
    }

    /**
     * Hava durumu tipini al
     */
    getWeatherByType(type) {
        return this.weather.find(w => w.type === type);
    }

    /**
     * Yükleme durumunu kontrol et
     */
    isLoaded() {
        return this.loaded;
    }

    /**
     * Hataları al
     */
    getErrors() {
        return this.errors;
    }

    /**
     * İstatistikleri al
     */
    getStats() {
        return {
            buildings: this.buildings.length,
            npcs: this.npcs.length,
            weather: this.weather.length,
            loaded: this.loaded,
            errors: this.errors.length
        };
    }
}

// Singleton instance oluştur
export const configLoader = new ConfigLoader();

// Auto-initialize option
export async function initializeConfigs() {
    try {
        await configLoader.loadAll();
        return true;
    } catch (error) {
        console.error('❌ Config initialization failed:', error);
        return false;
    }
}

console.log('📁 Config Loader module loaded');
