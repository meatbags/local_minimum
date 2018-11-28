/**
 ** Interact with gravity nodes.
 **/

import { easing, blend } from '../../utils/maths';

class GravityParticle {
  constructor(position) {
    this.position = position;
    this.jumpThreshold = 1.2;
    this.gravity = 2;
    this.up = new THREE.Vector3(0, 1, 0);
    this.surface = this.up;
    this.velocity = new THREE.Vector3();
    this.inertia = new THREE.Vector3();
  }

  setVelocity(v) {
    this.velocity.copy(v);
  }

  jump(y) {
    if (this.position.y - this.floor < this.jumpThreshold) {
      this.inertia.y += y;
    }
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
      const vx = this.surface.x * 10;
      const vy = proj.y * 4;
      const sign = Math.sign(this.velocity.z);
      const vz = (sign === 1 ? Math.max(0, proj.z * this.surface.z * 10): Math.min(0, proj.z * this.surface.z * 10)) + Math.abs(vx * 2) * sign;
      this.inertia.x = vx;
      this.inertia.y = vy;
      this.inertia.z = blend(this.inertia.z, vz, 0.05);
    } else {
      this.inertia.y -= this.gravity;
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
