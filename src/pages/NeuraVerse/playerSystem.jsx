// Player Character for NeuranaGame
export const createPlayer = (scene, BABYLON) => {
  // Player body (Minecraft-style cubic character)
  const player = new BABYLON.TransformNode("player", scene);
  
  // Head
  const head = BABYLON.MeshBuilder.CreateBox("head", { 
    width: 0.5, 
    height: 0.5, 
    depth: 0.5 
  }, scene);
  head.position.y = 1.5;
  head.parent = player;
  
  const headMat = new BABYLON.StandardMaterial("headMat", scene);
  headMat.diffuseColor = new BABYLON.Color3(0.9, 0.7, 0.6); // Skin color
  head.material = headMat;
  head.enableEdgesRendering();
  head.edgesWidth = 2.0;
  head.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  
  // Body
  const body = BABYLON.MeshBuilder.CreateBox("body", { 
    width: 0.5, 
    height: 0.75, 
    depth: 0.25 
  }, scene);
  body.position.y = 0.875;
  body.parent = player;
  
  const bodyMat = new BABYLON.StandardMaterial("bodyMat", scene);
  bodyMat.diffuseColor = new BABYLON.Color3(0.2, 0.5, 0.8); // Blue shirt
  body.material = bodyMat;
  body.enableEdgesRendering();
  body.edgesWidth = 2.0;
  body.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  
  // Arms
  const armMat = new BABYLON.StandardMaterial("armMat", scene);
  armMat.diffuseColor = new BABYLON.Color3(0.9, 0.7, 0.6);
  
  const leftArm = BABYLON.MeshBuilder.CreateBox("leftArm", { 
    width: 0.2, 
    height: 0.75, 
    depth: 0.2 
  }, scene);
  leftArm.position.set(-0.35, 0.875, 0);
  leftArm.parent = player;
  leftArm.material = armMat;
  leftArm.enableEdgesRendering();
  leftArm.edgesWidth = 2.0;
  leftArm.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  
  const rightArm = BABYLON.MeshBuilder.CreateBox("rightArm", { 
    width: 0.2, 
    height: 0.75, 
    depth: 0.2 
  }, scene);
  rightArm.position.set(0.35, 0.875, 0);
  rightArm.parent = player;
  rightArm.material = armMat;
  rightArm.enableEdgesRendering();
  rightArm.edgesWidth = 2.0;
  rightArm.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  
  // Legs
  const legMat = new BABYLON.StandardMaterial("legMat", scene);
  legMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.4); // Blue pants
  
  const leftLeg = BABYLON.MeshBuilder.CreateBox("leftLeg", { 
    width: 0.24, 
    height: 0.75, 
    depth: 0.24 
  }, scene);
  leftLeg.position.set(-0.13, 0.375, 0);
  leftLeg.parent = player;
  leftLeg.material = legMat;
  leftLeg.enableEdgesRendering();
  leftLeg.edgesWidth = 2.0;
  leftLeg.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  
  const rightLeg = BABYLON.MeshBuilder.CreateBox("rightLeg", { 
    width: 0.24, 
    height: 0.75, 
    depth: 0.24 
  }, scene);
  rightLeg.position.set(0.13, 0.375, 0);
  rightLeg.parent = player;
  rightLeg.material = legMat;
  rightLeg.enableEdgesRendering();
  rightLeg.edgesWidth = 2.0;
  rightLeg.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  
  // Position player
  player.position = new BABYLON.Vector3(0, 2, 0);
  
  return {
    node: player,
    head,
    body,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg
  };
};

