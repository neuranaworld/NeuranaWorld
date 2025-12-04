import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './NeuraVerse.css';
import { getBlockMaterial, blockCategories, blockNames } from './blockMaterials';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const NeuraVerse = () => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState('test_player_1');
  const [selectedBlock, setSelectedBlock] = useState('grass');
  const [selectedCategory, setSelectedCategory] = useState('basic');

  useEffect(() => {
    // Wait for canvas to be mounted
    const timer = setTimeout(() => {
      if (!canvasRef.current) {
        console.error('❌ Canvas still not found after timeout');
        setError('Canvas initialization failed');
        setLoading(false);
        return;
      }

      const initBabylon = async () => {
        try {
          console.log('🎮 Step 1: Component mounted');
          console.log('🎮 Step 2: Canvas ref OK');
          
          // Dynamic import Babylon.js
          console.log('🎮 Step 3: Loading Babylon.js...');
          const BABYLON = await import('@babylonjs/core');
          console.log('✅ Step 4: Babylon.js loaded!');

          // Create engine with better quality
          console.log('🎮 Step 5: Creating engine...');
          const engine = new BABYLON.Engine(canvasRef.current, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            powerPreference: "high-performance",
            doNotHandleContextLost: true,
            adaptToDeviceRatio: true
          });
          engine.setHardwareScalingLevel(1 / window.devicePixelRatio);
          console.log('✅ Step 6: Engine created with high quality!');

          // Create scene
          console.log('🎮 Step 7: Creating scene...');
          const scene = new BABYLON.Scene(engine);
          scene.clearColor = new BABYLON.Color3(0.5, 0.7, 1.0);
          console.log('✅ Step 8: Scene created!');

          // Camera
          const camera = new BABYLON.ArcRotateCamera(
            'camera',
            -Math.PI / 4,
            Math.PI / 3,
            20,
            new BABYLON.Vector3(0, 0, 0),
            scene
          );
          camera.attachControl(canvasRef.current, true);
          camera.lowerRadiusLimit = 5;
          camera.upperRadiusLimit = 50;

          // Lights
          const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
          light1.intensity = 0.8;

          const light2 = new BABYLON.DirectionalLight('light2', new BABYLON.Vector3(-1, -2, -1), scene);
          light2.intensity = 0.6;

          console.log('🏝️ Step 9: Creating Skyblock platform...');

          // Create 5x5 grass platform with better materials
          for (let x = -2; x <= 2; x++) {
            for (let z = -2; z <= 2; z++) {
              const box = BABYLON.MeshBuilder.CreateBox(`grass_${x}_${z}`, { size: 1 }, scene);
              box.position = new BABYLON.Vector3(x, 0, z);
              
              const mat = new BABYLON.StandardMaterial(`mat_grass_${x}_${z}`, scene);
              mat.diffuseColor = new BABYLON.Color3(0.35, 0.75, 0.25);
              mat.ambientColor = new BABYLON.Color3(0.1, 0.3, 0.1);
              mat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
              mat.specularPower = 32;
              
              box.enableEdgesRendering();
              box.edgesWidth = 3.0;
              box.edgesColor = new BABYLON.Color4(0, 0, 0, 0.8);
              box.material = mat;
            }
          }

          // Add 3x3 dirt below with better materials
          for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
              const box = BABYLON.MeshBuilder.CreateBox(`dirt_${x}_${z}`, { size: 1 }, scene);
              box.position = new BABYLON.Vector3(x, -1, z);
              
              const mat = new BABYLON.StandardMaterial(`mat_dirt_${x}_${z}`, scene);
              mat.diffuseColor = new BABYLON.Color3(0.55, 0.35, 0.2);
              mat.ambientColor = new BABYLON.Color3(0.2, 0.1, 0.05);
              mat.specularColor = new BABYLON.Color3(0.02, 0.02, 0.02);
              mat.specularPower = 16;
              
              box.enableEdgesRendering();
              box.edgesWidth = 3.0;
              box.edgesColor = new BABYLON.Color4(0, 0, 0, 0.8);
              box.material = mat;
            }
          }

          // Add one stone block on top with better material
          const stone = BABYLON.MeshBuilder.CreateBox('stone', { size: 1 }, scene);
          stone.position = new BABYLON.Vector3(0, 1, 0);
          const stoneMat = new BABYLON.StandardMaterial('mat_stone', scene);
          stoneMat.diffuseColor = new BABYLON.Color3(0.55, 0.55, 0.55);
          stoneMat.ambientColor = new BABYLON.Color3(0.15, 0.15, 0.15);
          stoneMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
          stoneMat.specularPower = 64;
          stone.enableEdgesRendering();
          stone.edgesWidth = 3.0;
          stone.edgesColor = new BABYLON.Color4(0, 0, 0, 0.8);
          stone.material = stoneMat;

          console.log('✅ Step 10: Platform created - 35 blocks!');

          // Start render loop
          engine.runRenderLoop(() => {
            scene.render();
          });

          console.log('✅ Step 11: Render loop started!');

          // Load island data
          try {
            let response = await axios.get(`${BACKEND_URL}/api/neuraverse/island/${userId}`);
            if (!response.data.island) {
              await axios.post(`${BACKEND_URL}/api/neuraverse/island/create`, {
                user_id: userId,
                theme: 'modern'
              });
            }
            console.log('✅ Step 12: Island data loaded!');
          } catch (err) {
            console.error('⚠️ Island load error (continuing anyway):', err);
          }

          setLoading(false);
          console.log('🎉 SUCCESS! NeuraVerse 3D world is ready!');

          // Handle resize
          window.addEventListener('resize', () => engine.resize());

          return () => {
            engine.dispose();
          };

        } catch (err) {
          console.error('❌ FATAL ERROR:', err);
          setError(err.message);
          setLoading(false);
        }
      };

      initBabylon();
    }, 100); // Wait 100ms for canvas to be ready

    return () => clearTimeout(timer);
  }, [userId]);

  if (error) {
    return (
      <div style={{ padding: '50px', background: '#ff4444', color: 'white' }}>
        <h1>❌ Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="neuraverse-container">
        <canvas ref={canvasRef} className="neuraverse-canvas" style={{ display: 'none' }} />
        <div className="neuraverse-loading">
          <div className="loading-spinner"></div>
          <p>🎮 NeuranaGame Skyblock Yükleniyor...</p>
          <p style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>
            Console'u açın - debug logları görün!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="neuraverse-container">
      <canvas ref={canvasRef} className="neuraverse-canvas" />

      <div className="neuraverse-ui">
        <div className="top-bar">
          <div className="game-title">⛏️ NeuranaGame Skyblock</div>
          <div className="inventory-display">
            <div className="inventory-item">💎 0</div>
          </div>
        </div>

        {/* Block Selector with Categories */}
        <div className="block-selector">
          <div className="category-tabs">
            <button 
              className={selectedCategory === 'basic' ? 'active' : ''}
              onClick={() => setSelectedCategory('basic')}
            >
              🌱 Temel
            </button>
            <button 
              className={selectedCategory === 'building' ? 'active' : ''}
              onClick={() => setSelectedCategory('building')}
            >
              🏗️ İnşaat
            </button>
            <button 
              className={selectedCategory === 'ores' ? 'active' : ''}
              onClick={() => setSelectedCategory('ores')}
            >
              💎 Madenler
            </button>
            <button 
              className={selectedCategory === 'liquids' ? 'active' : ''}
              onClick={() => setSelectedCategory('liquids')}
            >
              💧 Sıvılar
            </button>
          </div>
          <div className="block-options">
            {blockCategories[selectedCategory].map(blockType => (
              <button 
                key={blockType}
                className={`block-btn ${selectedBlock === blockType ? 'active' : ''}`}
                onClick={() => setSelectedBlock(blockType)}
              >
                <div className={`block-preview ${blockType}`}></div>
                <span>{blockNames[blockType]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Panel - NEW */}
        <div className="inventory-panel">
          <h3>🎒 Envanter</h3>
          <div className="inventory-grid">
            <div className="inventory-slot">
              <div className="block-preview grass"></div>
              <span className="item-count">64</span>
            </div>
            <div className="inventory-slot">
              <div className="block-preview dirt"></div>
              <span className="item-count">32</span>
            </div>
            <div className="inventory-slot">
              <div className="block-preview stone"></div>
              <span className="item-count">16</span>
            </div>
            <div className="inventory-slot">
              <div className="block-preview wood"></div>
              <span className="item-count">8</span>
            </div>
            <div className="inventory-slot empty">
              <span className="empty-slot">+</span>
            </div>
            <div className="inventory-slot empty">
              <span className="empty-slot">+</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-panel">
          <h3>🎮 Kontroller</h3>
          <ul>
            <li>🖱️ <strong>Sağ Tık + Sürükle:</strong> Kamera</li>
            <li>⚙️ <strong>Mouse Wheel:</strong> Zoom</li>
          </ul>
          <div className="controls-tips">
            <p>💡 <strong>3D dünya hazır!</strong> Minecraft Skyblock tarzı platform!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuraVerse;
