// ⚙️ Farm Dominion v2.1 - In-Game Settings Menu
import { SETTINGS, saveSettings, toggleShadows, toggleSound, setGraphicsQuality } from './settings.js';

export class GameMenu {
    constructor() {
        this.isOpen = false;
        this.menuContainer = null;
        this.uiElements = {
            fps: null,
            position: null,
            time: null,
            controls: null,
            minimap: null,
            quests: null,
            perfMonitor: null
        };
        this.createMenu();
        this.loadUIPreferences();
    }

    // Create menu UI
    createMenu() {
        // Overlay (dark background)
        const overlay = document.createElement('div');
        overlay.id = 'menu-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Menu container
        this.menuContainer = document.createElement('div');
        this.menuContainer.id = 'game-menu';
        this.menuContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border: 2px solid rgba(74, 222, 128, 0.3);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            font-family: 'Segoe UI', sans-serif;
            color: white;
        `;

        // Title
        const title = document.createElement('h1');
        title.textContent = '⚙️ OYUN AYARLARI';
        title.style.cssText = `
            margin: 0 0 25px 0;
            font-size: 28px;
            text-align: center;
            color: #4ade80;
            text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
        `;
        this.menuContainer.appendChild(title);

        // Sections
        this.createGraphicsSection();
        this.createAudioSection();
        this.createUISection();
        this.createControlsSection();
        this.createInfoSection();

        // Close button
        const closeBtn = this.createButton('❌ Menüyü Kapat (ESC)', () => this.toggle());
        closeBtn.style.marginTop = '20px';
        closeBtn.style.width = '100%';
        closeBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        this.menuContainer.appendChild(closeBtn);

        overlay.appendChild(this.menuContainer);
        document.body.appendChild(overlay);

        this.overlay = overlay;
    }

    // Graphics section
    createGraphicsSection() {
        const section = this.createSection('🎨 Grafik Ayarları');

        // Shadow toggle
        const shadowToggle = this.createToggle(
            'Gölgeler',
            SETTINGS.graphics.shadows,
            (enabled) => {
                toggleShadows();
                const shadowBtn = document.getElementById('toggleShadows');
                if (shadowBtn) {
                    shadowBtn.textContent = `🌓 Gölge: ${enabled ? 'Açık' : 'Kapalı'}`;
                }
                window.renderer.shadowMap.enabled = enabled;
                window.sunLight.castShadow = enabled;
            }
        );
        section.appendChild(shadowToggle);

        // Quality preset
        const qualityLabel = document.createElement('div');
        qualityLabel.textContent = 'Grafik Kalitesi:';
        qualityLabel.style.cssText = `
            margin: 15px 0 8px 0;
            font-size: 14px;
            color: #94a3b8;
        `;
        section.appendChild(qualityLabel);

        const qualityButtons = document.createElement('div');
        qualityButtons.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        `;

        ['Düşük', 'Orta', 'Yüksek', 'Ultra'].forEach((label, index) => {
            const btn = this.createButton(label, () => {
                const qualities = ['low', 'medium', 'high', 'ultra'];
                setGraphicsQuality(qualities[index]);
                this.showNotification(`Grafik kalitesi ${label} olarak ayarlandı`);
            });
            btn.style.flex = '1';
            btn.style.fontSize = '12px';
            btn.style.padding = '8px';
            qualityButtons.appendChild(btn);
        });
        section.appendChild(qualityButtons);

        // FOV slider
        const fovControl = this.createSlider(
            'Görüş Açısı (FOV)',
            SETTINGS.player.fov,
            60,
            90,
            (value) => {
                SETTINGS.player.fov = value;
                if (window.camera) {
                    window.camera.fov = value;
                    window.camera.updateProjectionMatrix();
                }
                saveSettings();
            }
        );
        section.appendChild(fovControl);

        this.menuContainer.appendChild(section);
    }

    // Audio section
    createAudioSection() {
        const section = this.createSection('🔊 Ses Ayarları');

        // Sound toggle
        const soundToggle = this.createToggle(
            'Ana Ses',
            SETTINGS.audio.enabled,
            (enabled) => {
                SETTINGS.audio.enabled = enabled;
                const soundBtn = document.getElementById('toggleSound');
                if (soundBtn) {
                    soundBtn.textContent = `🔊 Ses: ${enabled ? 'Açık' : 'Kapalı'}`;
                }
                if (window.audioManager) {
                    if (enabled) {
                        window.audioManager.startAmbient();
                    } else {
                        window.audioManager.stopAll();
                    }
                }
                saveSettings();
            }
        );
        section.appendChild(soundToggle);

        // Master volume
        const masterVol = this.createSlider(
            'Ana Ses Seviyesi',
            SETTINGS.audio.masterVolume * 100,
            0,
            100,
            (value) => {
                SETTINGS.audio.masterVolume = value / 100;
                if (window.audioManager) {
                    window.audioManager.updateVolume();
                }
                saveSettings();
            }
        );
        section.appendChild(masterVol);

        // Ambient volume
        const ambientVol = this.createSlider(
            'Ortam Sesi',
            SETTINGS.audio.ambientVolume * 100,
            0,
            100,
            (value) => {
                SETTINGS.audio.ambientVolume = value / 100;
                if (window.audioManager) {
                    window.audioManager.updateVolume();
                }
                saveSettings();
            }
        );
        section.appendChild(ambientVol);

        this.menuContainer.appendChild(section);
    }

