/**
 ** Test object.
 **/

import { GravityParticle } from '../../physics';
import { Explosion } from './explosion';

class Bullet {
  constructor(sceneRef, position, target) {
    this.active = true;
    this.sceneRef = sceneRef;
    this.age = 0;
    this.maxAge = 0.6 + Math.random() * 0.8;
    this.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 12, 12), new THREE.MeshBasicMaterial({}));
    this.mesh.position.copy(position);
    this.position = this.mesh.position;
    this.velocity = target.clone();
    this.velocity.sub(this.position);
    this.velocity.normalize();
    this.velocity.multiplyScalar(30);

    // add player velocity
    const pv = this.sceneRef.player.node.getTotalVelocity();
    //pv.projectOnVector(this.velocity);
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
        this.destroy();
      }

      // move
      this.node.snap(delta, this.sceneRef.gravityNodes);
    }
  }

  destroy() {
    this.sceneRef.scene.remove(this.mesh);
    this.active = false;
    const parts = 2 + Math.floor(Math.random() * 3);
    this.sceneRef.map.add(new Explosion(this.sceneRef, this.position, this.velocity, parts));
  }
}

export { Bullet };
