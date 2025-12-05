// 🛠️ Farm Dominion v2 - Utility Functions
import * as THREE from './three.module.js';

// === NOISE FUNCTIONS ===

/**
 * Simple Perlin-like noise function
 */
export function perlin(x, y) {
    return (Math.sin(x * 0.002) + Math.cos(y * 0.002)) * 0.5 + 
           Math.sin((x + y) * 0.0003);
}

/**
 * Multi-octave noise for more natural terrain
 */
export function multiOctaveNoise(x, y, octaves = 4) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
        value += perlin(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
    }

    return value / maxValue;
}

/**
 * Smooth noise using interpolation
 */
export function smoothNoise(x, y) {
    const n1 = perlin(Math.floor(x), Math.floor(y));
    const n2 = perlin(Math.floor(x) + 1, Math.floor(y));
    const n3 = perlin(Math.floor(x), Math.floor(y) + 1);
    const n4 = perlin(Math.floor(x) + 1, Math.floor(y) + 1);
    
    const fx = x - Math.floor(x);
    const fy = y - Math.floor(y);
    
    const i1 = lerp(n1, n2, fx);
    const i2 = lerp(n3, n4, fx);
    
    return lerp(i1, i2, fy);
}

// === MATH FUNCTIONS ===

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Map value from one range to another
 */
export function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Random number between min and max
 */
export function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Random integer between min and max
 */
export function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
}

// === COLOR FUNCTIONS ===

/**
 * Get color based on height (for terrain)
 */
export function getTerrainColor(height) {
    if (height < 0) return 0x3f66ff; // Water
    if (height < 5) return 0xc2b280; // Sand
    if (height < 50) return 0x4fa64f; // Grass
    if (height < 100) return 0x3d6b3d; // Dark grass
    if (height < 150) return 0x8b7355; // Rock
    return 0xffffff; // Snow
}

/**
 * Interpolate between two colors
 */
export function lerpColor(color1, color2, t) {
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    return c1.lerp(c2, t);
}

// === GEOMETRY FUNCTIONS ===

/**
 * Get height at position from terrain mesh
 */
export function getTerrainHeight(terrainMesh, x, z) {
    if (!terrainMesh || !terrainMesh.geometry) return 0;
    
    const geometry = terrainMesh.geometry;
    const vertices = geometry.attributes.position.array;
    const size = Math.sqrt(vertices.length / 3);
    
    // Convert world coords to grid coords
    const gridX = Math.floor((x + 2000) / 4000 * size);
    const gridZ = Math.floor((z + 2000) / 4000 * size);
    
    if (gridX < 0 || gridX >= size || gridZ < 0 || gridZ >= size) return 0;
    
    const index = (gridZ * size + gridX) * 3;
    return vertices[index + 1] || 0;
}

/**
 * Check if position is in water
 */
export function isInWater(y, waterLevel = 10) {
    return y < waterLevel;
}

/**
 * Distance between two points (2D)
 */
export function distance2D(x1, z1, x2, z2) {
    const dx = x2 - x1;
    const dz = z2 - z1;
    return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Distance between two points (3D)
 */
export function distance3D(x1, y1, z1, x2, y2, z2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// === TIME FUNCTIONS ===

/**
 * Convert time of day (0-1) to hours (0-24)
 */
export function timeToHours(time) {
    return (time * 24) % 24;
}

/**
 * Convert hours to time of day (0-1)
 */
export function hoursToTime(hours) {
    return (hours % 24) / 24;
}

/**
 * Get time string (HH:MM)
 */
export function getTimeString(time) {
    const hours = Math.floor(timeToHours(time));
    const minutes = Math.floor((timeToHours(time) % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// === PERFORMANCE FUNCTIONS ===

/**
 * Throttle function calls
 */
export function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func(...args);
        }
    };
}

/**
 * Debounce function calls
 */
export function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// === VECTOR FUNCTIONS ===

/**
 * Normalize angle to 0-2π
 */
export function normalizeAngle(angle) {
    while (angle < 0) angle += Math.PI * 2;
    while (angle >= Math.PI * 2) angle -= Math.PI * 2;
    return angle;
}

/**
 * Get random point on circle
 */
export function randomPointOnCircle(radius) {
    const angle = Math.random() * Math.PI * 2;
    return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius
    };
}

/**
 * Get random point in circle
 */
export function randomPointInCircle(radius) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius;
    return {
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r
    };
}

// === TEXTURE FUNCTIONS ===

/**
 * Load texture with error handling
 */
export function loadTexture(path, repeat = [1, 1]) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
        path,
        undefined,
        undefined,
        (error) => {
            console.warn(`⚠️ Could not load texture: ${path}`, error);
        }
    );
    
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]);
    
    return texture;
}

// === FORMAT FUNCTIONS ===

/**
 * Format number with commas
 */
export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format position string
 */
export function formatPosition(x, y, z) {
    return `X: ${x.toFixed(1)} Y: ${y.toFixed(1)} Z: ${z.toFixed(1)}`;
}

// === VALIDATION FUNCTIONS ===

/**
 * Check if position is valid (within world bounds)
 */
export function isValidPosition(x, z, worldSize = 4000) {
    const halfSize = worldSize / 2;
    return Math.abs(x) < halfSize && Math.abs(z) < halfSize;
}

/**
 * Check if object is visible (simple frustum check)
 */
export function isVisible(object, camera) {
    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(matrix);
    
    return frustum.intersectsObject(object);
}

// === ARRAY FUNCTIONS ===

/**
 * Shuffle array
 */
export function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Get random element from array
 */
export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// === EASING FUNCTIONS ===

export const Easing = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};

console.log('🛠️ Utils loaded');
