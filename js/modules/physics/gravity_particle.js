/**
 ** Interact with gravity nodes.
 **/

import { easing, blend } from '../utils/maths';

class GravityParticle {
  constructor(position) {
    this.position = position;
    this.jumpThreshold = 1.2;
    this.gravity = 2;
    this.airResistance = 0.01;
    this.up = new THREE.Vector3(0, 1, 0);
    this.surface = this.up;
    this.velocity = new THREE.Vector3();
    this.inertia = new THREE.Vector3();
    this.blend = {inertia: {z: 0.1}};
    this.scale = {inertia: {x: 10, y: 4, z: 10}};
  }

  setVelocity(v) {
    this.velocity.copy(v);
  }

  jump(y) {
    if (this.position.y - this.floor < this.jumpThreshold) {
      this.inertia.y += y;
    }
  }

  getSpeed() {
    return this.velocity.z + this.inertia.z;
  }

  update(delta, nodes) {
    // sample next position
    this.position.x += (this.velocity.x + this.inertia.x) * delta;
    this.position.y += (this.velocity.y + this.inertia.y) * delta;
    this.position.z += (this.velocity.z + this.inertia.z) * delta;

    // get floor
    this.floor = 0;
    let res = null;
    nodes.forEach(node => {
      const y = node.getFloorAtPoint(this.position);
      if (y < this.floor) {
        this.floor = y;
        res = node;
      }
    });

    // get surface normal
    if (this.position.y < this.floor) {
      this.position.y = this.floor;
      this.surface = res == null ? this.up : res.getNormal(this.position);
      const proj = this.velocity.clone();
      proj.projectOnPlane(this.surface);
      const vx = this.surface.x * this.scale.inertia.x;
      const vy = proj.y * this.scale.inertia.y;
      const sign = Math.sign(this.velocity.z);
      const vz = (sign === 1 ? Math.max(0, proj.z * this.surface.z * this.scale.inertia.z): Math.min(0, proj.z * this.surface.z * this.scale.inertia.z)) + Math.abs(vx * 2) * sign;
      this.inertia.x = vx;
      this.inertia.y = vy;
      this.inertia.z = blend(this.inertia.z, vz, this.blend.inertia.z);
    } else {
      this.inertia.y -= this.gravity;
      if (this.position.y > this.floor) {
        this.inertia.z -= this.inertia.z * this.airResistance;
      }
    }

    // limit
    if (this.position.x > 16) {
      this.position.x = 16;
    } else if (this.position.x < -16) {
      this.position.x = -16;
    }
  }
}

export { GravityParticle };
