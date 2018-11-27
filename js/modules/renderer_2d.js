/**
 ** 2D overlays.
 **/

class Renderer2D {
  constructor(scene) {
    this.scene = scene;
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.cvs.width = 200;
    this.cvs.height = 400;
    this.cvs.style.left = 'auto';
    this.cvs.style.right = '0';
    document.querySelector('#canvas-target').append(this.cvs);
    this.ctx.fillStyle = "#fff";
    this.ctx.font = 'normal 12px Arial';
    window.addEventListener('resize', () => { this.resize(); });
  }

  resize() {}

  draw(delta) {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    const x = this.scene.player.position.x.toFixed(1);
    const y = this.scene.player.position.y.toFixed(1);
    const z = this.scene.player.position.z.toFixed(1);
    this.ctx.fillText(`x ${x}, y ${y}, z ${z}`, 0, 20);
  }
}

export { Renderer2D };
