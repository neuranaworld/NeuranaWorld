// === Farm Dominion v4 - main.js (güncel) ===
import { World } from './world.js';

window.addEventListener('DOMContentLoaded', () => {
    console.log('?? Farm Dominion v4 baþlatýlýyor...');
    const container = document.body;
    new World(container);
});