export const createSkyblockIsland = (scene, BABYLON, getBlockMaterial) => {
  console.log('🏝️ Skyblock adası oluşturuluyor...');
  
  // Main island platform (7x7 grass)
  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      const box = BABYLON.MeshBuilder.CreateBox(`grass_${x}_${z}`, { size: 1 }, scene);
      box.position = new BABYLON.Vector3(x, 0, z);
      box.material = getBlockMaterial('grass', scene, BABYLON);
      box.enableEdgesRendering();
      box.edgesWidth = 3.0;
      box.edgesColor = new BABYLON.Color4(0, 0, 0, 0.8);
      box.checkCollisions = true; // COLLISION AKTIF!
    }
  }
  
  // Dirt layers below (5x5)
  for (let y = -1; y >= -2; y--) {
    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        const box = BABYLON.MeshBuilder.CreateBox(`dirt_${x}_${y}_${z}`, { size: 1 }, scene);
        box.position = new BABYLON.Vector3(x, y, z);
        box.material = getBlockMaterial('dirt', scene, BABYLON);
        box.enableEdgesRendering();
        box.edgesWidth = 3.0;
        box.edgesColor = new BABYLON.Color4(0, 0, 0, 0.8);
        box.checkCollisions = true; // COLLISION AKTIF!
      }
    }
  }
  
  // Stone layer (3x3)
  for (let x = -1; x <= 1; x++) {
    for (let z = -1; z <= 1; z++) {
      const box = BABYLON.MeshBuilder.CreateBox(`stone_${x}_${z}`, { size: 1 }, scene);
      box.position = new BABYLON.Vector3(x, -3, z);
      box.material = getBlockMaterial('stone', scene, BABYLON);
      box.enableEdgesRendering();
      box.edgesWidth = 3.0;
      box.edgesColor = new BABYLON.Color4(0, 0, 0, 0.8);
      box.checkCollisions = true; // COLLISION AKTIF!
    }
  }
  
  // Tree (oak style)
  // Trunk (wood)
  for (let y = 1; y <= 4; y++) {
    const trunk = BABYLON.MeshBuilder.CreateBox(`trunk_${y}`, { size: 1 }, scene);
    trunk.position = new BABYLON.Vector3(-2, y, -2);
    trunk.material = getBlockMaterial('wood', scene, BABYLON);
    trunk.enableEdgesRendering();
    trunk.edgesWidth = 3.0;
    trunk.edgesColor = new BABYLON.Color4(0, 0, 0, 0.8);
    trunk.checkCollisions = true; // COLLISION AKTIF!
  }
  
  // Leaves (5x5x3 crown)
  const leavesMat = new BABYLON.StandardMaterial('leavesMat', scene);
  leavesMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.2);
  leavesMat.specularColor = new BABYLON.Color3(0, 0, 0);
  
  for (let y = 4; y <= 6; y++) {
    for (let x = -4; x <= 0; x++) {
      for (let z = -4; z <= 0; z++) {
        if (Math.abs(x + 2) <= 2 && Math.abs(z + 2) <= 2) {
          const leaf = BABYLON.MeshBuilder.CreateBox(`leaf_${x}_${y}_${z}`, { size: 1 }, scene);
          leaf.position = new BABYLON.Vector3(x, y, z);
          leaf.material = leavesMat;
          leaf.enableEdgesRendering();
          leaf.edgesWidth = 2.0;
          leaf.edgesColor = new BABYLON.Color4(0, 0, 0, 0.6);
          leaf.checkCollisions = false; // Leaves geçilebilir
        }
      }
    }
  }
  
  // Chest
  const chest = BABYLON.MeshBuilder.CreateBox('chest', { 
    width: 0.875, 
    height: 0.875, 
    depth: 0.875 
  }, scene);
  chest.position = new BABYLON.Vector3(2, 1, 2);
  chest.material = getBlockMaterial('chest', scene, BABYLON);
  chest.enableEdgesRendering();
  chest.edgesWidth = 3.0;
  chest.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  chest.checkCollisions = true; // COLLISION AKTIF!
  
  // Small water pool (2x2)
  for (let x = 0; x <= 1; x++) {
    for (let z = 0; z <= 1; z++) {
      const water = BABYLON.MeshBuilder.CreateBox(`water_${x}_${z}`, { 
        width: 1, 
        height: 0.8, 
        depth: 1 
      }, scene);
      water.position = new BABYLON.Vector3(x, 0.4, z);
      water.material = getBlockMaterial('water', scene, BABYLON);
      water.checkCollisions = false; // Su geçilebilir
    }
  }
  
  console.log('✅ Skyblock adası tamamlandı - Collision aktif!');
};

export const setupPlayerControls = (player, camera, scene) => {
  const keys = {};
  let isJumping = false;
  let velocityY = 0;
  const gravity = -0.02;
  const jumpForce = 0.3;
  const moveSpeed = 0.1;
  let thirdPerson = false;
  
  // Keyboard input
  scene.onKeyboardObservable.add((kbInfo) => {
    const key = kbInfo.event.key.toLowerCase();
    if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
      keys[key] = true;
      
      // Jump
      if (key === ' ' && !isJumping) {
        velocityY = jumpForce;
        isJumping = true;
      }
      
      // Toggle camera (F5)
      if (key === 'f5') {
        thirdPerson = !thirdPerson;
        if (thirdPerson) {
          camera.radius = 5;
          camera.heightOffset = 2;
        } else {
          camera.radius = 0.1;
          camera.heightOffset = 1.5;
        }
      }
    } else if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
      keys[key] = false;
    }
  });
  
  // Movement loop
  scene.onBeforeRenderObservable.add(() => {
    const direction = new BABYLON.Vector3(0, 0, 0);
    
    if (keys['w']) direction.z += 1;
    if (keys['s']) direction.z -= 1;
    if (keys['a']) direction.x -= 1;
    if (keys['d']) direction.x += 1;
    
    if (direction.length() > 0) {
      direction.normalize();
      
      // Rotate direction based on camera
      const angle = Math.atan2(camera.alpha, 0);
      const rotatedDir = new BABYLON.Vector3(
        direction.x * Math.cos(angle) - direction.z * Math.sin(angle),
        0,
        direction.x * Math.sin(angle) + direction.z * Math.cos(angle)
      );
      
      player.node.position.addInPlace(rotatedDir.scale(moveSpeed));
      
      // Animate legs (simple walk animation)
      const time = Date.now() * 0.005;
      player.leftLeg.rotation.x = Math.sin(time) * 0.5;
      player.rightLeg.rotation.x = -Math.sin(time) * 0.5;
      player.leftArm.rotation.x = -Math.sin(time) * 0.3;
      player.rightArm.rotation.x = Math.sin(time) * 0.3;
    }
    
    // Gravity and jumping
    velocityY += gravity;
    player.node.position.y += velocityY;
    
    // Ground collision (simple)
    if (player.node.position.y <= 2) {
      player.node.position.y = 2;
      velocityY = 0;
      isJumping = false;
    }
    
    // Camera follows player
    camera.target = player.node.position.clone();
  });
  
  return { keys, thirdPerson };
};
