//iMap interface will handle our maps and display our terrain

export class iMap {
    constructor() {
      if (new.target === iMap) {
        throw new Error("iMap is an abstract class and must be extended.");
      }
    }
  
    generate(scene) {
      throw new Error("generate() must be implemented by the map.");
    }
  
    destroy() {
      throw new Error("destroy() must be implemented by the map.");
    }
  }
  