import * as THREE from 'three';
import { iUnitShape } from '../../../interface//iUnitShape.js';

export class PyramidUnit extends iUnitShape {
  constructor(x, y, angle, color, owner) {
    super(x, y, angle, color, owner);
    this.mesh = null;
  }

  generate() {
    const geometry = new THREE.ConeGeometry(2, 3, 4);
    const material = new THREE.MeshStandardMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.x, 1.5, this.y);
    this.mesh.rotation.y = this.angle;
    return this.mesh;
  }

  destroy() {
    this.mesh?.geometry.dispose();
    this.mesh?.material.dispose();
    this.mesh = null;
  }

  move(targetX, targetY) {
    if (this.state === iUnitShape.STATES.MOVING) return;

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const angle = Math.atan2(dy, dx);
    this.angle = angle;
    this.state = iUnitShape.STATES.MOVING;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = distance / this.speed;
    let step = 0;

    const startX = this.x;
    const startY = this.y;

    const animate = () => {
      step++;
      const t = step / steps;

      if (t >= 1) {
        this.x = targetX;
        this.y = targetY;
        this.state = iUnitShape.STATES.IDLE;
        this.mesh.position.set(this.x, 1.5, this.y);
        return;
      }

      const currentX = startX + dx * t;
      const currentY = startY + dy * t;

      if (this.mesh) {
        this.mesh.position.set(currentX, 1.5, currentY);
        this.mesh.rotation.y = this.angle;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  animate(deltaTime) {
    this._animationClock += deltaTime;

    switch (this.state) {
      case iUnitShape.STATES.IDLE:
        if (this.mesh) {
          const bobble = Math.sin(this._animationClock * 4) * 0.1;
          this.mesh.position.y = 1.5 + bobble;
        }
        break;

      case iUnitShape.STATES.MOVING:
        // Movement handled in move()
        break;

      case iUnitShape.STATES.ATTACKING:
        // Placeholder
        break;
    }
  }
}
