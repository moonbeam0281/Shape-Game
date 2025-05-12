import * as THREE from 'three';
import { SceneHandler } from './handlers/SceneHandler.js';
import './style.css';
import { Player } from './Players/Player.js';

// Declare key DOM elements
const canvas = document.getElementById('canvas');
const mapSelect = document.getElementById('mapSelect');
const mainScene = new THREE.Scene();

let sceneHandler = null; // 💡 let instead of const

// Start menu logic
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => {
  const nameInput = document.getElementById('player-name-input');
  const shapeSelect = document.getElementById('shape-select');
  const colorPicker = document.getElementById('color-picker');

  const playerName = nameInput.value.trim() || "Player";
  const selectedShape = shapeSelect.value;
  const selectedColor = parseInt(colorPicker.value.replace('#', '0x'));

  // Create player instance
  const player = new Player(playerName, 1, selectedColor, 1, selectedShape);

  // Initialize scene
  sceneHandler = new SceneHandler(player, mainScene, canvas, mapSelect);

  // Hide login menu
  document.getElementById('start-menu').style.display = 'none';

  // Start animation loop
  animate();

  function animate() {
    requestAnimationFrame(animate);
    sceneHandler.update();
  }

  // Trigger resize to apply correct canvas dimensions
  window.dispatchEvent(new Event('resize'));
});

// Responsive canvas resizing
function handleResize() {
  if (!sceneHandler) return;

  const isFullscreen = document.fullscreenElement === canvas;
  const parent = canvas.parentElement;

  const width = isFullscreen ? window.innerWidth : parent.clientWidth;
  const height = isFullscreen ? window.innerHeight : parent.clientHeight;

  sceneHandler.resize(width, height);
}

window.addEventListener('resize', handleResize);
window.addEventListener('fullscreenchange', handleResize);

// Enable fullscreen on double-click
function enterFullscreen() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) {
    canvas.msRequestFullscreen();
  }
}

canvas.addEventListener('dblclick', enterFullscreen);

// Ensure canvas is resized when page loads
window.addEventListener('load', handleResize);
