// === PointerLockControls (Farm Dominion v4 Uyumlu Yerel Versiyon) ===
import * as THREE from './three.module.js';

const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
const _vector = new THREE.Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class PointerLockControls extends THREE.EventDispatcher {

    constructor(camera, domElement) {
        super();

        this.camera = camera;
        this.domElement = domElement;
        this.isLocked = false;

        // === Kamera sınırları ===
        this.minPolarAngle = 0;           // aşağı bakış sınırı
        this.maxPolarAngle = Math.PI;     // yukarı bakış sınırı
        this.pointerSpeed = 1.0;

        // === Olay bağlama ===
        this._onMouseMove = onMouseMove.bind(this);
        this._onPointerlockChange = onPointerlockChange.bind(this);
        this._onPointerlockError = onPointerlockError.bind(this);

        this.connect();
    }

    connect() {
        const doc = this.domElement.ownerDocument;
        doc.addEventListener('mousemove', this._onMouseMove);
        doc.addEventListener('pointerlockchange', this._onPointerlockChange);
        doc.addEventListener('pointerlockerror', this._onPointerlockError);
    }

    disconnect() {
        const doc = this.domElement.ownerDocument;
        doc.removeEventListener('mousemove', this._onMouseMove);
        doc.removeEventListener('pointerlockchange', this._onPointerlockChange);
        doc.removeEventListener('pointerlockerror', this._onPointerlockError);
    }

    dispose() {
        this.disconnect();
    }

    getObject() { // geri uyumluluk
        return this.camera;
    }

    getDirection(v) {
        return v.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
    }

    moveForward(distance) {
        const camera = this.camera;
        _vector.setFromMatrixColumn(camera.matrix, 0);
        _vector.crossVectors(camera.up, _vector);
        camera.position.addScaledVector(_vector, distance);
    }

    moveRight(distance) {
        const camera = this.camera;
        _vector.setFromMatrixColumn(camera.matrix, 0);
        camera.position.addScaledVector(_vector, distance);
    }

    lock() {
        this.domElement.requestPointerLock();
    }

    unlock() {
        this.domElement.ownerDocument.exitPointerLock();
    }
}

// === Fare hareketleri ===
function onMouseMove(event) {
    if (this.isLocked === false) return;

    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    const camera = this.camera;
    _euler.setFromQuaternion(camera.quaternion);

    _euler.y -= movementX * 0.002 * this.pointerSpeed;
    _euler.x -= movementY * 0.002 * this.pointerSpeed;
    _euler.x = Math.max(_PI_2 - this.maxPolarAngle, Math.min(_PI_2 - this.minPolarAngle, _euler.x));

    camera.quaternion.setFromEuler(_euler);

    this.dispatchEvent(_changeEvent);
}

// === Pointer Lock durum değişimleri ===
function onPointerlockChange() {
    if (this.domElement.ownerDocument.pointerLockElement === this.domElement) {
        this.isLocked = true;
        this.dispatchEvent(_lockEvent);
    } else {
        this.isLocked = false;
        this.dispatchEvent(_unlockEvent);
    }
}

// === Hata durumu ===
function onPointerlockError() {
    console.error('PointerLockControls: Pointer Lock API kullanılamıyor.');
}

export { PointerLockControls };
