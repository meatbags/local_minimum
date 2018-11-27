/**
 ** World gravitation point.
 **/

import { randomRange, easing } from '../../utils/maths';

class GravityNode {
  constructor(root) {
    this.root = root;
    this.position = new THREE.Vector3();
    this.reset();
    this.position.z = randomRange(-16, 16);
  }

  reset(dir) {
    const centreZ = this.root.map.plane.position.z;
    this.floor = (Math.random() < 0.97) ? randomRange(-10, -1.5) : randomRange(-20, -10);
    this.radius = Math.abs(this.floor) * 1.0;
    this.threshold = 16 + this.radius;
    this.position.x = randomRange(-16, 16);
    this.position.y = this.floor;
    this.position.z = centreZ + this.threshold * dir;
  }

  update(delta) {
    const centreZ = this.root.map.plane.position.z;
    if (this.position.z > centreZ + this.threshold) {
      this.reset(-1);
    } else if (this.position.z < centreZ - this.threshold) {
      this.reset(1);
    }
  }

  getVectorAtPoint(p) {
    // get vector at point in gravity radius
    const theta = Math.atan2(p.x - this.position.x, p.z - this.position.z);
    const res = new THREE.Vector3(Math.sin(theta) * this.radius, this.position.y, Math.cos(theta) * this.radius);
    const mag = Math.hypot(p.z - this.position.z, p.x - this.position.x);
    const s = Math.sin((1 - mag / this.radius) * Math.PI);
    res.multiplyScalar(s);
    return res;
  }

  getFloorAtPoint(p) {
    const mag = Math.hypot(p.z - this.position.z, p.x - this.position.x);
    if (mag < this.radius) {
      const t = easing(1 - mag / this.radius);
      return t * this.position.y;
    } else {
      return 0;
    }
  }
}

export { GravityNode };
