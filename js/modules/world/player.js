/**
 ** Player controls.
 **/

import { Keyboard } from '../utils';
import { GravityParticle } from './physics';
import { blend, clamp } from '../utils/maths';

class Player {
  constructor(root) {
    this.root = root;
    this.keyboard = new Keyboard(key => { this.onKeyboard(key); });
    this.keys = {up: false, down: false, left: false, right: false};
    this.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 32, 32), new THREE.MeshPhysicalMaterial({emissive: 0xffffff}));
    this.position = this.mesh.position;
    this.node = new GravityParticle(this.position);
    this.root.scene.add(this.mesh);
  }

  update(delta) {
    const z = (this.keys.up ? 1 : 0) + (this.keys.down ? -1 : 0);
    const x = (this.keys.left ? 1 : 0) + (this.keys.right ? -1 : 0);
    const dx = x * 16;
    const dz = 6 + z * 12;
    this.node.boost(dx, 0, dz);
    this.node.update(delta, this.root.gravityNodes);

    // limit
    this.position.x = clamp(this.position.x, -16, 16);
  }

  onKeyboard(key) {
    switch (key) {
      case 'a': case 'A': case 'ArrowLeft':
        this.keys.left = this.keyboard.keys[key];
        break;
      case 'd': case 'D': case 'ArrowRight':
        this.keys.right = this.keyboard.keys[key];
        break;
      case 'w': case 'W': case 'ArrowUp':
        this.keys.up = this.keyboard.keys[key];
        break;
      case 's': case 'S': case 'ArrowDown':
        this.keys.down = this.keyboard.keys[key];
        break;
      default:
        break;
    }
  }
}

export { Player };
