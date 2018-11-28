/**
 ** Heads up display.
 **/

import { Renderer2D } from './renderer_2d';

class HUD {
  constructor(scene) {
    this.scene = scene;
    this.player = scene.player;
    this.camera = scene.camera.camera;
    this.worldDirection = new THREE.Vector3();
    this.temp = new THREE.Vector3();
    this.renderer = new Renderer2D();
    this.centre = {};
    this.resize();
    window.addEventListener('resize', () => { this.resize(); });
  }

  getScreenPosition(p) {
    this.temp.copy(p);
    this.temp.project(this.camera);
    return new THREE.Vector2((this.temp.x + 1) * this.centre.x, (-this.temp.y + 1) * this.centre.y);
  }

  resize() {
    this.centre.x = window.innerWidth / 2;
    this.centre.y = window.innerHeight / 2;
  }

  draw(delta) {
    this.renderer.clear();

    // draw billboards
    //this.camera.getWorldDirection(this.worldDirection);
    const p = this.getScreenPosition(this.player.position);
    this.renderer.billboardText('p1', p.x, p.y - 10);

    // draw HUD
    this.renderer.drawSpeed(this.player.stat.speed);
    this.renderer.drawHP(this.player.stat.hp);
    this.renderer.drawScore(this.player.stat.score);
  }
}

export { HUD };
