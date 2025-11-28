// 🔊 Farm Dominion v2.1 - Ultra Realistic Audio System
import * as THREE from './three.module.js';

export class UltraAudioSystem {
    constructor(camera) {
        this.camera = camera;
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);
        
        // Audio context
        this.audioLoader = new THREE.AudioLoader();
        
        // Sound categories
        this.ambient = new Map();
        this.weather = new Map();
        this.biome = new Map();
        this.nature = new Map();
        
        // Current playing sounds
        this.playing = {
            ambient: null,
            weather: null,
            biome: null,
            wind: null
        };
        
        // Wind system
        this.wind = {
            speed: 0,
            direction: 0,
            gustFrequency: 0,
            sound: null
        };
        
        // Volume controls
        this.volumes = {
            master: 1.0,
            ambient: 0.6,
            weather: 0.8,
            biome: 0.7,
            wind: 0.5,
            nature: 0.6
        };
        
        // Time of day
        this.timeOfDay = 'day'; // day, evening, night, dawn
        
        console.log('🔊 Ultra Audio System initialized');
    }

    // Initialize all sounds
    async init() {
        // Note: In production, these would load actual audio files
        console.log('🔊 Loading audio files...');
        
        // Wind sounds (layered system)
        this.initWindSounds();
        
        // Ambient sounds
        this.initAmbientSounds();
        
        // Weather sounds
        this.initWeatherSounds();
        
        // Biome-specific sounds
        this.initBiomeSounds();
        
        // Nature sounds
        this.initNatureSounds();
        
        console.log('✅ Audio system ready');
    }

    // WIND SYSTEM - Ultra Realistic
    initWindSounds() {
        // Wind is layered based on speed
        this.wind.layers = {
            calm: {          // 0-5 km/h
                file: 'wind_calm.ogg',
                volume: 0.2,
                pitch: 1.0,
                filter: 'low-pass'
            },
            gentle: {        // 5-15 km/h
                file: 'wind_gentle.ogg',
                volume: 0.3,
                pitch: 1.0,
                filter: 'none'
            },
            moderate: {      // 15-30 km/h
                file: 'wind_moderate.ogg',
                volume: 0.5,
                pitch: 1.1,
                filter: 'none'
            },
            strong: {        // 30-50 km/h
                file: 'wind_strong.ogg',
                volume: 0.7,
                pitch: 1.2,
                filter: 'high-pass'
            },
            gale: {          // 50+ km/h
                file: 'wind_gale.ogg',
                volume: 0.9,
                pitch: 1.3,
                filter: 'high-pass'
            }
        };
        
        // Wind through different objects
        this.wind.objects = {
            trees: 'wind_through_trees.ogg',
            grass: 'wind_through_grass.ogg',
            leaves: 'wind_rustling_leaves.ogg',
            bamboo: 'wind_bamboo_clatter.ogg'
        };
        
        // Gusts (sudden increases)
        this.wind.gusts = {
            light: 'wind_gust_light.ogg',
            medium: 'wind_gust_medium.ogg',
            strong: 'wind_gust_strong.ogg'
        };
    }

    // Update wind based on weather and biome
    updateWind(weather, biome, time) {
        // Wind speed calculation
        let baseSpeed = 10; // km/h
        
        // Weather modifiers
        switch(weather) {
            case 'storm':
                baseSpeed = 40 + Math.random() * 20;
                break;
            case 'rain':
                baseSpeed = 20 + Math.random() * 10;
                break;
            case 'clear':
                baseSpeed = 5 + Math.random() * 10;
                break;
            case 'fog':
                baseSpeed = 2 + Math.random() * 3;
                break;
        }
        
        // Biome modifiers
        switch(biome) {
            case 'savanna':
                baseSpeed *= 1.5; // More wind in open areas
                break;
            case 'tropical_rainforest':
                baseSpeed *= 0.5; // Less wind under canopy
                break;
            case 'mountain':
                baseSpeed *= 2.0; // Mountain winds
                break;
        }
        
        // Time of day modifier
        if (time === 'night') {
            baseSpeed *= 0.7; // Calmer at night
        } else if (time === 'dawn' || time === 'dusk') {
            baseSpeed *= 1.2; // Wind picks up
        }
        
        // Add gustiness
        const gustChance = Math.random();
        if (gustChance < 0.1) {
            this.playGust(baseSpeed);
        }
        
        this.wind.speed = baseSpeed;
        this.updateWindSound();
    }

    // Update wind sound layers
    updateWindSound() {
        const speed = this.wind.speed;
        
        // Determine which layer to play
        let layer;
        if (speed < 5) layer = 'calm';
        else if (speed < 15) layer = 'gentle';
        else if (speed < 30) layer = 'moderate';
        else if (speed < 50) layer = 'strong';
        else layer = 'gale';
        
        // Crossfade between layers
        // In production: implement smooth crossfade
        console.log(`🌬️ Wind: ${speed.toFixed(1)} km/h (${layer})`);
    }

    // Play wind gust
    playGust(baseSpeed) {
        let gustType;
        if (baseSpeed < 20) gustType = 'light';
        else if (baseSpeed < 40) gustType = 'medium';
        else gustType = 'strong';
        
        console.log(`💨 Gust: ${gustType}`);
        
        // In production: play gust sound with 3D positioning
    }

    // AMBIENT SOUNDS - Time of Day
    initAmbientSounds() {
        this.ambient.set('day', {
            files: [
                'ambient_day_general.ogg',      // Base ambience
                'distant_bird_chorus.ogg',      // Birds
                'insect_hum.ogg'                // Insects
            ],
            volume: 0.5
        });
        
        this.ambient.set('dawn', {
            files: [
                'ambient_dawn.ogg',
                'morning_bird_chorus.ogg',      // Dawn chorus
                'rooster_crow.ogg'              // Optional
            ],
            volume: 0.6
        });
        
        this.ambient.set('evening', {
            files: [
                'ambient_evening.ogg',
                'cricket_chorus.ogg',
                'evening_birds.ogg'
            ],
            volume: 0.5
        });
        
        this.ambient.set('night', {
            files: [
                'ambient_night.ogg',
                'cricket_night.ogg',
                'owl_hoots.ogg',
                'distant_wolves.ogg'            // Optional
            ],
            volume: 0.4
        });
    }

    // WEATHER SOUNDS
    initWeatherSounds() {
        this.weather.set('rain_light', {
            file: 'rain_light.ogg',
            volume: 0.4,
            loop: true,
            additional: [
                'rain_on_leaves.ogg',
                'rain_drip.ogg'
            ]
        });
        
        this.weather.set('rain_heavy', {
            file: 'rain_heavy.ogg',
            volume: 0.7,
            loop: true,
            additional: [
                'rain_patter_intense.ogg',
                'water_splashing.ogg'
            ]
        });
        
        this.weather.set('thunder', {
            files: [
                'thunder_distant_1.ogg',
                'thunder_distant_2.ogg',
                'thunder_close_1.ogg',
                'thunder_close_2.ogg',
                'thunder_crack.ogg'
            ],
            volume: 0.8,
            random: true,
            interval: [10, 30] // seconds
        });
        
        this.weather.set('snow', {
            file: 'snow_wind.ogg',
            volume: 0.3,
            loop: true,
            additional: [
                'snow_crunch.ogg'           // When walking
            ]
        });
        
        this.weather.set('fog', {
            file: 'fog_ambient.ogg',
            volume: 0.2,
            loop: true,
            features: [
                'muffled_sounds',           // All sounds dampened
                'eerie_distant_sounds.ogg'
            ]
        });
    }

    // BIOME-SPECIFIC SOUNDS
    initBiomeSounds() {
        // TROPICAL RAINFOREST
        this.biome.set('tropical_rainforest', {
            ambient: 'rainforest_ambient.ogg',
            volume: 0.6,
            layers: [
                {
                    name: 'canopy',
                    sounds: [
                        'monkey_calls.ogg',
                        'parrot_squawks.ogg',
                        'toucan_calls.ogg'
                    ],
                    frequency: 'high',
                    distance: 'far'
                },
                {
                    name: 'understory',
                    sounds: [
                        'insect_buzz.ogg',
                        'frog_croaks.ogg',
                        'cricket_chirp.ogg'
                    ],
                    frequency: 'constant',
                    distance: 'near'
                },
                {
                    name: 'floor',
                    sounds: [
                        'leaf_rustling.ogg',
                        'branch_snap.ogg',
                        'water_drip.ogg'
                    ],
                    frequency: 'occasional',
                    distance: 'very_near'
                }
            ]
        });
        
        // SAVANNA
        this.biome.set('savanna', {
            ambient: 'savanna_ambient.ogg',
            volume: 0.5,
            layers: [
                {
                    name: 'distant',
                    sounds: [
                        'lion_roar_distant.ogg',
                        'elephant_trumpet.ogg',
                        'hyena_laugh.ogg'
                    ],
                    frequency: 'rare',
                    distance: 'very_far'
                },
                {
                    name: 'grass',
                    sounds: [
                        'grass_rustling_wind.ogg',
                        'cricket_dry_grass.ogg'
                    ],
                    frequency: 'constant',
                    distance: 'near'
                },
                {
                    name: 'birds',
                    sounds: [
                        'savanna_bird_calls.ogg',
                        'vulture_cry.ogg'
                    ],
                    frequency: 'medium',
                    distance: 'medium'
                }
            ]
        });
        
        // TEMPERATE DECIDUOUS
        this.biome.set('temperate_deciduous', {
            ambient: 'forest_temperate_ambient.ogg',
            volume: 0.5,
            layers: [
                {
                    name: 'birds',
                    sounds: [
                        'songbird_1.ogg',
                        'songbird_2.ogg',
                        'woodpecker.ogg',
                        'crow_caw.ogg'
                    ],
                    frequency: 'high',
                    distance: 'medium'
                },
                {
                    name: 'forest_floor',
                    sounds: [
                        'deer_movement.ogg',
                        'squirrel_chatter.ogg',
                        'branch_creak.ogg'
                    ],
                    frequency: 'medium',
                    distance: 'near'
                }
            ]
        });
        
        // BOREAL FOREST
        this.biome.set('boreal_forest', {
            ambient: 'boreal_forest_ambient.ogg',
            volume: 0.4,
            layers: [
                {
                    name: 'birds',
                    sounds: [
                        'raven_call.ogg',
                        'owl_hoot.ogg'
                    ],
                    frequency: 'low',
                    distance: 'far'
                },
                {
                    name: 'forest',
                    sounds: [
                        'pine_needle_rustle.ogg',
                        'distant_wolf_howl.ogg'
                    ],
                    frequency: 'rare',
                    distance: 'very_far'
                }
            ]
        });
        
        // HOT DESERT
        this.biome.set('hot_desert', {
            ambient: 'desert_ambient.ogg',
            volume: 0.3,
            layers: [
                {
                    name: 'wind',
                    sounds: [
                        'desert_wind.ogg',
                        'sand_blow.ogg'
                    ],
                    frequency: 'constant',
                    distance: 'everywhere'
                },
                {
                    name: 'occasional',
                    sounds: [
                        'desert_bird.ogg',
                        'coyote_howl.ogg',
                        'rattlesnake.ogg'
                    ],
                    frequency: 'very_rare',
                    distance: 'variable'
                }
            ]
        });
        
        // MEDITERRANEAN
        this.biome.set('mediterranean', {
            ambient: 'mediterranean_ambient.ogg',
            volume: 0.5,
            layers: [
                {
                    name: 'cicadas',
                    sounds: [
                        'cicada_chorus.ogg'     // Dominant in summer
                    ],
                    frequency: 'constant',
                    distance: 'near',
                    seasonal: 'summer'
                },
                {
                    name: 'birds',
                    sounds: [
                        'seagull_cry.ogg',
                        'sparrow_chirp.ogg'
                    ],
                    frequency: 'medium',
                    distance: 'medium'
                }
            ]
        });
    }

    // NATURE SOUNDS - Individual Events
    initNatureSounds() {
        this.nature.set('water', {
            stream: 'water_stream_flow.ogg',
            river: 'water_river_flow.ogg',
            waterfall: 'water_waterfall.ogg',
            lake_waves: 'water_lake_waves.ogg',
            rain_puddle: 'water_rain_puddle.ogg'
        });
        
        this.nature.set('fire', {
            crackling: 'fire_crackling.ogg',
            large: 'fire_large_roar.ogg'
        });
        
        this.nature.set('movement', {
            footstep_grass: 'footstep_grass.ogg',
            footstep_dirt: 'footstep_dirt.ogg',
            footstep_sand: 'footstep_sand.ogg',
            footstep_snow: 'footstep_snow.ogg',
            footstep_wood: 'footstep_wood.ogg'
        });
    }

    // Update audio based on biome, weather, and time
    update(biome, weather, timeOfDay, playerPosition) {
        // Update time of day ambient
        if (this.timeOfDay !== timeOfDay) {
            this.timeOfDay = timeOfDay;
            this.switchAmbient(timeOfDay);
        }
        
        // Update wind
        this.updateWind(weather, biome, timeOfDay);
        
        // Update biome sounds
        this.updateBiomeSounds(biome, playerPosition);
        
        // Update weather sounds
        this.updateWeatherSounds(weather);
    }

    // Switch ambient based on time
    switchAmbient(timeOfDay) {
        console.log(`🎵 Ambient: ${timeOfDay}`);
        // In production: crossfade between ambient tracks
    }

    // Update biome-specific sounds
    updateBiomeSounds(biome, position) {
        const biomeData = this.biome.get(biome);
        if (!biomeData) return;
        
        // Play layered sounds based on distance and frequency
        biomeData.layers.forEach(layer => {
            // Randomly trigger sounds based on frequency
            const chance = this.getFrequencyChance(layer.frequency);
            if (Math.random() < chance) {
                const sound = layer.sounds[Math.floor(Math.random() * layer.sounds.length)];
                this.play3DSound(sound, position, layer.distance);
            }
        });
    }

    // Get frequency chance per frame
    getFrequencyChance(frequency) {
        switch(frequency) {
            case 'constant': return 0.5;
            case 'high': return 0.1;
            case 'medium': return 0.05;
            case 'low': return 0.02;
            case 'rare': return 0.01;
            case 'very_rare': return 0.005;
            case 'occasional': return 0.03;
            default: return 0.01;
        }
    }

    // Play 3D positioned sound
    play3DSound(soundName, origin, distance) {
        // In production: create positional audio
        const position = this.getRandomPosition(origin, distance);
        console.log(`🔊 3D Sound: ${soundName} at distance: ${distance}`);
    }

    // Get random position based on distance
    getRandomPosition(origin, distance) {
        let radius;
        switch(distance) {
            case 'very_near': radius = 5; break;
            case 'near': radius = 20; break;
            case 'medium': radius = 50; break;
            case 'far': radius = 100; break;
            case 'very_far': radius = 300; break;
            default: radius = 50;
        }
        
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * radius;
        
        return {
            x: origin.x + Math.cos(angle) * dist,
            y: origin.y,
            z: origin.z + Math.sin(angle) * dist
        };
    }

    // Update weather sounds
    updateWeatherSounds(weather) {
        switch(weather) {
            case 'rain':
                this.playWeatherSound('rain_light');
                break;
            case 'storm':
                this.playWeatherSound('rain_heavy');
                this.playThunder();
                break;
            case 'snow':
                this.playWeatherSound('snow');
                break;
            case 'fog':
                this.playWeatherSound('fog');
                break;
        }
    }

    // Play weather sound
    playWeatherSound(type) {
        // In production: manage weather sound playback
        console.log(`🌧️ Weather sound: ${type}`);
    }

    // Play thunder at intervals
    playThunder() {
        const data = this.weather.get('thunder');
        if (!data) return;
        
        // Random interval
        const interval = data.interval[0] + Math.random() * (data.interval[1] - data.interval[0]);
        
        setTimeout(() => {
            const thunder = data.files[Math.floor(Math.random() * data.files.length)];
            console.log(`⚡ Thunder: ${thunder}`);
            
            // Continue playing thunder
            if (this.playing.weather === 'storm') {
                this.playThunder();
            }
        }, interval * 1000);
    }

    // Set master volume
    setMasterVolume(volume) {
        this.volumes.master = volume;
        this.listener.setMasterVolume(volume);
    }
}

console.log('🔊 Ultra Audio System loaded');
