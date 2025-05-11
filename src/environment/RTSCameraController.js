import * as THREE from 'three';

export class RTSCameraController {
    constructor(camera, domElement, mapBounds = { width, length }) {
        this.camera = camera;
        this.domElement = domElement;
        this.isDragging = false;
        this.lastMouse = { x: 0, y: 0 };
        this.dragSpeed = 0.1;
        this.scrollSpeed = 0.5;
        this.fixedHeight = camera.position.y;
        this.isMouseInWindow = true;

        this.edgeBuffer = {
            left: 60,
            right: 60,
            top: 40,
            bottom: 40,
        };
        this.movementKeys = {};
        this.mapBounds = mapBounds;

        this.mouse = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        };

        this.initListeners();
    }


    initListeners() {
        this.domElement.addEventListener('contextmenu', e => e.preventDefault()); // prevent right-click menu

        this.domElement.addEventListener('mousedown', (e) => {
            if (e.button === 2) { // Right click
                this.isDragging = true;
                this.lastMouse.x = e.clientX;
                this.lastMouse.y = e.clientY;
            }
        });
        // Track keys
        window.addEventListener('keydown', (e) => {
            this.movementKeys[e.key.toLowerCase()] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.movementKeys[e.key.toLowerCase()] = false;
        });

        this.domElement.addEventListener('mouseup', (e) => {
            if (e.button === 2) {
                this.isDragging = false;
            }
        });

        this.domElement.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            if (!this.isDragging) return;

            const dx = e.clientX - this.lastMouse.x;
            const dy = e.clientY - this.lastMouse.y;

            // Determine right and forward directions from camera rotation
            const dir = new THREE.Vector3();
            this.camera.getWorldDirection(dir);

            const right = new THREE.Vector3().crossVectors(dir, this.camera.up).normalize();
            const forward = new THREE.Vector3().crossVectors(this.camera.up, right).normalize();

            const moveX = -dx * this.dragSpeed;
            const moveZ = dy * this.dragSpeed;

            // Move camera in right/forward plane, preserving angle
            this.camera.position.addScaledVector(right, moveX);
            this.camera.position.addScaledVector(forward, moveZ);

            // Do NOT update lookAt — preserve current orientation
            this.lastMouse.x = e.clientX;
            this.lastMouse.y = e.clientY;
            //console.log("Mouse x = {0} Mouse y = {1}", this.lastMouse.x, this.lastMouse.y);
        });
    }

    updateCursor() {
        const { x, y } = this.mouse;
        const width = window.innerWidth;
        const height = window.innerHeight;
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

        // Keyboard movement
        if (this.movementKeys['w'] || this.movementKeys['arrowup']) {
            move.add(forward);
        }
        if (this.movementKeys['s'] || this.movementKeys['arrowdown']) {
            move.sub(forward);
        }
        if (this.movementKeys['a'] || this.movementKeys['arrowleft']) {
            move.sub(right);
        }
        if (this.movementKeys['d'] || this.movementKeys['arrowright']) {
            move.add(right);
        }

        // Edge scrolling
        const { x, y } = this.mouse;
        const width = window.innerWidth;
        const height = window.innerHeight;

        if(!this.isDragging)
        {
            this.updateCursor();
            if (x < this.edgeBuffer.left) move.sub(right);
            if (x > width - this.edgeBuffer.right) move.add(right);
            if (y < this.edgeBuffer.top) move.add(forward);
            if (y > height - this.edgeBuffer.bottom) move.sub(forward);
        }

        // Apply movement
        move.normalize().multiplyScalar(this.scrollSpeed);
        this.camera.position.add(move);

        // Keep height fixed
        this.camera.position.y = this.fixedHeight;

        // Clamp to map
        const halfW = this.mapBounds.width / 2;
        const halfL = this.mapBounds.length / 2;
        this.camera.position.x = Math.max(-halfW, Math.min(halfW, this.camera.position.x));
        this.camera.position.z = Math.max(-halfL, Math.min(halfL, this.camera.position.z));
    }
}
