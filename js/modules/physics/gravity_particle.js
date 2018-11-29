/**
 ** Particle for interacting with gravitational plane.
 **/

import { easing, blend } from '../utils/maths';
import { constants } from './constants';

class GravityParticle {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity || new THREE.Vector3();
    this.jumpThreshold = 1.2;
    this.constants = constants;
    this.up = new THREE.Vector3(0, 1, 0);
    this.surface = this.up;
    this.inertia = new THREE.Vector3();
    this.limit = {negx: -16, posx: 16};
    this.blend = {inertia: {z: 0.1}};
    this.scale = {inertia: {x: 5, y: 4, z: 9}};
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

  getTotalVelocity() {
    const v = this.velocity.clone();
    v.add(this.inertia);
    return v;
  }

  applyVelocity(delta) {
    this.position.x += (this.velocity.x + this.inertia.x) * delta;
    this.position.y += (this.velocity.y + this.inertia.y) * delta;
    this.position.z += (this.velocity.z + this.inertia.z) * delta;
  }

  applyFloor(nodes) {
    // get floor node
    this.floor = 0;
    let res = null;
    nodes.forEach(node => {
      const y = node.getFloorAtPoint(this.position);
      if (y < this.floor) {
        this.floor = y;
        res = node;
      }
    });

    // set surface normal
    this.surface = res == null ? this.up : res.getNormal(this.position);
  }

  setLimit(negx, posx) {
    this.limit.negx = negx;
    this.limit.posx = posx;
  }

  applyLimit() {
    if (this.position.x > this.limit.posx) {
      this.position.x = this.limit.posx;
    } else if (this.position.x < this.limit.negx) {
      this.position.x = this.limit.negx;
    }
  }

  snap(delta, nodes) {
    // snap to gravity nodes
    this.applyVelocity(delta);
    this.applyFloor(nodes);

    // snap or fall
    if (this.position.y < this.floor) {
      this.position.y = this.floor;
    } else {
      this.inertia.y -= this.constants.gravity;
    }

    // limit
    this.applyLimit();
  }

  move(delta, nodes) {
    // move against gravity nodes
    this.applyVelocity(delta);
    this.applyFloor(nodes);

    // calculate bounce factor, apply
    if (this.position.y < this.floor) {
      this.position.y = this.floor;
      const proj = this.velocity.clone();
      proj.projectOnPlane(this.surface);
      const vx = this.surface.x * this.scale.inertia.x;
      const vy = proj.y * this.scale.inertia.y;
      const sign = Math.sign(this.velocity.z);
      let vz = proj.z * this.surface.z * this.scale.inertia.z;
      vz = (sign == 1 ? Math.max(0, vz) : Math.min(0, vz)) + Math.abs(vx * 1.5) * sign;
      this.inertia.x = vx;
      this.inertia.y = vy;
      this.inertia.z = blend(this.inertia.z, vz, this.blend.inertia.z);
    } else {
      this.inertia.y -= this.constants.gravity;
      if (this.position.y > this.floor) {
        this.inertia.z -= this.inertia.z * this.constants.airResistance;
      }
    }

    // limit
    this.applyLimit();
  }
}

export { GravityParticle };
