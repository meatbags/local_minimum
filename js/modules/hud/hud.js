/**
 ** Heads up display.
 **/

import { Renderer2D } from './renderer_2d';

class HUD {
  constructor(scene) {
    this.scene = scene;
    this.player = scene.player;
    this.renderer = new Renderer2D(this.scene);
  }

  draw(delta) {
    this.renderer.clear();
    this.renderer.drawSpeed(this.player.stat.speed);
    this.renderer.drawHP(this.player.stat.hp);
  }
}

export { HUD };
