// 🗺️ Farm Dominion v2 - Mini-Map System
import * as THREE from './three_module.js';

export class MiniMap {
    constructor(camera, buildings, npcs) {
        this.camera = camera;
        this.buildings = buildings;
        this.npcs = npcs;
        this.canvas = null;
        this.ctx = null;
        this.scale = 0.05; // Map scale
        this.size = 200; // Canvas size
        this.worldSize = 4000;
        this.createMiniMap();
    }

    // Create mini-map UI
    createMiniMap() {
        const container = document.createElement('div');
        container.id = 'minimap-container';
        container.style.cssText = `
            position: fixed;
            bottom: 15px;
            right: 15px;
            width: ${this.size}px;
            height: ${this.size}px;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 100;
        `;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.ctx = this.canvas.getContext('2d');

        container.appendChild(this.canvas);
        document.body.appendChild(container);

        // Add title
        const title = document.createElement('div');
        title.textContent = '🗺️ Harita';
        title.style.cssText = `
            position: absolute;
            top: 5px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
            text-shadow: 1px 1px 2px black;
            pointer-events: none;
        `;
        container.appendChild(title);

        // Add compass
        const compass = document.createElement('div');
        compass.id = 'compass';
        compass.innerHTML = '↑<span style="font-size: 10px; margin-left: 2px;">K</span>';
        compass.style.cssText = `
            position: absolute;
            top: 25px;
            left: 50%;
            transform: translateX(-50%);
            color: #ff4444;
            font-size: 16px;
            font-weight: bold;
            text-shadow: 1px 1px 2px black;
            pointer-events: none;
        `;
        container.appendChild(compass);
        this.compass = compass;

        console.log('🗺️ Mini-map created');
    }

    // World to map coordinates
    worldToMap(x, z) {
        const halfWorld = this.worldSize / 2;
        const halfSize = this.size / 2;
        
        return {
            x: halfSize + ((x + halfWorld) / this.worldSize) * this.size,
            y: halfSize + ((z + halfWorld) / this.worldSize) * this.size
        };
    }

    // Update mini-map
    update(playerPosition, playerRotation) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.size, this.size);

        // Draw background
        this.ctx.fillStyle = 'rgba(20, 40, 20, 0.8)';
        this.ctx.fillRect(0, 0, this.size, this.size);

        // Draw grid
        this.drawGrid();

        // Draw buildings
        this.drawBuildings();

        // Draw NPCs
        this.drawNPCs();

        // Draw player
        this.drawPlayer(playerPosition, playerRotation);

        // Update compass rotation
        this.updateCompass(playerRotation);
    }

    // Draw grid
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        const gridSize = 40; // Grid cell size
        for (let i = 0; i <= this.size; i += gridSize) {
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.size);
            this.ctx.stroke();

            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.size, i);
            this.ctx.stroke();
        }
    }

    // Draw buildings
    drawBuildings() {
        if (!this.buildings) return;

        this.buildings.forEach(building => {
            const pos = this.worldToMap(
                building.position.x,
                building.position.z
            );

            // Building icon
            this.ctx.fillStyle = '#8b6f47';
            this.ctx.fillRect(pos.x - 3, pos.y - 3, 6, 6);
            
            // Building border
            this.ctx.strokeStyle = '#ffa500';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(pos.x - 3, pos.y - 3, 6, 6);
        });
    }

    // Draw NPCs
    drawNPCs() {
        if (!this.npcs) return;

        this.npcs.forEach(npc => {
            if (!npc.mesh) return;

            const pos = this.worldToMap(
                npc.mesh.position.x,
                npc.mesh.position.z
            );

            // NPC dot
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    // Draw player
    drawPlayer(playerPosition, playerRotation) {
        const pos = this.worldToMap(playerPosition.x, playerPosition.z);

        // Player position circle
        this.ctx.fillStyle = '#4ade80';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
        this.ctx.fill();

        // Player direction indicator
        const dirLength = 12;
        const dirX = pos.x + Math.sin(playerRotation) * dirLength;
        const dirY = pos.y + Math.cos(playerRotation) * dirLength;

        this.ctx.strokeStyle = '#4ade80';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.lineTo(dirX, dirY);
        this.ctx.stroke();

        // Player dot (center)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Update compass
    updateCompass(rotation) {
        if (this.compass) {
            this.compass.style.transform = `translateX(-50%) rotate(${rotation}rad)`;
        }
    }

    // Toggle visibility
    toggle() {
        const container = document.getElementById('minimap-container');
        if (container) {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Set buildings reference
    setBuildings(buildings) {
        this.buildings = buildings;
    }

    // Set NPCs reference
    setNPCs(npcs) {
        this.npcs = npcs;
    }
}

console.log('🗺️ Mini-map system loaded');
