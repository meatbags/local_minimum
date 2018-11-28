/**
 ** Canvas2D handler.
 **/

class Renderer2D {
  constructor(scene) {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.cvs.width = window.innerWidth;
    this.cvs.height = window.innerHeight;
    document.querySelector('#canvas-target').append(this.cvs);
    window.addEventListener('resize', () => { this.resize(); });
    this.stat = {speed: 0, maxSpeedometer: 30, hp: 0};
    this.colour = {light: '#fff', dark: '#444'};
    this.font = {large: '32px Karla', small: '12px Karla'};
  }

  resize() {
    this.cvs.width = window.innerWidth;
    this.cvs.height = window.innerHeight;
  }

  setStyle() {
    this.ctx.textAlign = 'center';
    this.ctx.lineWidth = 50;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.setStyle();
  }

  drawArcBar(x, y, t, label, subLabel) {
    const start = Math.PI * 0.75;
    this.ctx.strokeStyle = this.colour.dark;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 100, start, Math.PI * 2, false);
    this.ctx.stroke();
    this.ctx.strokeStyle = this.colour.light;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 100, start, start + t * Math.PI * 1.25, false);
    this.ctx.stroke();
    this.ctx.fillStyle = this.colour.light;
    this.ctx.font = this.font.large;
    this.ctx.fillText(label, x, y);
    this.ctx.font = this.font.small;
    this.ctx.fillText(subLabel, x, y + 20);
  }

  drawHP(hp) {
    this.stat.hp += (hp - this.stat.hp) * 0.05;
    const t = this.stat.hp / 100;
    this.drawArcBar(200, this.cvs.height - 150, t, `${Math.ceil(hp)}`, 'HULL');
  }

  drawSpeed(speed) {
    this.stat.speed += (speed - this.stat.speed) * 0.2;
    const t = this.stat.speed >= this.stat.maxSpeedometer ? 1 - Math.random() * 0.01 : this.stat.speed / this.stat.maxSpeedometer;
    this.drawArcBar(this.cvs.width - 200, this.cvs.height - 150, t, `${Math.floor(speed * 20) * 5}`, 'SANICS');
  }
}

export { Renderer2D };
