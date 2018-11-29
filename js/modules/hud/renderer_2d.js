/**
 ** Canvas2D handler.
 **/

class Renderer2D {
  constructor() {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.cvs.width = window.innerWidth;
    this.cvs.height = window.innerHeight;
    document.querySelector('#canvas-target').append(this.cvs);
    window.addEventListener('resize', () => { this.resize(); });
    this.stat = {speed: 0, maxSpeedometer: 30, hp: 0};
    this.arc = {radius: 80};
    this.colour = {light: '#fff', dark: '#444'};
    this.font = {score: '18px Karla', large: '32px Karla', small: '12px Karla'};
    this.lineWidth = {fat: 50, thin: 4};
  }

  resize() {
    this.cvs.width = window.innerWidth;
    this.cvs.height = window.innerHeight;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }

  billboardText(text, x, y) {
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x, y);
  }

  drawText(text, x, y) {
    this.ctx.textAlign = 'right';
    this.ctx.font = this.font.text;
    this.ctx.fillStyle = this.colour.light;
    this.ctx.fillText(text, x, y);
  }

  drawScore(score) {
    this.ctx.textAlign = 'right';
    this.ctx.font = this.font.text;
    this.ctx.lineWidth = this.lineWidth.thin;
    this.ctx.strokeStyle = this.colour.light;
    const text = `${score} POINTS`
    const x = this.cvs.width - 75;
    const y = this.cvs.height - 50;
    //this.ctx.strokeText(text, x, y);
    this.ctx.fillStyle = this.colour.light;
    this.ctx.fillText(text, x, y);
  }

  drawArcBar(x, y, t, label, subLabel) {
    const start = Math.PI * 0.75;
    this.ctx.textAlign = 'center';
    this.ctx.strokeStyle = this.colour.dark;
    this.ctx.lineWidth = this.lineWidth.fat;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.arc.radius, start, Math.PI * 2, false);
    this.ctx.stroke();
    this.ctx.strokeStyle = this.colour.light;
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.arc.radius, start, start + t * Math.PI * 1.25, false);
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
