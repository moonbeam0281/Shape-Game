import * as THREE from 'three';
import { RTSCameraController } from './RTSCameraController.js';

export class MainCamera {
  constructor(owner, map, renderer) {
    this.owner = owner;
    this.renderer = renderer;

    const width = renderer.domElement.clientWidth;
    const height = renderer.domElement.clientHeight;

    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );

    this.camera.position.set(0, 30, 10);
    this.camera.lookAt(0, 0, 0);

    this.controls = new RTSCameraController(
      this.camera,
      this.renderer.domElement,
      { width: map.width, length: map.length }
    );
  }

  updateCameraBounds(map) {
    console.log("Updating camera bounds to:", map.width, map.length);
    if (this.controls?.updateBounds) {
      this.controls.updateBounds(map.width, map.length);
    }
    this.camera.position.set(0, 30, 10);
    this.camera.lookAt(0, 0, 0);

  }

  dispose() {
    //console.log("Disposing camera controls");
    this.controls?.dispose();
  }
}
