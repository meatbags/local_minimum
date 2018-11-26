/**
 ** World gravitation point.
 **/

import { randomRange, easing } from '../utils/maths';

class GravityNode {
  constructor(root) {
    //this.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
    this.position = new THREE.Vector3();
    this.reset();
    this.position.z = randomRange(-16, 16);
    this.root = root;
    //root.scene.add(this.mesh);
  }

  reset() {
    this.height = (Math.random() < 0.97) ? randomRange(-10, -1.5) : randomRange(-20, -10);
    this.radius = Math.abs(this.height) * 1.0;
    this.threshold = 16 + this.radius;
    this.position.x = randomRange(-16, 16);
    this.position.y = this.height;
    this.position.z = -this.threshold;
    this.velocity = new THREE.Vector3(0, 0, randomRange(1, 3));
  }

  getHeight(p) {
    const mag = Math.hypot(p.z - this.position.z, p.x - this.position.x);
    return (mag > this.radius) ? 0 : easing(1 - mag / this.radius) * this.height;
  }

  update(delta) {
    this.position.x += this.velocity.x * delta;
    this.position.z += (this.root.player.velocity.z + this.velocity.z) * delta;
    if (this.position.z > this.threshold || Math.abs(this.position.x) > this.threshold) {
      this.reset();
    }
  }
}

export { GravityNode };
