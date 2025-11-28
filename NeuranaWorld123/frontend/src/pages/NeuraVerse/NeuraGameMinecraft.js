import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './MinecraftUI.css';
import { getBlockMaterial, blockCategories, blockNames } from './blockMaterials';
import { createPlayer, createSkyblockIsland, setupPlayerControls } from './playerSystem';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const NeuraGameMinecraft = () => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState('test_player_1');
  
  // Minecraft-style state
  const [selectedHotbarSlot, setSelectedHotbarSlot] = useState(0);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [showCoords, setShowCoords] = useState(false);
  const [health, setHealth] = useState(10);
  const [hunger, setHunger] = useState(10);
  const [position, setPosition] = useState({ x: 0, y: 2, z: 0 });
  const [cameraMode, setCameraMode] = useState('first-person'); // first-person or third-person
  
  // Hotbar items (9 slots)
  const [hotbar, setHotbar] = useState([
    { type: 'grass', count: 64 },
    { type: 'dirt', count: 64 },
    { type: 'stone', count: 64 },
    { type: 'wood', count: 64 },
    { type: 'sand', count: 64 },
    { type: 'cobblestone', count: 64 },
    { type: 'glass', count: 64 },
    { type: 'diamond_ore', count: 16 },
    null
  ]);
  
  // Inventory items (27 slots)
  const [inventory, setInventory] = useState(Array(27).fill(null));
  
  // Selected category for creative inventory
  const [selectedCategory, setSelectedCategory] = useState('basic');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!canvasRef.current) {
        console.error('❌ Canvas not found');
        setError('Canvas initialization failed');
        setLoading(false);
        return;
      }

      const initBabylon = async () => {
        try {
          console.log('🎮 Babylon.js + Player Character başlatılıyor...');
          const BABYLON = await import('@babylonjs/core');

          const engine = new BABYLON.Engine(canvasRef.current, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            powerPreference: "high-performance",
            adaptToDeviceRatio: true
          });
          engine.setHardwareScalingLevel(1 / window.devicePixelRatio);

          const scene = new BABYLON.Scene(engine);
          scene.clearColor = new BABYLON.Color3(0.5, 0.7, 1.0);
          scene.gravity = new BABYLON.Vector3(0, -0.15, 0); // Daha yumuşak gravity
          scene.collisionsEnabled = true;

          // Camera - First Person (Minecraft style) - HIZLANDIRILDI
          const camera = new BABYLON.UniversalCamera(
            'camera',
            new BABYLON.Vector3(0, 2.5, 0), // Platform üzerinde başlat
            scene
          );
          camera.attachControl(canvasRef.current, true);
          camera.applyGravity = true;
          camera.checkCollisions = true;
          camera.ellipsoid = new BABYLON.Vector3(0.5, 0.9, 0.5); // Karakter boyutu
          camera.speed = 0.5; // HIZLI HAREKET
          camera.angularSensibility = 400; // HIZLI BAKIŞ (daha düşük = daha hızlı)
          camera.inertia = 0.3; // Daha responsive
          
          // Keyboard tuşları
          camera.keysUp = [87]; // W
          camera.keysDown = [83]; // S
          camera.keysLeft = [65]; // A
          camera.keysRight = [68]; // D

          // Lights
          const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
          light1.intensity = 0.8;
          const light2 = new BABYLON.DirectionalLight('light2', new BABYLON.Vector3(-1, -2, -1), scene);
          light2.intensity = 0.6;

          // Skybox (Minecraft sky)
          const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
          const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
          skyboxMaterial.backFaceCulling = false;
          skyboxMaterial.disableLighting = true;
          skybox.material = skyboxMaterial;
          skybox.infiniteDistance = true;
          skyboxMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.7, 1.0);
          skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

          console.log('🏝️ Skyblock adası oluşturuluyor...');

          // Create Skyblock Island
          createSkyblockIsland(scene, BABYLON, getBlockMaterial);

          // Create Player Character
          console.log('👤 Oyuncu karakteri oluşturuluyor...');
          const player = createPlayer(scene, BABYLON);
          player.node.position = new BABYLON.Vector3(0, 2.5, 0);
          
          // Camera mode control
          let thirdPerson = false;
          
          // F5 for camera toggle + Jump control
          let canJump = true;
          scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
              const key = kbInfo.event.key.toLowerCase();
              
              // F5 - Camera toggle
              if (key === 'f5') {
                thirdPerson = !thirdPerson;
                setCameraMode(thirdPerson ? 'third-person' : 'first-person');
                console.log(`📷 Kamera modu: ${thirdPerson ? 'Üçüncü Şahıs' : 'Birinci Şahıs'}`);
              }
              
              // Space - Jump (1.25 blok yüksekliği)
              if (kbInfo.event.keyCode === 32 && canJump) {
                camera.cameraDirection.y = 0.5; // 1.25 blok zıplama
                canJump = false;
                setTimeout(() => { canJump = true; }, 400);
              }
            }
          });

          // Update player and camera
          scene.onBeforeRenderObservable.add(() => {
            // Player follows camera position
            player.node.position.x = camera.position.x;
            player.node.position.z = camera.position.z;
            player.node.position.y = camera.position.y - 1.5;
            
            // Player faces camera direction
            player.node.rotation.y = camera.rotation.y;
            
            // Camera mode handling
            if (thirdPerson) {
              // Third-person: Show player, camera behind
              player.node.setEnabled(true);
              
              // Calculate camera position behind player
              const distance = 5;
              const offset = new BABYLON.Vector3(
                Math.sin(camera.rotation.y) * distance,
                2,
                Math.cos(camera.rotation.y) * distance
              );
              
              // Smoothly move camera (not working with UniversalCamera, so we just show player)
            } else {
              // First-person: Hide player
              player.node.setEnabled(false);
            }
            
            // Update position state
            setPosition({
              x: Math.round(camera.position.x * 10) / 10,
              y: Math.round(camera.position.y * 10) / 10,
              z: Math.round(camera.position.z * 10) / 10
            });
          });

          console.log('✅ Platform ve oyuncu tamamlandı!');

          engine.runRenderLoop(() => {
            scene.render();
          });

          setLoading(false);
          console.log('✅ Her şey hazır! WASD: Hareket, Space: Zıpla, Shift: Çömel, F5: Kamera');

          window.addEventListener('resize', () => engine.resize());

        } catch (err) {
          console.error('❌ Error:', err);
          setError(err.message);
          setLoading(false);
        }
      };

      initBabylon();
    }, 100);

    return () => clearTimeout(timer);
  }, [userId]);

  // Keyboard controls for UI
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Number keys 1-9 for hotbar
      if (e.key >= '1' && e.key <= '9') {
        setSelectedHotbarSlot(parseInt(e.key) - 1);
      }
      // E for inventory
      if (e.key === 'e' || e.key === 'E') {
        setInventoryOpen(!inventoryOpen);
      }
      // F3 for coordinates
      if (e.key === 'F3') {
        e.preventDefault();
        setShowCoords(!showCoords);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inventoryOpen, showCoords]);

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
          <p>🎮 NeuranaGame Yükleniyor...</p>
          <p style={{ fontSize: '14px', marginTop: '10px', opacity: 0.8 }}>
            Minecraft-style Skyblock + Player Character
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="neuraverse-container">
      <canvas ref={canvasRef} className="neuraverse-canvas" />

      <div className="neuraverse-ui">
        {/* Crosshair */}
        <div className="crosshair"></div>

        {/* Health & Hunger */}
        <div className="status-bars">
          <div className="health-bar">
            {[...Array(health)].map((_, i) => (
              <span key={i} className="heart">❤️</span>
            ))}
          </div>
          <div className="hunger-bar">
            {[...Array(hunger)].map((_, i) => (
              <span key={i} className="food">🍖</span>
            ))}
          </div>
        </div>

        {/* Hotbar */}
        <div className="hotbar">
          {hotbar.map((item, index) => (
            <div
              key={index}
              className={`hotbar-slot ${selectedHotbarSlot === index ? 'active' : ''}`}
              onClick={() => setSelectedHotbarSlot(index)}
            >
              <div className="hotbar-number">{index + 1}</div>
              {item && (
                <>
                  <div className={`block-icon ${item.type}`}></div>
                  {item.count > 1 && <span className="item-count">{item.count}</span>}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Inventory (E to open) */}
        <div className={`minecraft-inventory ${inventoryOpen ? 'open' : ''}`}>
          <div className="inventory-title">Envanter</div>
          
          {/* Creative Tabs */}
          <div className="creative-tabs">
            <div 
              className={`creative-tab ${selectedCategory === 'basic' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('basic')}
            >
              🌱
            </div>
            <div 
              className={`creative-tab ${selectedCategory === 'building' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('building')}
            >
              🏗️
            </div>
            <div 
              className={`creative-tab ${selectedCategory === 'ores' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('ores')}
            >
              💎
            </div>
            <div 
              className={`creative-tab ${selectedCategory === 'liquids' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('liquids')}
            >
              💧
            </div>
          </div>

          {/* Available Blocks (Creative Mode) */}
          <div className="inventory-section-label">Bloklar ({blockCategories[selectedCategory].length})</div>
          <div className="inventory-grid">
            {blockCategories[selectedCategory].map((blockType, index) => (
              <div key={index} className="inventory-slot">
                <div className={`block-icon ${blockType}`}></div>
                <span className="item-count">∞</span>
              </div>
            ))}
          </div>

          {/* Player Inventory */}
          <div className="inventory-section-label">Envanter (27)</div>
          <div className="inventory-grid" style={{ gridTemplateRows: 'repeat(3, 40px)' }}>
            {inventory.map((item, index) => (
              <div key={index} className="inventory-slot">
                {item && (
                  <>
                    <div className={`block-icon ${item.type}`}></div>
                    {item.count > 1 && <span className="item-count">{item.count}</span>}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Hotbar in Inventory */}
          <div className="inventory-section-label">Hızlı Çubuk</div>
          <div className="inventory-grid" style={{ gridTemplateColumns: 'repeat(9, 40px)', gridTemplateRows: '40px' }}>
            {hotbar.map((item, index) => (
              <div key={index} className="inventory-slot">
                {item && (
                  <>
                    <div className={`block-icon ${item.type}`}></div>
                    {item.count > 1 && <span className="item-count">{item.count}</span>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coordinates (F3) */}
        <div className={`coordinates ${showCoords ? '' : 'hidden'}`}>
          <div>NeuranaGame v1.0 (Minecraft Clone)</div>
          <div>Kamera Modu: {cameraMode === 'first-person' ? 'Birinci Şahıs' : 'Üçüncü Şahıs'}</div>
          <div>XYZ: {position.x.toFixed(1)} / {position.y.toFixed(1)} / {position.z.toFixed(1)}</div>
          <div>Chunk: {Math.floor(position.x / 16)} {Math.floor(position.z / 16)}</div>
          <div>FPS: 60</div>
        </div>

        {/* Messages */}
        <div className="message-area">
          <div className="message">Minecraft Clone - Skyblock!</div>
          <div className="message">WASD: Hareket | Space: Zıpla | Shift: Çömel | F5: Kamera</div>
          <div className="message">E: Envanter | F3: Koordinatlar | Mouse: Bakış</div>
        </div>
      </div>
    </div>
  );
};

export default NeuraGameMinecraft;
