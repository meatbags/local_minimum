/**
 ** Animated explosion.
 **/

class Explosion {
  constructor(sceneRef, position, velocity, parts, particleSize) {
    this.sceneRef = sceneRef;
    this.active = true;

    // group
    this.mesh = new THREE.Group();
    this.position = this.mesh.position;
    this.position.copy(position);
    this.velocity = velocity.clone();
    this.objects = [];

    for (var i=0, lim=(parts || 3); i<lim; ++i) {
      const obj = {};
      const size = 0.1 + Math.random() * (particleSize || 0.25);
      const theta = Math.random() * Math.PI * 2;
      const speed = 10 + Math.random() * 30;

      obj.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(size, 4, 4), new THREE.MeshBasicMaterial({color: 0xffffff}));
      obj.position = obj.mesh.position;
      obj.velocity = new THREE.Vector3(Math.cos(theta), Math.random() * 2 - 1, Math.sin(theta));
      obj.velocity.normalize();
      obj.velocity.multiplyScalar(speed);
      obj.lifespan = 0.25 + Math.random() * 0.75;

      // add particle
      this.mesh.add(obj.mesh);
      this.objects.push(obj);
    }

    // add to scene
    this.sceneRef.scene.add(this.mesh);
  }

  update(delta) {
    // move group reference
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.position.z += this.velocity.z * delta;

    // move explosion parts
    let res = false;
    this.objects.forEach(obj => {
      if (obj.lifespan > 0) {
        res = true;
        obj.lifespan -= delta;
        obj.position.x += obj.velocity.x * delta;
        obj.position.y += obj.velocity.y * delta;
        obj.position.z += obj.velocity.z * delta;
      } else {
        obj.visible = false;
      }
    });

    if (!res) {
      this.destroy();
    }
  }

  destroy() {
    this.sceneRef.scene.remove(this.mesh);
    this.active = false;
  }
}

export { Explosion };
