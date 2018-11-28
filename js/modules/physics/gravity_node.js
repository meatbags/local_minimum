/**
 ** World gravitation point.
 **/

import { randomRange, easing } from '../utils/maths';

class GravityNode {
  constructor(root) {
    this.root = root;
    this.position = new THREE.Vector3();
    this.reset();
    this.position.z = randomRange(-16, 16);
  }

  setRadius() {
    this.radius = Math.abs(this.floor) * 1.0;
    this.threshold = 16 + this.radius;
    this.position.y = this.floor;
  }

  reset(dir) {
    const centreZ = this.root.map.plane.position.z;
    this.floor = (Math.random() < 0.97) ? randomRange(-12, -1.5) : randomRange(-20, -10);
    this.setRadius();
    this.position.x = randomRange(-16, 16);
    this.position.z = centreZ + this.threshold * dir;
    this.velocity = new THREE.Vector3(randomRange(-1, 1), 0, randomRange(-2, 2));
  }

  update(delta) {
    // move
    this.position.x += this.velocity.x * delta;
    this.position.z += this.velocity.z * delta;

    // check if offscreen
    const centreZ = this.root.map.plane.position.z;
    if (this.position.z > centreZ + this.threshold) {
      this.reset(-1);
    } else if (this.position.z < centreZ - this.threshold) {
      this.reset(1);
    }
  }

  getNormal(p) {
    // get perpendicular normal
    const normal = [-this.position.y, this.radius];

    // get magnitude
    const mag = Math.hypot(p.z - this.position.z, p.x - this.position.x);
    let t = easing(1 - mag / this.radius);
    t = Math.sin(t * Math.PI);

    // get 2d normal
    const nmax = new THREE.Vector2(-this.position.y, this.radius);
    nmax.normalize();
    const nx = nmax.x * t;
    const ny = nmax.y * t + (1 - t);

    // get 3d normal
    const theta = Math.atan2(p.x - this.position.x, p.z - this.position.z);
    const res = new THREE.Vector3(-Math.sin(theta) * nx, ny, -Math.cos(theta) * nx);
    res.normalize();
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
