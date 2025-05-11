import { setupLighting } from '../environment/Lighting.js';
import { Camera } from '../environment/Camera.js';
import { MapHandler } from './MapHandler.js';

export class SceneHandler {
  constructor(player, scene, renderer, activeMap){
    this.player = player;
    this.renderer = renderer;
    this.activeMap = activeMap;
    this.mainCamera = new Camera(player, this.renderer, activeMap);
    this.scene = scene;
    setupLighting(this.scene);
    this.loadScene();
  }




  /*
  constructor(scene, map) {
    map.objects.forEach(o => {
      scene.add(o);
    })
    console.log('Created map');
    setupLighting(scene);
    //console.log('Added lighting to scene');
  }*/

  loadScene()
  {
    this.activeMap.objects.forEach(o =>{
      this.scene.add(o);
    });

  }
}
