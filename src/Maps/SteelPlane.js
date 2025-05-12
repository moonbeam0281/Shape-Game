import * as THREE from 'three';
import { iMap } from '../../interface/iMap.js';
import steelImage from '../assets/steel.jpg';

export class SteelPlanes extends iMap {
  constructor() {
    super();
    this.mapName = "Steel Planes";
    this.width = 240;
    this.length = 120; // ✅ fixed typo
    this.objects = [];
  }

  generate() {
    const geometry = new THREE.PlaneGeometry(this.width, this.length);
    const textureLoader = new THREE.TextureLoader();
    const steelTexture = textureLoader.load(steelImage);

    steelTexture.wrapS = THREE.RepeatWrapping;
    steelTexture.wrapT = THREE.RepeatWrapping;
    steelTexture.repeat.set(15, 15);

    const material = new THREE.MeshStandardMaterial({ map: steelTexture });

    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;

    this.objects.push(floor);
  }

  destroy() {
    console.log("Destroying SteelPlanes...");
    this.objects.forEach(obj => {
      obj.geometry?.dispose();
      obj.material?.dispose();
    });
    this.objects = [];
  }
}
