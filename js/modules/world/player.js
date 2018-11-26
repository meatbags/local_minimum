/**
 ** Player controls.
 **/

import { Keyboard } from '../utils';

class Player {
  constructor(root) {
    this.root = root;
    this.keyboard = new Keyboard(key => { this.onKeyboard(key); });
    this.keys = {up: false, down: false, left: false, right: false};
    this.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.5, 0.5, 0.5), new THREE.MeshPhysicalMaterial({emissive: 0xffffff}));
    this.group = new THREE.Group();
    this.group.add(this.mesh);
    this.speed = 10;
    this.position = this.group.position;
    //this.light = new THREE.PointLight(0xffffff, 1, 5, 2);
    //this.light.position.y = 0.25;
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
    const x = (this.keys.left ? 1 : 0) + (this.keys.right ? -1 : 0);
    const scale = (z && x) ? 0.7071 : 1;
    this.position.z += z * this.speed * delta * scale;
    this.position.x += x * this.speed * delta * scale;
    let y = 0;
    this.root.points.forEach(p => {
      y = Math.min(y, p.getHeight(this.position));
    });
    this.position.y = y;
  }
}

export { Player };
