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
    //root.scene.add(this.mesh);
  }

  reset() {
    this.height = randomRange(-6, -1.5);
    this.radius = Math.abs(this.height) * 2;
    this.threshold = 16 + this.radius;
    this.position.x = randomRange(-16, 16);
    this.position.y = this.height;
    this.position.z = this.threshold;
    this.velocity = new THREE.Vector3(randomRange(-3, 3), 0, randomRange(-5, -1));
  }

  getHeight(p) {
    const mag = p.distanceTo(this.position);
    return (mag > this.radius) ? 0 : easing(1 - mag / this.radius) * this.height;
  }

  update(delta) {
    this.position.x += this.velocity.x * delta;
    this.position.z += this.velocity.z * delta;
    if (this.position.z < -this.threshold || Math.abs(this.position.x) > this.threshold) {
      this.reset();
    }
  }
}

export { GravityNode };
