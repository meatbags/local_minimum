/**
 * 3D scene handler.
 **/

import { Camera, Map, Player, ObjectHandler } from './world';
import { GravityNode } from './physics';
import { Lighting } from './shaders';
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
    this.player.update(delta);
    this.camera.update(delta);
    this.map.update(delta);
    this.lighting.update(delta);
  }
}

export { Scene };
