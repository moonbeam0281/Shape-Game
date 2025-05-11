import * as THREE from 'three';
import { iMap } from '../../interface/iMap.js';
import grassImage from '../assets/steel.jpg';

export class SteelPlanes extends iMap {
    constructor() {
        super();
        this.mapName = "Steel Planes";
        this.width = 240;
        this.lenght = 120;

        this.objects = [];
    }

    generate() {
        const geometry = new THREE.PlaneGeometry(this.width, this.lenght);
        const textureLoader = new THREE.TextureLoader();
        const grassTexture = textureLoader.load(grassImage);
        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(15, 15);

        const material = new THREE.MeshStandardMaterial({
            map: grassTexture
        });

        const floor = new THREE.Mesh(geometry, material);

        floor.rotation.x = -Math.PI / 2;
        floor.position.x = 0;
        floor.position.z = 0;
        floor.receiveShadow = true;

        this.objects.push(floor);
    }

    destroy(scene) {
        console.log("called destroy from steelfield");
        this.objects.forEach(obj => {
            if (obj.isMesh) {
                obj.geometry?.dispose();
                obj.material?.dispose();
            }
            scene.remove(obj);
        });
        this.objects = [];
    }
}
