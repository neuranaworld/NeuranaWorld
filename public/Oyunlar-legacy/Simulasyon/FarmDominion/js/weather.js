// 🌦️ Farm Dominion v2 - Advanced Weather System
import * as THREE from './three.module.js';
import { SETTINGS } from './settings.js';

export class WeatherSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.currentWeather = 'clear';
        this.particles = null;
        this.rainGeometry = null;
        this.snowGeometry = null;
        this.fogDensity = 0.002;
        this.weatherTimer = 0;
        this.weatherDuration = 60; // seconds
        this.nextWeather = 'clear';
    }

    // Initialize weather system
    init() {
        this.createRainParticles();
        this.createSnowParticles();
        this.createClouds();
        console.log('🌦️ Weather system initialized');
    }

    // Create rain particles
    createRainParticles() {
        const particleCount = 5000;
        this.rainGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = Math.random() * 400 - 200;
            positions[i * 3 + 1] = Math.random() * 200;
            positions[i * 3 + 2] = Math.random() * 400 - 200;
            velocities[i] = Math.random() * 2 + 3;
        }

        this.rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.rainGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

        const rainMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.5,
            transparent: true,
            opacity: 0.6
        });

        this.rainParticles = new THREE.Points(this.rainGeometry, rainMaterial);
        this.rainParticles.visible = false;
    }

    // Create snow particles
    createSnowParticles() {
        const particleCount = 3000;
        this.snowGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = Math.random() * 400 - 200;
            positions[i * 3 + 1] = Math.random() * 200;
            positions[i * 3 + 2] = Math.random() * 400 - 200;
            velocities[i] = Math.random() * 0.5 + 0.5;
        }

        this.snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.snowGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

        const snowMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            opacity: 0.8
        });

        this.snowParticles = new THREE.Points(this.snowGeometry, snowMaterial);
        this.snowParticles.visible = false;
    }

    // Create clouds
    createClouds() {
        this.clouds = [];
        const cloudCount = 20;

        for (let i = 0; i < cloudCount; i++) {
            const cloudGeometry = new THREE.SphereGeometry(15, 8, 8);
            const cloudMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                Math.random() * 800 - 400,
                100 + Math.random() * 50,
                Math.random() * 800 - 400
            );
            cloud.scale.set(
                1 + Math.random() * 2,
                0.5 + Math.random() * 0.5,
                1 + Math.random() * 2
            );
            
            this.clouds.push(cloud);
            this.scene.add(cloud);
        }
    }

    // Change weather
    setWeather(weatherType) {
        // Stop current weather
        this.stopCurrentWeather();

        this.currentWeather = weatherType;

        switch(weatherType) {
            case 'rain':
                this.startRain();
                break;
            case 'snow':
                this.startSnow();
                break;
            case 'storm':
                this.startStorm();
                break;
            case 'fog':
                this.startFog();
                break;
            case 'clear':
            default:
                this.startClear();
                break;
        }

        console.log(`🌦️ Weather changed to: ${weatherType}`);
    }

    // Start rain
    startRain() {
        if (this.rainParticles) {
            this.scene.add(this.rainParticles);
            this.rainParticles.visible = true;
        }
        this.scene.fog.near = 150;
        this.scene.fog.far = 2500;
        this.scene.background.setHex(0x888888);
    }

    // Start snow
    startSnow() {
        if (this.snowParticles) {
            this.scene.add(this.snowParticles);
            this.snowParticles.visible = true;
        }
        this.scene.fog.near = 100;
        this.scene.fog.far = 2000;
        this.scene.background.setHex(0xcccccc);
    }

    // Start storm
    startStorm() {
        if (this.rainParticles) {
            this.scene.add(this.rainParticles);
            this.rainParticles.visible = true;
            this.rainParticles.material.size = 1;
        }
        this.scene.fog.near = 50;
        this.scene.fog.far = 1500;
        this.scene.background.setHex(0x444444);
    }

    // Start fog
    startFog() {
        this.scene.fog.near = 50;
        this.scene.fog.far = 1000;
        this.scene.background.setHex(0xaaaaaa);
    }

    // Start clear weather
    startClear() {
        this.scene.fog.near = SETTINGS.graphics.fogNear;
        this.scene.fog.far = SETTINGS.graphics.fogFar;
        this.scene.background.setHex(0x99ccff);
    }

    // Stop current weather
    stopCurrentWeather() {
        if (this.rainParticles) {
            this.rainParticles.visible = false;
            this.scene.remove(this.rainParticles);
        }
        if (this.snowParticles) {
            this.snowParticles.visible = false;
            this.scene.remove(this.snowParticles);
        }
    }

    // Update weather particles
    update(delta) {
        // Update weather timer
        this.weatherTimer += delta;
        if (this.weatherTimer >= this.weatherDuration) {
            this.weatherTimer = 0;
            this.randomWeatherChange();
        }

        // Update rain
        if (this.rainParticles && this.rainParticles.visible) {
            const positions = this.rainGeometry.attributes.position.array;
            const velocities = this.rainGeometry.attributes.velocity.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= velocities[i / 3] * delta * 50;
                
                if (positions[i + 1] < 0) {
                    positions[i + 1] = 200;
                    positions[i] = this.camera.position.x + (Math.random() * 400 - 200);
                    positions[i + 2] = this.camera.position.z + (Math.random() * 400 - 200);
                }
            }

            this.rainGeometry.attributes.position.needsUpdate = true;
        }

        // Update snow
        if (this.snowParticles && this.snowParticles.visible) {
            const positions = this.snowGeometry.attributes.position.array;
            const velocities = this.snowGeometry.attributes.velocity.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= velocities[i / 3] * delta * 20;
                positions[i] += Math.sin(Date.now() * 0.001 + i) * delta * 2;
                
                if (positions[i + 1] < 0) {
                    positions[i + 1] = 200;
                    positions[i] = this.camera.position.x + (Math.random() * 400 - 200);
                    positions[i + 2] = this.camera.position.z + (Math.random() * 400 - 200);
                }
            }

            this.snowGeometry.attributes.position.needsUpdate = true;
        }

        // Update clouds
        this.clouds.forEach(cloud => {
            cloud.position.x += delta * 2;
            if (cloud.position.x > 500) {
                cloud.position.x = -500;
            }
        });
    }

    // Random weather change
    randomWeatherChange() {
        if (!SETTINGS.weather.dynamicWeather) return;

        const weatherTypes = ['clear', 'clear', 'clear', 'rain', 'fog', 'snow', 'storm'];
        const random = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        if (random !== this.currentWeather) {
            this.setWeather(random);
        }
    }

    // Get current weather
    getCurrentWeather() {
        return this.currentWeather;
    }

    // Dispose
    dispose() {
        this.stopCurrentWeather();
        if (this.rainGeometry) this.rainGeometry.dispose();
        if (this.snowGeometry) this.snowGeometry.dispose();
        this.clouds.forEach(cloud => {
            this.scene.remove(cloud);
            cloud.geometry.dispose();
            cloud.material.dispose();
        });
    }
}

console.log('🌦️ Weather system loaded');
