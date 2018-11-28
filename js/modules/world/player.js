/**
 ** Player controls.
 **/

import { Keyboard } from '../utils';
import { GravityParticle } from './physics';
import { blend, clamp, minAngleBetween } from '../utils/maths';

class Player {
  constructor(root) {
    this.root = root;
    this.keyboard = new Keyboard(key => { this.onKeyboard(key); });
    this.keys = {up: false, down: false, left: false, right: false, space: false};
    this.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 0.125, 0.5), new THREE.MeshPhysicalMaterial({emissive: 0xffffff}));
    this.ref = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 1, 0.1), new THREE.MeshPhysicalMaterial({emissive: 0x444444}));
    this.position = this.mesh.position;
    this.speed = {
      current: new THREE.Vector3(),
      x: {max: 10, blend: 0.125},
      y: {max: 30},
      z: {base: 12, max: 22, min: 8, blend: 0.05},
      rotation: {}
    };
    this.jumpLock = {active: false, time: 0, timeout: 0.5, dir: 1};
    this.node = new GravityParticle(this.position);
    this.root.scene.add(this.mesh, this.ref);
    this.stat = {hp: 100, speed: 0, maxSpeed: 0, points: 0, maxHeight: 0};
  }

  update(delta) {
    this.move(delta);
    this.status();
  }

  status() {
    this.stat.speed = this.node.getSpeed();
    this.stat.maxSpeed = Math.max(this.stat.maxSpeed, this.stat.speed);
    this.stat.maxHeight = Math.max(this.stat.maxHeight, this.position.y);
    this.points += 1;
  }

  move(delta) {
    // move
    const z = (this.keys.up ? 1 : 0) + (this.keys.down ? -1 : 0);
    const x = (this.keys.left ? 1 : 0) + (this.keys.right ? -1 : 0);
    this.speed.current.x = blend(this.speed.current.x, x * this.speed.x.max, this.speed.x.blend);
    this.speed.current.z = blend(this.speed.current.z, z == 1 ? this.speed.z.max : (z == -1 ? this.speed.z.min : this.speed.z.base), this.speed.z.blend);

    // jump
    if (this.jumpLock.active) {
      this.jumpLock.time += delta;
      if (this.jumpLock.time > this.jumpLock.timeout) {
        this.jumpLock.time = 0;
        this.jumpLock.active = false;
      }
    }
    if (this.keys.space && !this.jumpLock.active) {
      this.keys.space = false;
      this.node.jump(this.speed.y.max);
      this.jumpLock.active = true;
      this.jumpLock.time = 0;
      this.jumpLock.dir = this.speed.current.x > 0 ? -1 : 1;
    }

    // process against gravity nodes
    this.node.setVelocity(this.speed.current);
    this.node.update(delta, this.root.gravityNodes);

    // rotate model
    const jumpAnim = this.jumpLock.active ? (this.jumpLock.time / this.jumpLock.timeout) * Math.PI * 2 * this.jumpLock.dir : 0;
    this.mesh.rotation.z = -this.node.surface.x * Math.PI * 0.5 - x * Math.PI * 0.125 + jumpAnim;
    this.mesh.rotation.x = -Math.atan2(this.node.inertia.y, this.node.inertia.z + this.node.velocity.z);

    // marker
    this.ref.scale.y = Math.max(0.01, this.position.y - this.node.floor);
    this.ref.position.set(this.position.x, this.position.y - this.ref.scale.y / 2, this.position.z);
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
      case ' ':
        if (this.keyboard.keys[key]) {
          this.keys.space = true;
          this.keyboard.release(' ');
        }
        break;
      default:
        break;
    }
  }
}

export { Player };