    // UI section
    createUISection() {
        const section = this.createSection('🖥️ Arayüz Ayarları');

        // FPS counter
        const fpsToggle = this.createToggle(
            'FPS Sayacı',
            true,
            (enabled) => {
                const el = document.getElementById('fps-counter');
                if (el) el.style.display = enabled ? 'block' : 'none';
                this.saveUIPreference('fps', enabled);
            }
        );
        section.appendChild(fpsToggle);

        // Position display
        const posToggle = this.createToggle(
            'Pozisyon Bilgisi',
            true,
            (enabled) => {
                const el = document.getElementById('position-display');
                if (el) el.style.display = enabled ? 'block' : 'none';
                this.saveUIPreference('position', enabled);
            }
        );
        section.appendChild(posToggle);

        // Time display
        const timeToggle = this.createToggle(
            'Saat Göstergesi',
            true,
            (enabled) => {
                const el = document.getElementById('time-display');
                if (el) el.style.display = enabled ? 'block' : 'none';
                this.saveUIPreference('time', enabled);
            }
        );
        section.appendChild(timeToggle);

        // Controls info
        const controlsToggle = this.createToggle(
            'Kontrol Bilgileri',
            true,
            (enabled) => {
                const el = document.getElementById('controls-ui');
                if (el) el.style.display = enabled ? 'block' : 'none';
                this.saveUIPreference('controls', enabled);
            }
        );
        section.appendChild(controlsToggle);

        // Mini-map
        const minimapToggle = this.createToggle(
            'Mini Harita',
            true,
            (enabled) => {
                const el = document.getElementById('minimap-container');
                if (el) el.style.display = enabled ? 'block' : 'none';
                this.saveUIPreference('minimap', enabled);
            }
        );
        section.appendChild(minimapToggle);

        // Quest panel
        const questToggle = this.createToggle(
            'Görev Paneli',
            true,
            (enabled) => {
                const el = document.getElementById('quest-panel');
                if (el) el.style.display = enabled ? 'block' : 'none';
                this.saveUIPreference('quests', enabled);
            }
        );
        section.appendChild(questToggle);

        // Performance monitor
        const perfToggle = this.createToggle(
            'Performans Monitörü',
            false,
            (enabled) => {
                if (window.perfMonitor) {
                    const panel = document.getElementById('perf-monitor');
                    if (panel) panel.style.display = enabled ? 'block' : 'none';
                }
                this.saveUIPreference('perfMonitor', enabled);
            }
        );
        section.appendChild(perfToggle);

        this.menuContainer.appendChild(section);
    }

