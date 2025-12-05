// ☀️ Farm Dominion v2.1 - Ultra Realistic Weather & Day Cycle
import * as THREE from './three.module.js';

export class UltraWeatherSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        
        // Time system (24-hour cycle)
        this.time = {
            hour: 12,           // 0-24
            minute: 0,          // 0-60
            day: 1,             // 1-365
            season: 'summer',   // spring, summer, autumn, winter
            timeScale: 60       // 1 real second = 1 game minute
        };
        
        // Weather state
        this.weather = {
            current: 'clear',
            temperature: 25,        // °C
            humidity: 60,           // %
            pressure: 1013,         // hPa
            windSpeed: 10,          // km/h
            windDirection: 0,       // degrees
            cloudCover: 20,         // %
            precipitation: 0,       // mm/h
            visibility: 10000       // meters
        };
        
        // Sun and moon
        this.sun = null;
        this.moon = null;
        this.sunLight = null;
        this.moonLight = null;
        
        // Sky
        this.skyMaterial = null;
        this.skyColors = this.defineSkyColors();
        
        // Clouds
        this.clouds = [];
        this.cloudSystem = null;
        
        // Particles
        this.rainSystem = null;
        this.snowSystem = null;
        this.fogSystem = null;
        
        // Biome
        this.currentBiome = 'temperate_deciduous';
        
        console.log('☀️ Ultra Weather System initialized');
    }

    // Define sky colors for different times and weathers
    defineSkyColors() {
        return {
            // Clear sky
            clear: {
                dawn: {
                    top: new THREE.Color(0x4a148c),      // Deep purple
                    middle: new THREE.Color(0xff6f00),   // Orange
                    bottom: new THREE.Color(0xffd54f),   // Yellow
                    sun: new THREE.Color(0xff6f00),
                    fog: new THREE.Color(0xff9e80)
                },
                morning: {
                    top: new THREE.Color(0x42a5f5),      // Light blue
                    middle: new THREE.Color(0x81d4fa),   // Lighter blue
                    bottom: new THREE.Color(0xe1f5fe),   // Very light blue
                    sun: new THREE.Color(0xfff59d),
                    fog: new THREE.Color(0xb3e5fc)
                },
                midday: {
                    top: new THREE.Color(0x0d47a1),      // Deep blue
                    middle: new THREE.Color(0x2196f3),   // Sky blue
                    bottom: new THREE.Color(0xbbdefb),   // Light blue
                    sun: new THREE.Color(0xffffff),      // White
                    fog: new THREE.Color(0xe3f2fd)
                },
                afternoon: {
                    top: new THREE.Color(0x1565c0),
                    middle: new THREE.Color(0x42a5f5),
                    bottom: new THREE.Color(0x90caf9),
                    sun: new THREE.Color(0xfff9c4),
                    fog: new THREE.Color(0xb3e5fc)
                },
                evening: {
                    top: new THREE.Color(0x311b92),      // Deep purple
                    middle: new THREE.Color(0xe65100),   // Deep orange
                    bottom: new THREE.Color(0xff8a65),   // Light orange
                    sun: new THREE.Color(0xff5722),
                    fog: new THREE.Color(0xffab91)
                },
                dusk: {
                    top: new THREE.Color(0x1a237e),      // Dark blue
                    middle: new THREE.Color(0x5c6bc0),   // Blue-purple
                    bottom: new THREE.Color(0x9fa8da),   // Light purple
                    sun: new THREE.Color(0xff6f00),
                    fog: new THREE.Color(0x7986cb)
                },
                night: {
                    top: new THREE.Color(0x000051),      // Very dark blue
                    middle: new THREE.Color(0x0d47a1),   // Dark blue
                    bottom: new THREE.Color(0x1565c0),   // Blue
                    moon: new THREE.Color(0xe8eaf6),     // Pale white
                    fog: new THREE.Color(0x283593)
                }
            },
            
            // Cloudy sky
            cloudy: {
                day: {
                    top: new THREE.Color(0x607d8b),      // Gray-blue
                    middle: new THREE.Color(0x90a4ae),   // Light gray
                    bottom: new THREE.Color(0xb0bec5),   // Very light gray
                    fog: new THREE.Color(0xcfd8dc)
                },
                night: {
                    top: new THREE.Color(0x263238),
                    middle: new THREE.Color(0x37474f),
                    bottom: new THREE.Color(0x455a64),
                    fog: new THREE.Color(0x546e7a)
                }
            },
            
            // Stormy sky
            storm: {
                day: {
                    top: new THREE.Color(0x263238),      // Very dark gray
                    middle: new THREE.Color(0x37474f),   // Dark gray
                    bottom: new THREE.Color(0x455a64),   // Gray
                    lightning: new THREE.Color(0xffffff),
                    fog: new THREE.Color(0x546e7a)
                }
            },
            
            // Foggy
            fog: {
                day: {
                    top: new THREE.Color(0xb0bec5),
                    middle: new THREE.Color(0xcfd8dc),
                    bottom: new THREE.Color(0xeceff1),
                    fog: new THREE.Color(0xf5f5f5)
                }
            }
        };
    }

    // Initialize sun and moon
    initCelestialBodies() {
        // Sun
        const sunGeometry = new THREE.SphereGeometry(100, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1.0
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);
        
        // Sun light
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.left = -1000;
        this.sunLight.shadow.camera.right = 1000;
        this.sunLight.shadow.camera.top = 1000;
        this.sunLight.shadow.camera.bottom = -1000;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 5000;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.scene.add(this.sunLight);
        
        // Moon
        const moonGeometry = new THREE.SphereGeometry(50, 32, 32);
        const moonMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xe8eaf6,
            emissive: 0xe8eaf6,
            emissiveIntensity: 0.3
        });
        this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
        this.scene.add(this.moon);
        
        // Moon light
        this.moonLight = new THREE.DirectionalLight(0x9fa8da, 0.3);
        this.moonLight.castShadow = false; // Optional shadows
        this.scene.add(this.moonLight);
    }

    // Initialize cloud system
    initClouds() {
        this.cloudSystem = {
            clouds: [],
            count: 50,
            height: 500,
            spread: 2000,
            speed: 0.5
        };
        
        for (let i = 0; i < this.cloudSystem.count; i++) {
            const cloud = this.createCloud();
            this.cloudSystem.clouds.push(cloud);
            this.scene.add(cloud);
        }
    }

    // Create individual cloud
    createCloud() {
        const cloudGroup = new THREE.Group();
        
        // Multiple spheres for realistic cloud shape
        const puffCount = 5 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < puffCount; i++) {
            const geometry = new THREE.SphereGeometry(
                20 + Math.random() * 30,
                8,
                8
            );
            
            const material = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7 + Math.random() * 0.3
            });
            
            const puff = new THREE.Mesh(geometry, material);
            puff.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 50
            );
            
            cloudGroup.add(puff);
        }
        
        // Position in sky
        cloudGroup.position.set(
            (Math.random() - 0.5) * this.cloudSystem.spread,
            this.cloudSystem.height + (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * this.cloudSystem.spread
        );
        
        // Random rotation
        cloudGroup.rotation.y = Math.random() * Math.PI * 2;
        
        return cloudGroup;
    }

    // Update time of day
    updateTime(delta) {
        // Advance time
        this.time.minute += delta * this.time.timeScale;
        
        if (this.time.minute >= 60) {
            this.time.minute = 0;
            this.time.hour++;
            
            if (this.time.hour >= 24) {
                this.time.hour = 0;
                this.time.day++;
                
                if (this.time.day > 365) {
                    this.time.day = 1;
                }
                
                // Update season
                this.updateSeason();
            }
        }
        
        // Update celestial bodies
        this.updateSunMoon();
        
        // Update sky color
        this.updateSkyColor();
        
        // Update lighting
        this.updateLighting();
    }

    // Update sun and moon positions
    updateSunMoon() {
        const hourAngle = (this.time.hour + this.time.minute / 60) / 24 * Math.PI * 2;
        const sunAngle = hourAngle - Math.PI / 2; // Sun at noon = top
        
        const distance = 2000;
        
        // Sun position
        this.sun.position.set(
            Math.cos(sunAngle) * distance,
            Math.sin(sunAngle) * distance,
            0
        );
        
        // Sun light follows sun
        this.sunLight.position.copy(this.sun.position);
        this.sunLight.target.position.set(0, 0, 0);
        
        // Moon position (opposite of sun)
        this.moon.position.set(
            -this.sun.position.x,
            -this.sun.position.y,
            0
        );
        
        // Moon light follows moon
        this.moonLight.position.copy(this.moon.position);
        this.moonLight.target.position.set(0, 0, 0);
        
        // Show/hide based on position
        this.sun.visible = this.sun.position.y > -50;
        this.sunLight.visible = this.sun.position.y > -100;
        
        this.moon.visible = this.moon.position.y > -50;
        this.moonLight.visible = this.moon.position.y > 0;
    }

    // Update sky color based on time and weather
    updateSkyColor() {
        const hour = this.time.hour + this.time.minute / 60;
        
        let timeOfDay;
        if (hour >= 5 && hour < 7) timeOfDay = 'dawn';
        else if (hour >= 7 && hour < 10) timeOfDay = 'morning';
        else if (hour >= 10 && hour < 14) timeOfDay = 'midday';
        else if (hour >= 14 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 19) timeOfDay = 'evening';
        else if (hour >= 19 && hour < 21) timeOfDay = 'dusk';
        else timeOfDay = 'night';
        
        // Get colors based on weather and time
        let colors;
        if (this.weather.current === 'storm') {
            colors = this.skyColors.storm.day;
        } else if (this.weather.current === 'fog') {
            colors = this.skyColors.fog.day;
        } else if (this.weather.cloudCover > 70) {
            colors = timeOfDay === 'night' ? 
                this.skyColors.cloudy.night : 
                this.skyColors.cloudy.day;
        } else {
            colors = this.skyColors.clear[timeOfDay] || this.skyColors.clear.midday;
        }
        
        // Update scene background (gradient would be better)
        this.scene.background = colors.top;
        
        // Update fog color
        if (this.scene.fog) {
            this.scene.fog.color = colors.fog || colors.bottom;
        }
    }

    // Update lighting intensity based on time and weather
    updateLighting() {
        const hour = this.time.hour + this.time.minute / 60;
        
        // Sun intensity curve (0 at night, 1 at noon)
        let sunIntensity;
        if (hour >= 6 && hour <= 18) {
            // Daytime: smooth curve
            const dayProgress = (hour - 6) / 12; // 0-1
            sunIntensity = Math.sin(dayProgress * Math.PI); // Bell curve
        } else {
            sunIntensity = 0;
        }
        
        // Weather modifier
        switch(this.weather.current) {
            case 'storm':
                sunIntensity *= 0.3;
                break;
            case 'rain':
                sunIntensity *= 0.5;
                break;
            case 'cloudy':
                sunIntensity *= 0.7;
                break;
            case 'fog':
                sunIntensity *= 0.4;
                break;
        }
        
        // Apply to sun light
        this.sunLight.intensity = sunIntensity * 1.5;
        
        // Moon intensity (inverse of sun)
        if (hour < 6 || hour > 18) {
            this.moonLight.intensity = 0.3;
        } else {
            this.moonLight.intensity = 0;
        }
        
        // Ambient light
        const ambientIntensity = 0.4 + (sunIntensity * 0.2);
        // Update ambient if exists
    }

    // Update clouds movement
    updateClouds(delta) {
        if (!this.cloudSystem) return;
        
        const windSpeed = this.weather.windSpeed / 10; // Scale down
        
        this.cloudSystem.clouds.forEach(cloud => {
            // Move clouds based on wind
            const windDir = this.weather.windDirection * Math.PI / 180;
            cloud.position.x += Math.cos(windDir) * windSpeed * delta * 10;
            cloud.position.z += Math.sin(windDir) * windSpeed * delta * 10;
            
            // Wrap around
            const limit = this.cloudSystem.spread / 2;
            if (cloud.position.x > limit) cloud.position.x = -limit;
            if (cloud.position.x < -limit) cloud.position.x = limit;
            if (cloud.position.z > limit) cloud.position.z = -limit;
            if (cloud.position.z < -limit) cloud.position.z = limit;
        });
    }

    // Update season
    updateSeason() {
        if (this.time.day <= 90) this.time.season = 'spring';
        else if (this.time.day <= 180) this.time.season = 'summer';
        else if (this.time.day <= 270) this.time.season = 'autumn';
        else this.time.season = 'winter';
        
        console.log(`🍂 Season: ${this.time.season} (Day ${this.time.day})`);
    }

    // Set weather
    setWeather(type, biome) {
        this.weather.current = type;
        this.currentBiome = biome || this.currentBiome;
        
        // Update weather parameters based on type and biome
        switch(type) {
            case 'clear':
                this.weather.cloudCover = 10 + Math.random() * 20;
                this.weather.precipitation = 0;
                this.weather.visibility = 10000;
                this.weather.humidity = 40 + Math.random() * 20;
                break;
                
            case 'cloudy':
                this.weather.cloudCover = 70 + Math.random() * 20;
                this.weather.precipitation = 0;
                this.weather.visibility = 5000;
                this.weather.humidity = 60 + Math.random() * 20;
                break;
                
            case 'rain':
                this.weather.cloudCover = 90 + Math.random() * 10;
                this.weather.precipitation = 5 + Math.random() * 10;
                this.weather.visibility = 2000;
                this.weather.humidity = 85 + Math.random() * 10;
                this.weather.windSpeed = 15 + Math.random() * 15;
                break;
                
            case 'storm':
                this.weather.cloudCover = 100;
                this.weather.precipitation = 20 + Math.random() * 30;
                this.weather.visibility = 500;
                this.weather.humidity = 95;
                this.weather.windSpeed = 40 + Math.random() * 30;
                this.weather.pressure = 980 + Math.random() * 20;
                break;
                
            case 'snow':
                this.weather.cloudCover = 90;
                this.weather.precipitation = 2 + Math.random() * 5;
                this.weather.visibility = 1000;
                this.weather.temperature = -5 + Math.random() * 8;
                this.weather.humidity = 80;
                break;
                
            case 'fog':
                this.weather.cloudCover = 100;
                this.weather.visibility = 50 + Math.random() * 200;
                this.weather.humidity = 95;
                this.weather.windSpeed = 2 + Math.random() * 3;
                break;
        }
        
        console.log(`🌤️ Weather: ${type} (${this.currentBiome})`);
        console.log(`   Temp: ${this.weather.temperature.toFixed(1)}°C`);
        console.log(`   Humidity: ${this.weather.humidity.toFixed(0)}%`);
        console.log(`   Wind: ${this.weather.windSpeed.toFixed(1)} km/h`);
    }

    // Update weather system
    update(delta, biome) {
        // Update time
        this.updateTime(delta);
        
        // Update clouds
        this.updateClouds(delta);
        
        // Update precipitation
        if (this.weather.precipitation > 0) {
            this.updatePrecipitation(delta);
        }
        
        // Return current state
        return {
            time: this.getTimeOfDay(),
            weather: this.weather.current,
            temperature: this.weather.temperature,
            hour: this.time.hour,
            minute: this.time.minute
        };
    }

    // Get time of day string
    getTimeOfDay() {
        const hour = this.time.hour;
        if (hour >= 5 && hour < 7) return 'dawn';
        if (hour >= 7 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 19) return 'evening';
        if (hour >= 19 && hour < 21) return 'dusk';
        return 'night';
    }

    // Update precipitation effects
    updatePrecipitation(delta) {
        // In production: update rain/snow particle systems
    }
}

console.log('☀️ Ultra Weather System loaded');
