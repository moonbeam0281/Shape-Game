import * as THREE from 'three';

export class RTSCameraController {
    constructor(camera, domElement, mapBounds = { width, length }) {
        this.camera = camera;
        this.domElement = domElement;
        this.mapBounds = mapBounds;
        this.isDragging = false;
        this.lastMouse = { x: 0, y: 0 };
        this.dragSpeed = 0.1;
        this.scrollSpeed = 0.5;
        this.fixedHeight = camera.position.y;

        this.mouse = { x: 0, y: 0 };
        this.edgeBuffer = { left: 60, right: 60, top: 40, bottom: 40 };
        this.movementKeys = {};
        
        this._onContextMenu = (e) => e.preventDefault();
        this._onMouseDown = (e) => {
            if (e.button === 2) {
                this.isDragging = true;
                this.lastMouse.x = e.clientX;
                this.lastMouse.y = e.clientY;
            }
        };
        this._onMouseUp = (e) => {
            if (e.button === 2) this.isDragging = false;
        };
        this._onMouseMove = (e) => {
            const rect = this.domElement.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;

            if (!this.isDragging) return;

            const dx = e.clientX - this.lastMouse.x;
            const dy = e.clientY - this.lastMouse.y;

            const dir = new THREE.Vector3();
            this.camera.getWorldDirection(dir);

            const right = new THREE.Vector3().crossVectors(dir, this.camera.up).normalize();
            const forward = new THREE.Vector3().crossVectors(this.camera.up, right).normalize();

            const moveX = -dx * this.dragSpeed;
            const moveZ = dy * this.dragSpeed;

            this.camera.position.addScaledVector(right, moveX);
            this.camera.position.addScaledVector(forward, moveZ);

            this.lastMouse.x = e.clientX;
            this.lastMouse.y = e.clientY;
        };
        this._onKeyDown = (e) => {
            this.movementKeys[e.key.toLowerCase()] = true;
        };
        this._onKeyUp = (e) => {
            this.movementKeys[e.key.toLowerCase()] = false;
        };

        // Add listeners
        this.domElement.addEventListener('contextmenu', this._onContextMenu);
        this.domElement.addEventListener('mousedown', this._onMouseDown);
        this.domElement.addEventListener('mouseup', this._onMouseUp);
        this.domElement.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
    }

    updateBounds(width, length) {
        this.mapBounds = { width, length };
    }

    updateCursor() {
        const { x, y } = this.mouse;
        const rect = this.domElement.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const b = this.edgeBuffer;

        let cursor = 'default';
        if (x < b.left && y < b.top) cursor = 'nw-resize';
        else if (x > width - b.right && y < b.top) cursor = 'ne-resize';
        else if (x < b.left && y > height - b.bottom) cursor = 'sw-resize';
        else if (x > width - b.right && y > height - b.bottom) cursor = 'se-resize';
        else if (x < b.left) cursor = 'w-resize';
        else if (x > width - b.right) cursor = 'e-resize';
        else if (y < b.top) cursor = 'n-resize';
        else if (y > height - b.bottom) cursor = 's-resize';

        this.domElement.style.cursor = cursor;
    }

    update() {
        const dir = new THREE.Vector3();
        this.camera.getWorldDirection(dir);

        const right = new THREE.Vector3().crossVectors(dir, this.camera.up).normalize();
        const forward = new THREE.Vector3().crossVectors(this.camera.up, right).normalize();

        let move = new THREE.Vector3();

        if (this.movementKeys['w'] || this.movementKeys['arrowup']) move.add(forward);
        if (this.movementKeys['s'] || this.movementKeys['arrowdown']) move.sub(forward);
        if (this.movementKeys['a'] || this.movementKeys['arrowleft']) move.sub(right);
        if (this.movementKeys['d'] || this.movementKeys['arrowright']) move.add(right);

        const { x, y } = this.mouse;
        const rect = this.domElement.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        if (!this.isDragging) {
            this.updateCursor();
            if (x < this.edgeBuffer.left) move.sub(right);
            if (x > width - this.edgeBuffer.right) move.add(right);
            if (y < this.edgeBuffer.top) move.add(forward);
            if (y > height - this.edgeBuffer.bottom) move.sub(forward);
        }

        move.normalize().multiplyScalar(this.scrollSpeed);
        this.camera.position.add(move);
        this.camera.position.y = this.fixedHeight;

        if (this.mapBounds?.width && this.mapBounds?.length) {
            const halfW = this.mapBounds.width / 2;
            const halfL = this.mapBounds.length / 2;
            this.camera.position.x = Math.max(-halfW, Math.min(halfW, this.camera.position.x));
            this.camera.position.z = Math.max(-halfL, Math.min(halfL, this.camera.position.z));
        }
    }

    dispose() {
        //console.log("Removing handlers...")
        this.domElement.removeEventListener('contextmenu', this._onContextMenu);
        this.domElement.removeEventListener('mousedown', this._onMouseDown);
        this.domElement.removeEventListener('mouseup', this._onMouseUp);
        this.domElement.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
        //console.log("Handlers removed");
    }
}
