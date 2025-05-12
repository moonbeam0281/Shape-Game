import * as THREE from 'three';
import { iMap } from '../../interface/iMap.js';
import grassImage from '../assets/grass.jpg';

export class GrassFields extends iMap {
  constructor() {
    super();
    this.mapName = "Grass Fields";
    this.width = 120;
    this.length = 240; // ✅ fixed typo
    this.objects = [];
  }

  generate() {
    const geometry = new THREE.PlaneGeometry(this.width, this.length);
    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load(grassImage);

    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(15, 15);

    const material = new THREE.MeshStandardMaterial({ map: grassTexture });

    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;

    this.objects.push(floor);
  }

  destroy() {
    console.log("Destroying GrassFields...");
    this.objects.forEach(obj => {
      obj.geometry?.dispose();
      obj.material?.dispose();
    });
    this.objects = [];
  }
}
