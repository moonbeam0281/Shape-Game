import * as THREE from 'three';
import { SceneHandler } from './handlers/SceneHandler.js';
import { MapHandler } from './handlers/MapHandler.js';
import './style.css';

//Scene handler
const playerName = document.getElementById('playerNameInput');
console.log(playerName.innerHTML);
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const mapSelect = document.getElementById('mapSelect');
const mainScene = new THREE.Scene();
const maphandler = new MapHandler(mainScene, mapSelect);
console.log(maphandler.activeMap);
const sceneHandler = new SceneHandler(playerName.innerHTML, mainScene, renderer, maphandler.activeMap);
console.log(mainScene);


//console.log('Generating scene handler');

mapSelect.addEventListener('change', (event) => {
  const selectedMapName = event.target.value;
  console.log('User selected map:', selectedMapName);

  //
  const selectedMap = maphandler.maps.find(m => m.mapName === selectedMapName);
  if (selectedMap != null) {
    
    maphandler.cleanup();
    console.log("cleaning...");
    maphandler.activeMap = selectedMap;
    console.log("Setting up to new selected map...");
    maphandler.generateMap();
    console.log("Generating map...");
    sceneHandler.loadScene();
    sceneHandler.mainCamera.updateCameraBonds(maphandler.activeMap);
  };
});

// Animation loop
//let startTime = performance.now();
function animate() {
  requestAnimationFrame(animate);
  //const elapsed = (performance.now() - startTime) / 1000;

  renderer.render(mainScene, sceneHandler.mainCamera.camera);
  sceneHandler.mainCamera.controls.update();
  //console.log(`Scene running for: ${elapsed.toFixed(2)}s`);
}
animate();

// Resize
window.addEventListener('resize', () => {
  const isFullscreen = document.fullscreenElement === canvas;

  const parent = canvas.parentElement;

  const width = isFullscreen ? window.innerWidth : parent.clientWidth;
  const height = isFullscreen ? window.innerHeight : parent.clientHeight;

  renderer.setSize(width, height);
  sceneHandler.mainCamera.camera.aspect = width / height;
  sceneHandler.mainCamera.camera.updateProjectionMatrix();
});

document.addEventListener('fullscreenchange', () => {
  window.dispatchEvent(new Event('resize'));
});

function enterFullscreen() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.webkitRequestFullscreen) { // Safari
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) { // IE11
    canvas.msRequestFullscreen();
  }
}

canvas.addEventListener('dblclick', enterFullscreen);

window.addEventListener('load', () => {
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});