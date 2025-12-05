// 🚜 Farm Dominion v2.1 - Main Entry Point with Advanced Loading
import { initWorld } from './world.js';
import { SETTINGS, loadSettings } from './settings.js';

console.log(`
╔═══════════════════════════════════╗
║   🌾 FARM DOMINION v2.1 🌾        ║
║   Massive World Edition           ║
║   6.8M m² Terrain (1700x)         ║
╚═══════════════════════════════════╝
`);

// Load saved settings
loadSettings();

// Create advanced loading screen
function createLoadingScreen() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'advanced-loading-screen';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'Segoe UI', sans-serif;
        color: white;
    `;

    loadingDiv.innerHTML = `
        <div style="text-align: center; max-width: 600px; padding: 40px;">
            <h1 style="font-size: 48px; margin-bottom: 10px; color: #4ade80; text-shadow: 0 0 30px rgba(74, 222, 128, 0.5);">
                🌾 Farm Dominion v2.1
            </h1>
            <div style="font-size: 18px; color: #94a3b8; margin-bottom: 40px;">
                Massive World Edition - 6.8 Milyon m² (1700x)
            </div>

            <!-- Progress Container -->
            <div style="background: rgba(0, 0, 0, 0.5); padding: 30px; border-radius: 20px; border: 2px solid rgba(74, 222, 128, 0.3);">
                <div id="loading-stage" style="font-size: 16px; margin-bottom: 15px; color: #4ade80;">
                    🔄 Harita Oluşturuluyor...
                </div>
                
                <!-- Progress Bar -->
                <div style="width: 100%; height: 30px; background: rgba(255, 255, 255, 0.1); border-radius: 15px; overflow: hidden; position: relative;">
                    <div id="loading-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #4ade80, #22c55e); transition: width 0.3s ease; border-radius: 15px;"></div>
                    <div id="loading-percentage" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; font-size: 14px;">
                        0%
                    </div>
                </div>

                <div id="loading-details" style="margin-top: 15px; font-size: 13px; color: #94a3b8;">
                    Chunk: 0/81
                </div>

                <div style="margin-top: 25px; font-size: 12px; color: #64748b;">
                    💡 İpucu: Bu büyük harita ilk yüklemede biraz zaman alabilir
                </div>
            </div>

            <!-- System Info -->
            <div style="margin-top: 30px; font-size: 12px; color: #64748b; opacity: 0.7;">
                <div>🎮 Three.js r161 | 📊 67,000+ Kod Satırı</div>
                <div style="margin-top: 5px;">🌍 Chunk Sistemi | 📈 LOD Optimizasyonu</div>
            </div>
        </div>
    `;

    document.body.appendChild(loadingDiv);
    return loadingDiv;
}

// Update loading progress
window.updateLoadingProgress = function(progress, stage, details) {
    const progressBar = document.getElementById('loading-progress-bar');
    const percentage = document.getElementById('loading-percentage');
    const stageEl = document.getElementById('loading-stage');
    const detailsEl = document.getElementById('loading-details');

    if (progressBar) {
        const percent = Math.round(progress * 100);
        progressBar.style.width = percent + '%';
        if (percentage) percentage.textContent = percent + '%';
    }

    if (stageEl && stage) {
        stageEl.textContent = stage;
    }

    if (detailsEl && details) {
        detailsEl.textContent = details;
    }
};

// Initialize world when page loads
window.addEventListener('load', async () => {
    console.log('🎮 Initializing massive world...');
    
    const loadingScreen = createLoadingScreen();

    try {
        // Stage 1: Assets
        window.updateLoadingProgress(0.1, '📦 Varlıklar Yükleniyor...', 'Texture ve ses dosyaları');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Stage 2: Terrain Generation
        window.updateLoadingProgress(0.2, '🌍 Büyük Harita Oluşturuluyor...', 'Chunk sistemi hazırlanıyor');
        
        // Initialize world with progress callback
        await initWorld(document.body, (progress) => {
            window.updateLoadingProgress(0.2 + progress * 0.7, '🌍 Harita Yükleniyor...', `Chunk: ${Math.round(progress * 81)}/81`);
        });

        // Stage 3: Final preparations
        window.updateLoadingProgress(0.95, '✨ Son Hazırlıklar...', 'Oyun başlatılıyor');
        await new Promise(resolve => setTimeout(resolve, 500));

        window.updateLoadingProgress(1.0, '✅ Tamamlandı!', 'Oyun hazır');
        
        console.log('✅ Massive world initialized!');
        console.log('📋 World Size:', '6800x6800 units');
        console.log('📋 Area:', '6.8M m²');
        
        // Remove loading screen with fade
        setTimeout(() => {
            loadingScreen.style.transition = 'opacity 0.5s ease';
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 500);

    } catch (error) {
        console.error('❌ Game initialization failed:', error);
        
        window.updateLoadingProgress(0, '❌ Yükleme Hatası', error.message);
        
        // Show error
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 16px;
            z-index: 10001;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h2>❌ Yükleme Hatası</h2>
            <p>Oyun başlatılamadı.</p>
            <p style="font-size: 12px; opacity: 0.8;">${error.message}</p>
            <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: white; color: #ef4444; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                Yeniden Dene
            </button>
        `;
        document.body.appendChild(errorDiv);
    }
});

// Prevent context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Debug info
console.log('🔧 Massive World Features:');
console.log('   🌍 6800x6800 units terrain');
console.log('   📦 Chunk-based loading');
console.log('   📈 LOD optimization');
console.log('   🌲 Dynamic vegetation');
console.log('   🏠 Procedural buildings');

export { SETTINGS };
