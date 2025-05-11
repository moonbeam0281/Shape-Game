export class iUnitShape {
  static STATES = {
    IDLE: 'idle',
    MOVING: 'moving',
    ATTACKING: 'attacking',
  };

  constructor(x, y, angle, color, owner) {
    if (this.constructor === iUnitShape) {
      throw new Error("iUnitShape is an interface and cannot be instantiated directly.");
    }

    this.x = x;
    this.y = y;
    this.angle = angle;
    this.health = 100;
    this.commands = [];
    this.color = color;
    this.owner = owner;
    this.state = iUnitShape.STATES.IDLE;
    this.speed = 0.05;
    this._animationClock = 0;
  }

  generate() {
    throw new Error("generate() must be implemented.");
  }

  destroy() {
    throw new Error("destroy() must be implemented.");
  }

  move() {
    throw new Error("move() must be implemented.");
  }

  animate(deltaTime) {
    throw new Error("animate() must be implemented.");
  }
}