    // Controls section
    createControlsSection() {
        const section = this.createSection('🎮 Kontroller');

        const controlsList = document.createElement('div');
        controlsList.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 10px;
            font-size: 13px;
            line-height: 2;
        `;

        const controls = [
            { key: 'WASD', desc: 'Hareket' },
            { key: 'Shift', desc: 'Koş' },
            { key: 'Space', desc: 'Zıpla' },
            { key: 'Fare', desc: 'Kamera' },
            { key: 'G', desc: 'Gölge Aç/Kapat' },
            { key: 'M', desc: 'Ses Aç/Kapat' },
            { key: 'P', desc: 'Performans Monitörü' },
            { key: 'Tab', desc: 'Mini Harita' },
            { key: '1-5', desc: 'Hava Durumu Değiştir' },
            { key: 'ESC', desc: 'Menü Aç/Kapat' }
        ];

        controls.forEach(ctrl => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `;
            item.innerHTML = `
                <span style="color: #4ade80; font-weight: bold;">${ctrl.key}</span>
                <span style="color: #94a3b8;">${ctrl.desc}</span>
            `;
            controlsList.appendChild(item);
        });

        section.appendChild(controlsList);
        this.menuContainer.appendChild(section);
    }

    // Info section
    createInfoSection() {
        const section = this.createSection('ℹ️ Oyun Bilgileri');

        const info = document.createElement('div');
        info.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 10px;
            font-size: 13px;
            line-height: 1.8;
        `;

        const playerStats = JSON.parse(localStorage.getItem('farmDominionPlayer') || '{}');
        
        info.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #4ade80;">📊 İstatistikler</div>
            <div>🏆 Seviye: ${playerStats.level || 1}</div>
            <div>⭐ XP: ${playerStats.xp || 0}</div>
            <div>💰 Altın: ${playerStats.coins || 0}</div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="font-weight: bold; color: #4ade80; margin-bottom: 5px;">🎮 Oyun</div>
                <div>Versiyon: 2.1</div>
                <div>Motor: Three.js r161</div>
                <div>Kod Satırı: 61,287</div>
            </div>
        `;

        section.appendChild(info);
        this.menuContainer.appendChild(section);
    }

    // Helper: Create section
    createSection(title) {
        const section = document.createElement('div');
        section.style.cssText = `
            margin-bottom: 25px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const titleEl = document.createElement('h2');
        titleEl.textContent = title;
        titleEl.style.cssText = `
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #4ade80;
            border-bottom: 2px solid rgba(74, 222, 128, 0.3);
            padding-bottom: 10px;
        `;
        section.appendChild(titleEl);

        return section;
    }

    // Helper: Create toggle
    createToggle(label, initialValue, onChange) {
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        labelEl.style.cssText = `
            font-size: 14px;
            color: #e2e8f0;
        `;

        const toggle = document.createElement('div');
        toggle.style.cssText = `
            width: 50px;
            height: 26px;
            background: ${initialValue ? '#4ade80' : '#64748b'};
            border-radius: 13px;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        `;

        const slider = document.createElement('div');
        slider.style.cssText = `
            width: 22px;
            height: 22px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: ${initialValue ? '26px' : '2px'};
            transition: left 0.3s;
        `;
        toggle.appendChild(slider);

        let isEnabled = initialValue;
        toggle.addEventListener('click', () => {
            isEnabled = !isEnabled;
            toggle.style.background = isEnabled ? '#4ade80' : '#64748b';
            slider.style.left = isEnabled ? '26px' : '2px';
            onChange(isEnabled);
        });

        container.appendChild(labelEl);
        container.appendChild(toggle);

        return container;
    }

    // Helper: Create slider
    createSlider(label, initialValue, min, max, onChange) {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 15px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const labelContainer = document.createElement('div');
        labelContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        `;

        const labelEl = document.createElement('span');
        labelEl.textContent = label;
        labelEl.style.cssText = `
            font-size: 14px;
            color: #e2e8f0;
        `;

        const valueEl = document.createElement('span');
        valueEl.textContent = Math.round(initialValue);
        valueEl.style.cssText = `
            font-size: 14px;
            color: #4ade80;
            font-weight: bold;
        `;

        labelContainer.appendChild(labelEl);
        labelContainer.appendChild(valueEl);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = initialValue;
        slider.style.cssText = `
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.2);
            outline: none;
            cursor: pointer;
        `;

        slider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            valueEl.textContent = value;
            onChange(value);
        });

        container.appendChild(labelContainer);
        container.appendChild(slider);

        return container;
    }

    // Helper: Create button
    createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 12px 20px;
            background: linear-gradient(135deg, #4ade80, #22c55e);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
        `;

        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 16px rgba(74, 222, 128, 0.4)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 12px rgba(74, 222, 128, 0.3)';
        });

        btn.addEventListener('click', onClick);

        return btn;
    }

    // Toggle menu
    toggle() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.overlay.style.display = 'block';
            setTimeout(() => {
                this.overlay.style.opacity = '1';
            }, 10);
            
            // Unlock pointer
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
        } else {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                this.overlay.style.display = 'none';
            }, 300);
        }
    }

    // Save UI preferences
    saveUIPreference(key, value) {
        const prefs = JSON.parse(localStorage.getItem('farmDominionUIPrefs') || '{}');
        prefs[key] = value;
        localStorage.setItem('farmDominionUIPrefs', JSON.stringify(prefs));
    }

    // Load UI preferences
    loadUIPreferences() {
        const prefs = JSON.parse(localStorage.getItem('farmDominionUIPrefs') || '{}');
        
        // Apply saved preferences
        setTimeout(() => {
            if (prefs.fps === false) {
                const el = document.getElementById('fps-counter');
                if (el) el.style.display = 'none';
            }
            if (prefs.position === false) {
                const el = document.getElementById('position-display');
                if (el) el.style.display = 'none';
            }
            if (prefs.time === false) {
                const el = document.getElementById('time-display');
                if (el) el.style.display = 'none';
            }
            if (prefs.controls === false) {
                const el = document.getElementById('controls-ui');
                if (el) el.style.display = 'none';
            }
            if (prefs.minimap === false) {
                const el = document.getElementById('minimap-container');
                if (el) el.style.display = 'none';
            }
            if (prefs.quests === false) {
                const el = document.getElementById('quest-panel');
                if (el) el.style.display = 'none';
            }
            if (prefs.perfMonitor === true) {
                const el = document.getElementById('perf-monitor');
                if (el) el.style.display = 'block';
            }
        }, 1000);
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(74, 222, 128, 0.95);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: bold;
            z-index: 10001;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            animation: fadeInOut 2s ease;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; }
                10%, 90% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 2000);
    }

    // Check if menu is open
    isMenuOpen() {
        return this.isOpen;
    }
}

console.log('⚙️ Game menu system loaded');
