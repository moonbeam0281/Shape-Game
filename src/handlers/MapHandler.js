import { iMap } from '../../interface/iMap.js';

export class MapHandler {
  constructor(scene, selector) {
    this.scene = scene;
    this.activeMap = null;
    this.selector = selector;
    this.maps = [];
  }

  loadMaps() {
    const context = require.context('../Maps', false, /\.js$/); 

    context.keys().forEach((key) => {
      const m = context(key);
      for (const exported in m) {
        const typeClass = m[exported];
        if (typeof typeClass === 'function' && typeClass.prototype instanceof iMap) {
          const mapInstance = new typeClass();
          this.maps.push(mapInstance);
        }
      }
    });

    this.activeMap = this.maps[0];

    this.maps.forEach(map => {
      const o = document.createElement('option');
      o.value = map.mapName;
      o.textContent = map.mapName;
      this.selector.appendChild(o);
    });
    this.generateMap();
  }

  generateMap()
  {
    this.activeMap.generate();
    this.activeMap.objects.forEach(obj => this.scene.add(obj));
  }

  cleanup() {
    if(this.activeMap && this.scene)
    {
      this.activeMap.destroy(this.scene);
    }
  }
}
