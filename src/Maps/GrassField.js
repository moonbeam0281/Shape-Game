import * as THREE from 'three';
import { iMap } from '../../interface/iMap.js';
import grassImage from '../assets/grass.jpg';
import { setupLighting } from '../environment/Lighting.js';

export class GrassFields extends iMap {
    constructor() {
        super();
        this.mapName = "Grass Fields";
        this.width = 120;
        this.lenght = 240;
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
        console.log("Generated Grass fields: displaying objects");
        console.log(this.objects);
    }

    destroy(scene) {
        console.log("called destroy from grassfield");
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
