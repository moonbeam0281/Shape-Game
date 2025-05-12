import { iMap } from '../../interface/iMap.js';

export class MapHandler {
  constructor(scene, selector, onMapChanged = null) {
    this.scene = scene;
    this.selector = selector;
    this.onMapChanged = onMapChanged;
    this.maps = [];
    this.activeMap = null;

    this.loadMaps();
    this.setupDropdownListener();
  }

  loadMaps() {
    const context = require.context('../Maps', false, /\.js$/);

    context.keys().forEach((key) => {
      const m = context(key);
      for (const exported in m) {
        const TypeClass = m[exported];
        if (typeof TypeClass === 'function' && TypeClass.prototype instanceof iMap) {
          const mapInstance = new TypeClass();
          this.maps.push(mapInstance);
        }
      }
    });

    if (this.maps.length > 0) {
      this.populateSelector();
      this.setActiveMap(this.maps[0]);
    }
  }

  populateSelector() {
    this.maps.forEach(map => {
      const option = document.createElement('option');
      option.value = map.mapName;
      option.textContent = map.mapName;
      this.selector.appendChild(option);
    });
  }

  setupDropdownListener() {
    this.selector.addEventListener('change', (event) => {
      const selectedName = event.target.value;
      const selectedMap = this.maps.find(m => m.mapName === selectedName);
      if (selectedMap && selectedMap !== this.activeMap) {
        this.setActiveMap(selectedMap);
      }
    });
  }

  setActiveMap(newMap) {
    // Remove old map if one exists
    if (this.activeMap) {
      this.activeMap.objects.forEach(obj => this.scene.remove(obj));
      this.activeMap.destroy();
    }

    this.activeMap = newMap;
    this.activeMap.generate();
    this.activeMap.objects.forEach(obj => this.scene.add(obj));

    if(this.onMapChanged)
    {
      this.onMapChanged(this.activeMap);
    }
  }

  cleanup() {
    if (!this.activeMap) return;
    this.activeMap.objects.forEach(obj => this.scene.remove(obj));
    this.activeMap.destroy();
    this.activeMap.objects = [];
  }

  generateMap() {
    if (!this.activeMap) return;
    this.activeMap.generate();
    this.activeMap.objects.forEach(obj => this.scene.add(obj));
  }
}
