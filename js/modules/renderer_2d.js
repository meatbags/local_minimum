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
    const p = this.scene.player.position;
    this.ctx.fillText(`Px ${p.x.toFixed(1)}, y ${p.y.toFixed(1)}, z ${p.z.toFixed(1)}`, 0, 20);
    const speed = this.scene.player.node.velocity.z + this.scene.player.node.inertia.z;
    this.ctx.fillText(`Speed ${speed.toFixed(2)}`, 0, 40);
  }
}

export { Renderer2D };
