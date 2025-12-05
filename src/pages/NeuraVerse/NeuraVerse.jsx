import React, { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import axios from 'axios';
import './NeuraVerse.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

const NeuraVerse = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [islandData, setIslandData] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState('grass');
  const [loading, setLoading] = useState(true);
  const [userId] = useState('test_player_1');

  // Initialize everything at once
  useEffect(() => {
    if (!canvasRef.current) return;

    let isInitialized = false;

    const initEverything = async () => {
      // Guard against React StrictMode double execution
      if (isInitialized) {
        console.log('⚠️ Already initialized, skipping...');
        return;
      }
      
      isInitialized = true;

      try {
        console.log('🎮 Babylon.js başlatılıyor...');

        // Create engine
        const engine = new BABYLON.Engine(canvasRef.current, true, {
          preserveDrawingBuffer: true,
          stencil: true,
          antialias: true
        });
        engineRef.current = engine;

        // Create scene
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.5, 0.7, 1.0);
        sceneRef.current = scene;

        // Camera
        const camera = new BABYLON.ArcRotateCamera(
          'camera',
          -Math.PI / 4,
          Math.PI / 3,
          25,
          new BABYLON.Vector3(0, 0, 0),
          scene
        );
        camera.attachControl(canvasRef.current, true);
        camera.lowerRadiusLimit = 10;
        camera.upperRadiusLimit = 50;

        // Lights
        const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
        light1.intensity = 0.7;

        const light2 = new BABYLON.DirectionalLight('light2', new BABYLON.Vector3(-1, -2, -1), scene);
        light2.intensity = 0.5;

        console.log('🏝️ Skyblock platformu oluşturuluyor...');

        // Create 5x5 grass platform
        for (let x = -2; x <= 2; x++) {
          for (let z = -2; z <= 2; z++) {
            const box = BABYLON.MeshBuilder.CreateBox(`block_${x}_0_${z}`, { size: 1 }, scene);
            box.position = new BABYLON.Vector3(x, 0, z);
            const mat = new BABYLON.StandardMaterial(`mat_grass_${x}_0_${z}`, scene);
            mat.diffuseColor = new BABYLON.Color3(0.3, 0.8, 0.3);
            mat.specularColor = new BABYLON.Color3(0, 0, 0);
            box.enableEdgesRendering();
            box.edgesWidth = 4.0;
            box.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
            box.material = mat;
          }
        }

        // Add dirt below
        for (let x = -1; x <= 1; x++) {
          for (let z = -1; z <= 1; z++) {
            const box = BABYLON.MeshBuilder.CreateBox(`block_${x}_-1_${z}`, { size: 1 }, scene);
            box.position = new BABYLON.Vector3(x, -1, z);
            const mat = new BABYLON.StandardMaterial(`mat_dirt_${x}_-1_${z}`, scene);
            mat.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.2);
            mat.specularColor = new BABYLON.Color3(0, 0, 0);
            box.enableEdgesRendering();
            box.edgesWidth = 4.0;
            box.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
            box.material = mat;
          }
        }

        // Add one stone
        const stone = BABYLON.MeshBuilder.CreateBox(`block_0_1_0`, { size: 1 }, scene);
        stone.position = new BABYLON.Vector3(0, 1, 0);
        const stoneMat = new BABYLON.StandardMaterial(`mat_stone_0_1_0`, scene);
        stoneMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        stoneMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        stone.enableEdgesRendering();
        stone.edgesWidth = 4.0;
        stone.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
        stone.material = stoneMat;

        console.log('✅ Platform oluşturuldu - 35 blok!');

        // Start render loop BEFORE loading data
        engine.runRenderLoop(() => {
          scene.render();
        });

        console.log('✅ Render loop başlatıldı!');

        // Load island data (async, non-blocking)
        console.log('📦 Ada yükleniyor...');
        try {
          let response = await axios.get(`${BACKEND_URL}/api/neuraverse/island/${userId}`);
          if (!response.data.island) {
            await axios.post(`${BACKEND_URL}/api/neuraverse/island/create`, {
              user_id: userId,
              theme: 'modern'
            });
            response = await axios.get(`${BACKEND_URL}/api/neuraverse/island/${userId}`);
          }
          setIslandData(response.data.island);
          setInventory(response.data.inventory);
          console.log('✅ Ada yüklendi!');
        } catch (error) {
          console.error('❌ Ada yükleme hatası:', error);
          // Continue anyway, we have the platform
        }

        // Hide loading screen
        setLoading(false);
        console.log('✅ Her şey hazır - 3D dünya aktif!');

        // Handle resize
        const handleResize = () => {
          if (engine) engine.resize();
        };
        window.addEventListener('resize', handleResize);

      } catch (error) {
        console.error('❌ Init error:', error);
        setLoading(false);
      }
    };

    initEverything();

    return () => {
      if (engineRef.current && !isInitialized) {
        console.log('🧹 Cleanup - disposing engine');
        engineRef.current.dispose();
      }
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="neuraverse-loading">
        <div className="loading-spinner"></div>
        <p>🎮 NeuraVerse Skyblock Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="neuraverse-container">
      <canvas ref={canvasRef} className="neuraverse-canvas" />

      {/* UI Overlay */}
      <div className="neuraverse-ui">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="game-title">⛏️ NeuraVerse Skyblock</div>
          <div className="inventory-display">
            <div className="inventory-item">
              💎 {inventory?.diamonds || 0}
            </div>
          </div>
        </div>

        {/* Block Selector */}
        <div className="block-selector">
          <h3>🧱 Blok Seç</h3>
          <div className="block-options">
            <button
              className={`block-btn ${selectedBlock === 'grass' ? 'active' : ''}`}
              onClick={() => setSelectedBlock('grass')}
            >
              <div className="block-preview grass"></div>
              <span>Grass</span>
            </button>
            <button
              className={`block-btn ${selectedBlock === 'dirt' ? 'active' : ''}`}
              onClick={() => setSelectedBlock('dirt')}
            >
              <div className="block-preview dirt"></div>
              <span>Dirt</span>
            </button>
            <button
              className={`block-btn ${selectedBlock === 'stone' ? 'active' : ''}`}
              onClick={() => setSelectedBlock('stone')}
            >
              <div className="block-preview stone"></div>
              <span>Stone</span>
            </button>
            <button
              className={`block-btn ${selectedBlock === 'wood' ? 'active' : ''}`}
              onClick={() => setSelectedBlock('wood')}
            >
              <div className="block-preview wood"></div>
              <span>Wood</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-panel">
          <h3>🎮 Kontroller</h3>
          <ul>
            <li>🖱️ <strong>Sol Tık:</strong> Blok Koy/Kaldır</li>
            <li>🖱️ <strong>Sağ Tık + Sürükle:</strong> Kamera</li>
            <li>⚙️ <strong>Mouse Wheel:</strong> Zoom</li>
          </ul>
          <div className="controls-tips">
            <p>💡 <strong>İpucu:</strong> Minecraft gibi blokları üst üste koyarak inşa edin!</p>
          </div>
        </div>

        {/* Machine Panel */}
        <div className="machine-panel">
          <h3>⚙️ Makineler (Yakında)</h3>
          <div className="machine-grid">
            <div className="machine-item disabled">
              <span>⛏️</span>
              <p>Drill</p>
            </div>
            <div className="machine-item disabled">
              <span>🔥</span>
              <p>Furnace</p>
            </div>
            <div className="machine-item disabled">
              <span>📦</span>
              <p>Conveyor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuraVerse;
