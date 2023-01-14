"use strict";

class Background {
  constructor() {
    this.animation = 0;
    this.fps = 30;
    this.fps_interval = 1000 / this.fps;
    this.now = 0;
    this.then = performance.now();
    this.elapsed = 0;

    this.canvas = document.querySelector(".page-background");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    addEventListener("resize", this.resize.bind(this));

    this.resize();
    this.startAnimation();
  }

  startAnimation() {
    if (this.animation != 0) return;
    this.animation = requestAnimationFrame(this.animate.bind(this));
  }

  stopAnimation() {
    cancelAnimationFrame(this.animation);
    this.animation = 0;
  }

  resize() {
    this.canvas_w = window.innerWidth;
    this.canvas_h = window.innerHeight;
    this.canvas.width = this.canvas_w;
    this.canvas.height = this.canvas_h;
    this.generatePoints();
  }

  animate(new_time) {
    this.animation = requestAnimationFrame(this.animate.bind(this));

    this.now = new_time;
    this.elapsed = this.now - this.then;

    if (this.elapsed > this.fps_interval) {
      this.then = this.now - (this.elapsed % this.fps_interval);
      this.drawPoints();
    }
  }

  drawPoints() {
    this.ctx.clearRect(0, 0, this.canvas_w, this.canvas_h);

    for (let i = 0; i < this.points.length; i++) {
      this.updatePointPosition(i);

      this.ctx.fillStyle = `#${this.points[i].color}`;
      this.ctx.beginPath();
      this.ctx.arc(this.points[i].x, this.points[i].y, this.points[i].r, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  generatePoints() {
    const points_amount = ((this.canvas_w * this.canvas_h) / 10000) | 0;
    this.points = [];

    for (let i = 0; i < points_amount; i++) {
      this.points.push({
        x: randomInt(1, this.canvas_w),
        y: randomInt(1, this.canvas_h),
        vx: randomInt(-1, 1),
        vy: randomInt(-1, 1),
        r: randomInt(1, 12),
        color: randomInt(0, 16777215).toString(16),
      });
    }
  }

  updatePointPosition(i) {
    if (this.points[i].vx === 0) this.points[i].vx = 0.5;
    this.points[i].x += this.points[i].vx / 2;
    if (this.points[i].x > this.canvas_w + 50) this.points[i].x = -50;
    else if (this.points[i].x < -50) this.points[i].x = this.canvas_w + 50;

    if (this.points[i].vy === 0) this.points[i].vy = 0.5;
    this.points[i].y += this.points[i].vy / 2;
    if (this.points[i].y > this.canvas_h + 50) this.points[i].y = -50;
    else if (this.points[i].y < -50) this.points[i].y = this.canvas_h + 50;
  }
}

new Background();
