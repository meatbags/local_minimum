/**
 ** Player controls.
 **/

import { Keyboard, Mouse } from '../utils';
import { GravityParticle } from '../physics';
import { blend, clamp, minAngleBetween } from '../utils/maths';

class Player {
  constructor(root) {
    this.root = root;

    // controls
    this.domElement = document.querySelector('#canvas-target');
    this.mouse = new Mouse(this.domElement);
    this.keyboard = new Keyboard(key => { this.onKeyboard(key); });
    this.keys = {up: false, down: false, left: false, right: false, space: false};
    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(128, 128), new THREE.MeshBasicMaterial({visible: false}));
    this.plane.rotation.x = Math.PI / -2;

    // meshes
    this.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(2, 0.125, 0.5), new THREE.MeshPhysicalMaterial({emissive: 0xffffff}));
    this.ref = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 1, 0.1), new THREE.MeshPhysicalMaterial({emissive: 0x444444}));

    // physics
    this.position = this.mesh.position;
    this.node = new GravityParticle(this.position);
    this.speed = {
      current: new THREE.Vector3(),
      x: {max: 10, blend: 0.125},
      y: {max: 30},
      z: {base: 12, max: 22, min: 8, blend: 0.05},
      rotation: {}
    };
    this.jumpLock = {active: false, time: 0, timeout: 0.5, dir: 1};

    // init
    this.resetStatus();
    this.root.scene.add(this.mesh, this.ref, this.plane);
  }

  resetStatus() {
    this.stat = {hp: 100, time: 0, speed: 0, maxSpeed: 0, score: 0, maxHeight: 0};
  }

  status(delta) {
    this.stat.time += delta;
    this.stat.speed = this.node.getSpeed();
    this.stat.maxSpeed = Math.max(this.stat.maxSpeed, this.stat.speed);
    this.stat.maxHeight = Math.max(this.stat.maxHeight, this.position.y);
    this.stat.score = Math.floor(this.stat.time * 15);
  }

  update(delta) {
    this.move(delta);
    this.status(delta);

    // test
    if (this.mouse.active) {
      this.shoot();
    }

    if (this.bullets) {
      for (var i=this.bullets.length-1, lim=-1; i>lim; --i) {
        const b = this.bullets[i];
        b.p.x += b.v.x * delta;
        b.p.y += b.v.y * delta;
        b.p.z += b.v.z * delta;
        b.age += delta;
        if (b.age > 0.75) {
          this.bullets.splice(i, 1);
          this.root.scene.remove(b.mesh);
        }
      }
    }
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
    this.plane.position.x = this.position.x;
    this.plane.position.z = this.position.z;
  }

  shoot() {
    const t = (new Date()).getTime();
    if (this.bulletTimeout === undefined || t > this.bulletTimeout) {
      // timeout
      this.bulletTimeout = t + 50;

      // get mouse position
      const mouse = new THREE.Vector2(
        (this.mouse.x / window.innerWidth) * 2 - 1,
        -((this.mouse.y / window.innerHeight) * 2 - 1)
      );
      this.raycaster.setFromCamera(mouse, this.root.camera.camera);
      const res = this.raycaster.intersectObjects([this.plane]);

      // create bullet
      if (res.length) {
        const target = res[0].point;
        const bullet = {};
        bullet.age = 0;
        bullet.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 1, 0.2), new THREE.MeshBasicMaterial({}));
        bullet.mesh.position.copy(this.position);
        bullet.p = bullet.mesh.position;
        bullet.v = target.clone();
        bullet.v.sub(bullet.p);
        bullet.v.normalize();
        bullet.v.multiplyScalar(40);

        // add velocity
        const pv = this.node.velocity.clone();
        pv.projectOnVector(bullet.v);
        bullet.v.add(pv);

        // add bullet
        if (!this.bullets) {
          this.bullets = [];
        }
        this.bullets.push(bullet);
        this.root.scene.add(bullet.mesh);
      }
    }
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
