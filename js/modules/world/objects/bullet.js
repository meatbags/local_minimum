/**
 ** Test object.
 **/

import { GravityParticle } from '../../physics';
import { Explosion } from './explosion';
import { config } from './config';

class Bullet {
  constructor(sceneRef, position, target) {
    this.active = true;
    this.sceneRef = sceneRef;
    this.age = 0;
    this.maxAge = 0.6 + Math.random() * 0.8;

    // bullet mesh
    this.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.15, 4, 4), config.mat.white);
    this.mesh.position.copy(position);
    this.position = this.mesh.position;
    this.velocity = target.clone();
    this.velocity.sub(this.position);
    this.velocity.normalize();
    this.velocity.multiplyScalar(30);

    // rotate mesh
    this.mesh.quaternion.setFromUnitVectors(config.vector.up, this.velocity.clone().normalize());
    this.mesh.scale.y = 3 + Math.random() * 2;

    // add player velocity
    const pv = this.sceneRef.player.node.getTotalVelocity();
    this.velocity.add(pv);

    // create particle
    this.node = new GravityParticle(this.position, this.velocity);
    this.node.setLimit(-64, 64);

    // add bullet
    this.sceneRef.scene.add(this.mesh);
  }

  update(delta) {
    if (this.active) {
      this.age += delta;
      if (this.age > this.maxAge) {
        this.destroy(false);
      }

      // move
      this.node.snap(delta, this.sceneRef.gravityNodes);
    }
  }

  destroy(stop) {
    const n = 2 + Math.floor(Math.random() * 3);
    const v = stop ? new THREE.Vector3() : this.velocity;
    this.sceneRef.map.add(new Explosion(this.sceneRef, this.position, v, n));
    this.sceneRef.scene.remove(this.mesh);
    this.active = false;
  }
}

export { Bullet };
