//iMap interface will handle our maps and display our terrain

export class iMap {
  constructor() {
    if (this.constructor === iMap) {
      throw new Error("iMap is an interface and cannot be instantiated directly.");
    }

    this.mapName = '';
    this.width = 0;
    this.lenght = 0;
    this.objects = []; 
  }

  generate() {
    throw new Error("generate() must be implemented.");
  }

  destroy() {
    throw new Error("destroy() must be implemented.");
  }
}
