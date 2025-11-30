// 🔊 Farm Dominion v2 - Audio System
import { SETTINGS } from './settings.js';

class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicTracks = {};
        this.ambientSounds = {};
        this.context = null;
        this.listener = null;
        this.initialized = false;
    }

    // Initialize audio system
    init(camera) {
        if (this.initialized) return;
        
        try {
            // Create audio listener attached to camera
            this.listener = new THREE.AudioListener();
            camera.add(this.listener);
            
            // Load all audio files
            this.loadAudio();
            
            this.initialized = true;
            console.log('🔊 Audio system initialized');
        } catch (e) {
            console.warn('⚠️ Audio initialization failed:', e);
        }
    }

    // Load audio files
    loadAudio() {
        const loader = new THREE.AudioLoader();

        // Load ambient sounds
        this.loadAmbientSound(loader, 'ambient', '../assets/audio/ambient.mp3');
        this.loadAmbientSound(loader, 'birds', '../assets/audio/birds.mp3');
        this.loadAmbientSound(loader, 'wind', '../assets/audio/wind.mp3');

        console.log('🎵 Audio files loaded');
    }

    // Load ambient sound
    loadAmbientSound(loader, name, path) {
        const sound = new THREE.Audio(this.listener);
        loader.load(
            path,
            (buffer) => {
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setVolume(SETTINGS.audio.ambientVolume * SETTINGS.audio.masterVolume);
                this.ambientSounds[name] = sound;
            },
            undefined,
            (error) => {
                console.warn(`⚠️ Could not load ${name}:`, error);
            }
        );
    }

    // Play ambient sound
    playAmbient(name) {
        if (!SETTINGS.audio.enabled || !this.initialized) return;
        
        const sound = this.ambientSounds[name];
        if (sound && !sound.isPlaying) {
            sound.play();
            console.log(`🎵 Playing ambient: ${name}`);
        }
    }

    // Stop ambient sound
    stopAmbient(name) {
        const sound = this.ambientSounds[name];
        if (sound && sound.isPlaying) {
            sound.stop();
            console.log(`⏸️ Stopped ambient: ${name}`);
        }
    }

    // Create positional sound (3D audio)
    createPositionalSound(path, position, volume = 0.5, distance = 50) {
        if (!SETTINGS.audio.enabled || !this.initialized) return null;

        const sound = new THREE.PositionalAudio(this.listener);
        const loader = new THREE.AudioLoader();

        loader.load(path, (buffer) => {
            sound.setBuffer(buffer);
            sound.setRefDistance(distance);
            sound.setVolume(volume * SETTINGS.audio.effectsVolume * SETTINGS.audio.masterVolume);
            sound.position.copy(position);
        });

        return sound;
    }

    // Play footstep sound
    playFootstep() {
        if (!SETTINGS.audio.enabled || !this.initialized) return;
        // Can be implemented with sound effects later
    }

    // Play weather sound
    playWeatherSound(weatherType) {
        if (!SETTINGS.audio.enabled || !this.initialized) return;
        
        switch(weatherType) {
            case 'rain':
                this.playAmbient('wind');
                break;
            case 'storm':
                this.playAmbient('wind');
                break;
            case 'clear':
                this.stopAmbient('wind');
                this.playAmbient('birds');
                break;
        }
    }

    // Update audio settings
    updateVolume() {
        if (!this.initialized) return;

        Object.values(this.ambientSounds).forEach(sound => {
            if (sound) {
                sound.setVolume(SETTINGS.audio.ambientVolume * SETTINGS.audio.masterVolume);
            }
        });
    }

    // Mute/Unmute all sounds
    toggleMute() {
        SETTINGS.audio.enabled = !SETTINGS.audio.enabled;
        
        if (!SETTINGS.audio.enabled) {
            this.stopAll();
        } else {
            this.playAmbient('ambient');
            this.playAmbient('birds');
        }

        return SETTINGS.audio.enabled;
    }

    // Stop all sounds
    stopAll() {
        Object.values(this.ambientSounds).forEach(sound => {
            if (sound && sound.isPlaying) {
                sound.stop();
            }
        });
    }

    // Start ambient environment
    startAmbient() {
        if (!SETTINGS.audio.enabled || !this.initialized) return;
        
        this.playAmbient('ambient');
        this.playAmbient('birds');
    }

    // Update based on time of day
    updateTimeOfDay(timeOfDay) {
        if (!SETTINGS.audio.enabled || !this.initialized) return;

        // Night time (0.0 - 0.25 and 0.75 - 1.0)
        if (timeOfDay < 0.25 || timeOfDay > 0.75) {
            this.stopAmbient('birds');
        } else {
            // Day time
            this.playAmbient('birds');
        }
    }

    // Cleanup
    dispose() {
        this.stopAll();
        Object.values(this.ambientSounds).forEach(sound => {
            if (sound) {
                sound.disconnect();
            }
        });
        this.sounds = {};
        this.ambientSounds = {};
        this.initialized = false;
    }
}

// Export singleton instance
export const audioManager = new AudioManager();
