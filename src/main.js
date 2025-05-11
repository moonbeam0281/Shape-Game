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
maphandler.loadMaps();
const sceneHandler = new SceneHandler(playerName.innerHTML, mainScene, renderer, maphandler.activeMap);
//Map Handler and selector



//Renderer



//Camera and handeler
//const { camera, controls } = setupCamera(renderer, maphandler.activeMap);
/*
console.log("Logging every object...");
console.log("mainScene: ");
console.log(mainscene);
console.log("Canvas: ")
console.log(canvas)
console.log("Renderer: ")
console.log(renderer);
console.log(mainscene);
console.log("mapHadpler: ");
console.log(maphandler);
console.log("Camera and controls");
console.log(camera);
console.log(controls);*/


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
    console.log(maphandler.activeMap);
    console.log(mainscene);
    sceneHandler.updateMap();
  };
});

// Animation loop
//let startTime = performance.now();
function animate() {
  requestAnimationFrame(animate);
  //const elapsed = (performance.now() - startTime) / 1000;

  renderer.render(sceneHandler.scene, sceneHandler.mainCamera);
  sceneHandler.camera.controls.update();
  //console.log(`Scene running for: ${elapsed.toFixed(2)}s`);
}
animate();

// Resize
window.addEventListener('resize', () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height, false);
  mainCamera.camera.aspect = width / height;
  mainCamera.camera.updateProjectionMatrix();
});

window.addEventListener('load', () => {
  renderer.setSize(canvas.innerWidth, canvas.innerHeight);
});