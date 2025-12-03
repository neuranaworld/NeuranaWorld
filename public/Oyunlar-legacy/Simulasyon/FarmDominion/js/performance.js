// 📊 Farm Dominion v2 - Performance Monitor
export class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsHistory = [];
        this.maxHistoryLength = 60;
        this.panel = null;
        this.enabled = false;
        this.createPanel();
    }

    // Create monitoring panel
    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'perf-monitor';
        this.panel.style.cssText = `
            position: fixed;
            top: 15px;
            right: 230px;
            width: 250px;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            color: #0f0;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid rgba(0, 255, 0, 0.3);
            display: none;
            z-index: 10000;
            line-height: 1.6;
        `;

        const title = document.createElement('div');
        title.textContent = '📊 PERFORMANCE MONITOR';
        title.style.cssText = `
            color: #4ade80;
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 12px;
            border-bottom: 1px solid rgba(0, 255, 0, 0.3);
            padding-bottom: 4px;
        `;
        this.panel.appendChild(title);

        // FPS Display
        this.fpsDisplay = this.createMetric('FPS', '0');
        this.panel.appendChild(this.fpsDisplay);

        // Frame Time
        this.frameTimeDisplay = this.createMetric('Frame Time', '0 ms');
        this.panel.appendChild(this.frameTimeDisplay);

        // Memory (if available)
        if (performance.memory) {
            this.memoryDisplay = this.createMetric('Memory', '0 MB');
            this.panel.appendChild(this.memoryDisplay);
        }

        // Draw Calls (estimated)
        this.drawCallsDisplay = this.createMetric('Draw Calls', '~0');
        this.panel.appendChild(this.drawCallsDisplay);

        // Triangles (estimated)
        this.trianglesDisplay = this.createMetric('Triangles', '~0');
        this.panel.appendChild(this.trianglesDisplay);

        // FPS Graph
        this.fpsGraph = document.createElement('canvas');
        this.fpsGraph.width = 226;
        this.fpsGraph.height = 50;
        this.fpsGraph.style.cssText = `
            margin-top: 8px;
            border: 1px solid rgba(0, 255, 0, 0.3);
            border-radius: 4px;
        `;
        this.panel.appendChild(this.fpsGraph);
        this.graphCtx = this.fpsGraph.getContext('2d');

        document.body.appendChild(this.panel);
    }

    // Create metric display
    createMetric(label, value) {
        const metric = document.createElement('div');
        metric.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
            padding: 2px 0;
        `;

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label + ':';
        labelSpan.style.color = '#888';

        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;
        valueSpan.style.cssText = `
            color: #0f0;
            font-weight: bold;
        `;
        valueSpan.className = 'metric-value';

        metric.appendChild(labelSpan);
        metric.appendChild(valueSpan);
        return metric;
    }

    // Update metric value
    updateMetric(display, value, color = '#0f0') {
        const valueSpan = display.querySelector('.metric-value');
        if (valueSpan) {
            valueSpan.textContent = value;
            valueSpan.style.color = color;
        }
    }

    // Toggle monitor
    toggle() {
        this.enabled = !this.enabled;
        this.panel.style.display = this.enabled ? 'block' : 'none';
        return this.enabled;
    }

    // Update FPS
    update(renderer) {
        if (!this.enabled) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.frameCount++;

        // Update FPS every second
        if (deltaTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameCount = 0;
            this.lastTime = currentTime;

            // Add to history
            this.fpsHistory.push(this.fps);
            if (this.fpsHistory.length > this.maxHistoryLength) {
                this.fpsHistory.shift();
            }

            // Update displays
            this.updateFPS();
            this.updateMemory();
            this.updateRenderer(renderer);
            this.drawGraph();
        }
    }

    // Update FPS display
    updateFPS() {
        const frameTime = (1000 / this.fps).toFixed(2);
        
        // Color based on FPS
        let fpsColor = '#0f0';
        if (this.fps < 30) fpsColor = '#f00';
        else if (this.fps < 45) fpsColor = '#ff0';
        
        this.updateMetric(this.fpsDisplay, this.fps.toString(), fpsColor);
        this.updateMetric(this.frameTimeDisplay, frameTime + ' ms');
    }

    // Update memory display
    updateMemory() {
        if (!performance.memory || !this.memoryDisplay) return;

        const usedMemory = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
        const totalMemory = (performance.memory.totalJSHeapSize / 1048576).toFixed(2);
        
        let memColor = '#0f0';
        const memPercent = performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize;
        if (memPercent > 0.9) memColor = '#f00';
        else if (memPercent > 0.7) memColor = '#ff0';

        this.updateMetric(this.memoryDisplay, `${usedMemory}/${totalMemory} MB`, memColor);
    }

    // Update renderer info
    updateRenderer(renderer) {
        if (!renderer || !renderer.info) return;

        const info = renderer.info;
        
        // Draw calls
        const drawCalls = info.render.calls || 0;
        this.updateMetric(this.drawCallsDisplay, '~' + drawCalls);

        // Triangles
        const triangles = info.render.triangles || 0;
        const trianglesK = (triangles / 1000).toFixed(1) + 'K';
        this.updateMetric(this.trianglesDisplay, '~' + trianglesK);
    }

    // Draw FPS graph
    drawGraph() {
        if (!this.graphCtx) return;

        const ctx = this.graphCtx;
        const width = this.fpsGraph.width;
        const height = this.fpsGraph.height;

        // Clear
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= height; i += height / 4) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        // Draw FPS line
        if (this.fpsHistory.length < 2) return;

        const maxFPS = 60;
        const barWidth = width / this.maxHistoryLength;

        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        
        this.fpsHistory.forEach((fps, i) => {
            const barHeight = (fps / maxFPS) * height;
            const x = i * barWidth;
            const y = height - barHeight;
            
            // Color based on FPS
            if (fps < 30) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            } else if (fps < 45) {
                ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
            } else {
                ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
            }
            
            ctx.fillRect(x, y, barWidth - 1, barHeight);
        });

        // Draw 60 FPS line
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, 0);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw 30 FPS line
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
    }

    // Get current FPS
    getCurrentFPS() {
        return this.fps;
    }

    // Get average FPS
    getAverageFPS() {
        if (this.fpsHistory.length === 0) return 0;
        const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
        return Math.round(sum / this.fpsHistory.length);
    }

    // Get min FPS
    getMinFPS() {
        if (this.fpsHistory.length === 0) return 0;
        return Math.min(...this.fpsHistory);
    }

    // Get max FPS
    getMaxFPS() {
        if (this.fpsHistory.length === 0) return 0;
        return Math.max(...this.fpsHistory);
    }

    // Reset stats
    reset() {
        this.fps = 0;
        this.frameCount = 0;
        this.fpsHistory = [];
        this.lastTime = performance.now();
    }
}

console.log('📊 Performance monitor loaded');
