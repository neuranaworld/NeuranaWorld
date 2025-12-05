// 🎮 Farm Dominion v2 - Settings & Configuration
export const SETTINGS = {
    // 🎨 Graphics Settings
    graphics: {
        shadows: true,
        shadowMapSize: 2048,
        antialias: true,
        fog: true,
        fogNear: 200,
        fogFar: 3000,
        renderDistance: 6000
    },

    // 🔊 Audio Settings
    audio: {
        enabled: true,
        masterVolume: 0.7,
        ambientVolume: 0.5,
        effectsVolume: 0.8,
        musicVolume: 0.6
    },

    // 🎮 Player Settings
    player: {
        moveSpeed: 40,
        sprintSpeed: 80,
        jumpHeight: 10,
        mouseSensitivity: 1.0,
        fov: 75,
        cameraHeight: 2
    },

    // 🌍 World Settings
    world: {
        size: 4000,
        divisions: 256,
        waterLevel: 10,
        treeCount: 800,
        rockCount: 200,
        animalCount: 15,
        buildingCount: 10
    },

    // 🌤️ Weather Settings
    weather: {
        enabled: true,
        dynamicWeather: true,
        rainChance: 0.3,
        snowChance: 0.1,
        stormChance: 0.05
    },

    // ⏰ Time Settings
    time: {
        dayNightCycle: true,
        dayLength: 300, // seconds
        startTime: 0.25 // 0-1 (0=midnight, 0.5=noon)
    },

    // 🎯 Performance Settings
    performance: {
        targetFPS: 60,
        adaptiveQuality: true,
        lodEnabled: true,
        frustumCulling: true
    }
};

// 💾 Save/Load Settings
export function saveSettings() {
    try {
        localStorage.setItem('farmDominionSettings', JSON.stringify(SETTINGS));
        console.log('✅ Settings saved');
        return true;
    } catch (e) {
        console.warn('⚠️ Could not save settings:', e);
        return false;
    }
}

export function loadSettings() {
    try {
        const saved = localStorage.getItem('farmDominionSettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(SETTINGS, parsed);
            console.log('✅ Settings loaded');
            return true;
        }
    } catch (e) {
        console.warn('⚠️ Could not load settings:', e);
    }
    return false;
}

export function resetSettings() {
    localStorage.removeItem('farmDominionSettings');
    console.log('🔄 Settings reset to defaults');
}

// 🎛️ Toggle Functions
export function toggleShadows() {
    SETTINGS.graphics.shadows = !SETTINGS.graphics.shadows;
    saveSettings();
    return SETTINGS.graphics.shadows;
}

export function toggleSound() {
    SETTINGS.audio.enabled = !SETTINGS.audio.enabled;
    saveSettings();
    return SETTINGS.audio.enabled;
}

export function toggleWeather() {
    SETTINGS.weather.enabled = !SETTINGS.weather.enabled;
    saveSettings();
    return SETTINGS.weather.enabled;
}

export function setGraphicsQuality(level) {
    // level: 'low', 'medium', 'high', 'ultra'
    switch(level) {
        case 'low':
            SETTINGS.graphics.shadows = false;
            SETTINGS.graphics.shadowMapSize = 512;
            SETTINGS.world.treeCount = 200;
            SETTINGS.world.rockCount = 50;
            SETTINGS.graphics.renderDistance = 2000;
            break;
        case 'medium':
            SETTINGS.graphics.shadows = true;
            SETTINGS.graphics.shadowMapSize = 1024;
            SETTINGS.world.treeCount = 400;
            SETTINGS.world.rockCount = 100;
            SETTINGS.graphics.renderDistance = 4000;
            break;
        case 'high':
            SETTINGS.graphics.shadows = true;
            SETTINGS.graphics.shadowMapSize = 2048;
            SETTINGS.world.treeCount = 800;
            SETTINGS.world.rockCount = 200;
            SETTINGS.graphics.renderDistance = 6000;
            break;
        case 'ultra':
            SETTINGS.graphics.shadows = true;
            SETTINGS.graphics.shadowMapSize = 4096;
            SETTINGS.world.treeCount = 1200;
            SETTINGS.world.rockCount = 300;
            SETTINGS.graphics.renderDistance = 8000;
            break;
    }
    saveSettings();
}

// Load settings on module import
loadSettings();
