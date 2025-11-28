// === Farm Dominion v6 - terrain.js (THREE bağımsız, dışarıdan aktarım) ===

export class TerrainManager {
  constructor(scene, THREERef) {
    this.scene = scene;
    this.THREE = THREERef;
    this.terrains = [];
  }

  async loadTerrainData() {
    const terrainFiles = [
      'mountains', 'hills', 'plains', 'plateaus',
      'rivers', 'lakes', 'valleys', 'wetlands', 'desert', 'forest'
    ];

    for (const name of terrainFiles) {
      try {
        const response = await fetch(`./data/terrain/${name}.txt`);
        if (!response.ok) continue;

        const text = await response.text();
        const data = this.parseData(text);
        this.createTerrainMesh(name, data);

      } catch (err) {
        console.warn(`⚠️ ${name}.txt yüklenemedi:`, err);
      }
    }
  }

  parseData(text) {
    const data = {};
    text.split(/\r?\n/).forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) data[key.trim()] = value.trim();
    });
    return data;
  }

  createTerrainMesh(name, data) {
    const THREE = this.THREE;
    if (!THREE || !THREE.PlaneGeometry) {
      console.error('❌ THREE nesnesi world.js üzerinden aktarılmamış!');
      return;
    }

    const geometry = new THREE.PlaneGeometry(1000, 1000, 128, 128);
    const texturePath = `./assets/textures/${data.GROUND_TEXTURE || 'grass.jpg'}`;

    const texture = new THREE.TextureLoader().load(texturePath);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      color: data.GROUND_COLOR || '#7a9b5b',
      roughness: 1,
      metalness: 0
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;

    // Yükseklik farkları
    if (name === 'mountains') mesh.position.y = 60;
    else if (name === 'hills') mesh.position.y = 30;
    else mesh.position.y = 0;

    this.scene.add(mesh);
    this.terrains.push(mesh);
  }
}
