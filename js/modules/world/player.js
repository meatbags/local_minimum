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

    // motion
    this.propulsion = new THREE.Vector3();
    this.speed = {
      x: {max: 24, blend: 0.5},
      z: {base: 10, min: 3, max: 18, blend: 0.1}
    };
    this.gravity = 50;
    this.friction = 0.95;
    this.collisionVelocityReduction = 0.75;
    this.physics = new THREE.Vector3();
    this.velocity = new THREE.Vector3();

    // world position
    this.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25, 32, 32), new THREE.MeshPhysicalMaterial({emissive: 0xffffff}));
    this.rect = new THREE.Mesh(new THREE.BoxBufferGeometry(0.05, 1, 0.05), new THREE.MeshPhysicalMaterial({emissive: 0xffffff}));
    this.group = new THREE.Group();
    this.group.add(this.mesh, this.rect);
    this.position = this.group.position;
    this.position.set(0, 0, 12);
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
    // calculate propulsion and add physics
    const z = (this.keys.up ? 1 : 0) + (this.keys.down ? -1 : 0);
    const x = (this.keys.left ? -1 : 0) + (this.keys.right ? 1 : 0);
    this.propulsion.x = blend(this.propulsion.x, x * this.speed.x.max, this.speed.x.blend);
    this.propulsion.z = blend(this.propulsion.z, this.speed.z.base + z * (z == 1 ? this.speed.z.max : this.speed.z.min), this.speed.z.blend);
    this.velocity.x = this.propulsion.x + this.physics.x;
    this.velocity.y = this.physics.y;
    this.velocity.z = this.propulsion.z + this.physics.z;

    // calculate floor
    let floor = 0;
    let res = null;
    this.root.points.forEach(node => {
      const h = node.getHeight(this.position);
      if (h < floor) {
        floor = h;
        res = node;
      }
    });

    // get new physics
    if (res && this.position.y <= floor) {
      const pull = res.getPull(this.position);
      pull.multiplyScalar(delta);
      this.physics.add(pull);
      this.physics.z = Math.max(0, this.physics.z);
      this.physics.y = pull.y * this.propulsion.z * 3;
    } else {
      this.physics.x -= this.physics.x * this.friction * delta;
      this.physics.y -= this.gravity * delta;
    }

    // apply position
    this.position.x = this.position.x + this.velocity.x * delta;
    this.position.y = Math.max(floor, this.position.y + this.velocity.y * delta);

    const dy = this.position.y - floor;
    this.rect.position.y = -dy / 2;
    this.rect.scale.y = Math.max(0.01, dy);

    // clamp
    if (this.position.x < -16) {
      this.position.x = -16;
      if (this.physics.x < 0) {
        this.physics.x *= -this.collisionVelocityReduction;
      }
    } else if (this.position.x > 16) {
      this.position.x = 16;
      if (this.physics.x > 0) {
        this.physics.x *= -this.collisionVelocityReduction;
      }
    }
  }
}

export { Player };
