/**
 ** Test object.
 **/

import { GravityParticle } from '../../physics';

class TestBullet {
  constructor(sceneRef, position, target) {
    this.active = true;
    this.sceneRef = sceneRef;
    this.age = 0;
    this.maxAge = 1;
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
    this.age += delta;
    if (this.age > this.maxAge) {
      this.destroy();
    }

    // move
    this.node.snap(delta, this.sceneRef.gravityNodes);
  }

  destroy() {
    this.sceneRef.scene.remove(this.mesh);
    this.active = false;
  }
}

export { TestBullet };
