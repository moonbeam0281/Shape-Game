// Camera.js
import * as THREE from 'three';
import { RTSCameraController } from './RTSCameraController';

export class Camera {
  constructor(owner, renderer, map) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = renderer;
    this.camera.position.set(0, 30, 10);
    this.camera.lookAt(0, 0, 0);
    this.owner = owner;
    this.controls = new RTSCameraController(this.camera, this.renderer.domElement, { width: map.width, length: map.lenght });
  }

  updateCameraBonds(map) {
    this.controls =new RTSCameraController(this.camera, this.renderer.domElement, { width: map.width, length: map.lenght });
  }
}