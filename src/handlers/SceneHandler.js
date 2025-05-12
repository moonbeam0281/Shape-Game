import * as THREE from 'three';
import { setupLighting } from '../environment/Lighting.js';
import { MainCamera } from '../environment/MainCamera.js';
import { MapHandler } from './MapHandler.js';

export class SceneHandler {
  constructor(player, scene, canvas, mapSelect) {
    this.player = player;
    this.scene = scene;
    this.canvas = canvas;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Map and camera
    this.mapHandler = new MapHandler(this.scene, mapSelect, (newMap) => {this.onMapChanged(newMap)});
    this.mainCamera = new MainCamera(player, this.mapHandler.activeMap, this.renderer);

    this.mainCamera.updateCameraBounds(this.mapHandler.activeMap);
    // Lighting
    setupLighting(this.scene);
  }

  onMapChanged(newMap) {
  console.log("Map changed to:", newMap.mapName);

  // Dispose + recreate camera
  if (this.mainCamera) {
    console.log("Disposing camera and controls.")
    this.mainCamera.dispose();
    this.scene.remove(this.mainCamera.camera);
  }

  this.mainCamera = new MainCamera(this.player, newMap, this.renderer);
  this.scene.add(this.mainCamera.camera);
}

  loadScene() {
    if (this.mainCamera) {
      this.mainCamera.dispose();
      this.scene.remove(this.mainCamera.camera);
    }

    // Regenerate camera with the new map
    this.mainCamera = new MainCamera(this.player, this.mapHandler.activeMap, this.renderer);
    this.scene.add(this.mainCamera.camera);

    // Regenerate the map
    this.mapHandler.cleanup();
    this.mapHandler.generateMap();

    // Update map bonds
    console.log("Updating camera bonds")
    this.mainCamera.updateCameraBounds(this.mapHandler.activeMap);

    setupLighting(this.scene);
  }

  update() {
    this.mainCamera?.controls.update();
    this.renderer.render(this.scene, this.mainCamera.camera);
  }

  resize(width, height) {
    this.renderer.setSize(width, height);
    if (this.mainCamera?.camera) {
      this.mainCamera.camera.aspect = width / height;
      this.mainCamera.camera.updateProjectionMatrix();
    }
  }
}
