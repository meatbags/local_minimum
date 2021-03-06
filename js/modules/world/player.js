/**
 ** Player controls.
 **/

import { Keyboard, Mouse } from '../utils';
import { GravityParticle } from '../physics';
import { Bullet } from './objects';
import { blend, clamp, minAngleBetween, easingOut } from '../utils/maths';

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
    this.group = new THREE.Group();

    // physics
    this.position = this.group.position;
    this.node = new GravityParticle(this.position);
    this.speed = {
      current: new THREE.Vector3(),
      x: {max: 10, blend: 7.5}, // 0.125
      y: {max: 30},
      z: {base: 10, max: 20, min: 5, blend: 2.1}, // 0.035
      rotation: {}
    };
    this.jumpLock = {active: false, time: 0, timeout: 0.6, dir: 1};

    // animation
    this.direction = new THREE.Vector3();
    this.directionSmooth = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    this.orientation = new THREE.Vector3(0, 0, 1);

    // init
    this.resetStatus();
    this.root.scene.add(this.group, this.plane);
  }

  setMesh(mesh) {
    this.group.add(mesh);
  }

  resetStatus() {
    this.stat = {multiplier: 1, hp: 100, time: 0, speed: 0, maxSpeed: 0, speedIncrement: 0, score: 0, maxHeight: 0};
  }

  status(delta) {
    this.stat.time += delta;
    this.stat.speed = this.node.getSpeed();
    this.stat.multiplier = Math.max(1, this.stat.speed / 30);
    this.stat.maxSpeed = Math.max(this.stat.maxSpeed, this.stat.speed);
    this.stat.maxHeight = Math.max(this.stat.maxHeight, this.position.y);
    this.stat.score = Math.floor(this.stat.time * 10 * this.stat.multiplier);
    this.stat.speedIncrement = Math.min(5, this.stat.time / 30);
  }

  update(delta) {
    this.move(delta);
    this.status(delta);

    // test
    if (this.mouse.active) {
      this.shoot();
    }
  }

  move(delta) {
    // process input
    const x = (this.keys.left ? 1 : 0) + (this.keys.right ? -1 : 0);
    const z = (this.keys.up ? 1 : 0) + (this.keys.down ? -1 : 0);
    const sz = (z == 1 ? this.speed.z.max : (z == -1 ? this.speed.z.min : this.speed.z.base)) + this.stat.speedIncrement;
    this.speed.current.x = blend(this.speed.current.x, x * this.speed.x.max, Math.min(1, this.speed.x.blend * delta));
    this.speed.current.z = blend(this.speed.current.z, sz, Math.min(1, this.speed.z.blend * delta));

    // reset jump timer
    if (this.jumpLock.active) {
      this.jumpLock.time += delta;
      if (this.jumpLock.time > this.jumpLock.timeout) {
        this.jumpLock.time = 0;
        this.jumpLock.active = false;
      }
    }

    // jump
    if (this.keys.space && !this.jumpLock.active) {
      this.keys.space = false;
      this.node.jump(this.speed.y.max);
      this.jumpLock.active = true;
      this.jumpLock.time = 0;
      this.jumpLock.dir = (this.speed.current.x == 0 ? (Math.random() > 0.5 ? -1 : 1) : (this.speed.current.x > 0 ? -1 : 1));
    }

    // move player against plane
    this.direction.copy(this.position);
    this.node.setVelocity(this.speed.current);
    this.node.move(delta, this.root.gravityNodes);

    // rotate model
    this.direction.sub(this.position).negate();
    this.directionSmooth.x = blend(this.directionSmooth.x, this.direction.x, 0.2);
    this.directionSmooth.y = blend(this.directionSmooth.y, this.direction.y, 0.2);
    this.directionSmooth.z = blend(this.directionSmooth.z, this.direction.z, 0.2);
    //this.orientation.x = -this.node.surface.x;
    this.group.quaternion.setFromUnitVectors(this.orientation, this.directionSmooth);
    const jumpAnim = this.jumpLock.active ? easingOut(this.jumpLock.time / this.jumpLock.timeout) * Math.PI * 2 * this.jumpLock.dir : 0;
    this.rotation.z += minAngleBetween(this.rotation.z, -this.node.surface.x * Math.PI * 0.5) * 0.05;
    this.group.rotation.z = this.rotation.z + jumpAnim;

    // raytracing collision plane
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
        if (!this.bullets) {
          this.bullets = [];
        }
        const target = res[0].point;
        this.root.map.add(new Bullet(this.root, this.position, target))
        /*
        const dx = target.x - this.position.x;
        const dz = target.z - this.position.z;
        const theta = Math.atan2(dx, dz);
        const mag = Math.hypot(dx, dz);
        const target2 = target.clone();
        const target3 = target.clone();
        const off = Math.PI / 24;
        target2.z = this.position.z + Math.cos(theta + off) * mag;
        target2.x = this.position.x + Math.sin(theta + off) * mag;
        target3.z = this.position.z + Math.cos(theta - off) * mag;
        target3.x = this.position.x + Math.sin(theta - off) * mag;
        this.bullets.push(new TestBullet(this.root, this.position, target2));
        this.bullets.push(new TestBullet(this.root, this.position, target3));
        */
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
