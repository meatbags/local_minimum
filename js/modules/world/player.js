/**
 ** Player controls.
 **/

import { Keyboard } from '../utils';
import { blend, clamp } from '../utils/maths';

class Player {
  constructor(root) {
    this.root = root;
    this.keyboard = new Keyboard(key => { this.onKeyboard(key); });
    this.keys = {up: false, down: false, left: false, right: false};
    this.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.5, 0.5, 0.5), new THREE.MeshPhysicalMaterial({emissive: 0xffffff}));
    this.group = new THREE.Group();
    this.group.add(this.mesh);
    this.speed = {base: 6, min: 3, max: 18, blend: 0.1, strafe: 8};
    this.position = this.group.position;
    this.position.set(0, 0, 12);
    this.velocity = new THREE.Vector3();
    this.root.scene.add(this.group);
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

  update(delta) {
    const z = (this.keys.up ? 1 : 0) + (this.keys.down ? -1 : 0);
    const x = (this.keys.left ? -1 : 0) + (this.keys.right ? 1 : 0);
    this.velocity.x = x * this.speed.strafe;
    this.velocity.z = blend(this.velocity.z, z == 0 ? this.speed.base : z == -1 ? this.speed.min : this.speed.max, this.speed.blend);
    this.position.x = clamp(this.position.x + this.velocity.x * delta, -16, 16);

    // calculate height
    let y = 0;
    this.root.points.forEach(p => {
      y = Math.min(y, p.getHeight(this.position));
    });
    this.position.y = y;
  }
}

export { Player };
