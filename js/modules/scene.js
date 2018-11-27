/**
 * 3D scene handler.
 **/

import { Camera, Lighting, Map, Player, GravityNode } from './world';
import { randomRange } from './utils/maths';

class Scene {
  constructor() {
    this.element = document.querySelector('#canvas-target');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.player = new Player(this);
    this.camera = new Camera(this);
    this.lighting = new Lighting(this);
    this.map = new Map(this);

    // points
    this.gravityNodes = [];
    for (var i=0; i<16; i++) {
      this.gravityNodes.push(new GravityNode(this));
    }

    // background stars
    this.stars = [];
    for (var i=0; i<16; i++) {
      const star = new THREE.Mesh(new THREE.SphereBufferGeometry(0.1, 2, 2), new THREE.MeshBasicMaterial({color: 0xffffff}));
      star.position.set(randomRange(-32, 32), randomRange(-16, 16), randomRange(-32, 32));
      this.stars.push(star);
      this.scene.add(star);
    }

    // events
    window.addEventListener('resize', () => { this.resize(); });
  }

  reset() {
    this.map.materials.reset();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.resize();
  }

  update(delta) {
    this.gravityNodes.forEach(p => { p.update(delta); });
    this.stars.forEach(star => {
      if (star.position.z < this.camera.position.z) {
        star.position.set(randomRange(-32, 32), randomRange(-16, 16), star.position.z + 64);
      }
    });
    this.player.update(delta);
    this.camera.update(delta);
    this.map.update(delta);
  }
}

export { Scene };
