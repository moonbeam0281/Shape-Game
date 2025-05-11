import * as THREE from 'three';
import { iUnitShape } from '../../../interface//iUnitShape.js';

export class OctahedronUnit extends iUnitShape {
    constructor(x, y, angle, color, owner) {
        super(x, y, angle, color, owner);
        this.mesh = null;
    }

    generate() {
        const geometry = new THREE.OctahedronGeometry(1.5);
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
                this.mesh.rotation.set(0, this.angle, 0);
                return;
            }

            const currentX = startX + dx * t;
            const currentY = startY + dy * t;

            if (this.mesh) {
                const floatY = 1.5 + Math.sin(t * Math.PI) * 0.3;
                this.mesh.position.set(currentX, floatY, currentY);
                this.mesh.rotation.y = this.angle;
                this.mesh.rotation.x += 0.01;
                this.mesh.rotation.z += 0.01;
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
                    const hover = Math.sin(this._animationClock * 2) * 0.2;
                    this.mesh.position.y = 1.5 + hover;
                    this.mesh.rotation.x += 0.005;
                    this.mesh.rotation.z += 0.005;
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