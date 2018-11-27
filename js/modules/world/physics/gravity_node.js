/**
 ** World gravitation point.
 **/

import { randomRange, easing } from '../../utils/maths';

class GravityNode {
  constructor(root) {
    this.position = new THREE.Vector3();
    this.reset();
    this.position.z = randomRange(-16, 16);
    this.root = root;
  }

  reset() {
    this.height = (Math.random() < 0.97) ? randomRange(-10, -1.5) : randomRange(-20, -10);
    this.radius = Math.abs(this.height) * 1.0;
    this.threshold = 16 + this.radius;
    this.position.x = randomRange(-16, 16);
    this.position.y = this.height;
    this.position.z = -this.threshold;
    this.velocity = new THREE.Vector3(0, 0, 0);
  }

  getPull(p) {
    const d = 1;
    const theta = Math.atan2(p.x - this.position.x, p.z - this.position.z);
    const p0 = new THREE.Vector3(p.x - Math.sin(theta) * d, 0, p.z + Math.cos(theta) * d);
    const p1 = new THREE.Vector3(p.x + Math.sin(theta) * d, 0, p.z - Math.cos(theta) * d);
    p0.y = this.getHeight(p0);
    p1.y = this.getHeight(p1);
    p0.sub(p1);
    p0.multiplyScalar(10);
    return p0;
  }

  getHeight(p) {
    const mag = Math.hypot(p.z - this.position.z, p.x - this.position.x);
    return (mag > this.radius) ? 0 : easing(1 - mag / this.radius) * this.height;
  }

  update(delta) {
    /*
    this.position.x += this.velocity.x * delta;
    this.position.z += (this.root.player.velocity.z + this.velocity.z) * delta;
    if (this.position.z > this.threshold || Math.abs(this.position.x) > this.threshold) {
      this.reset();
    }
    */
  }
}

export { GravityNode };
