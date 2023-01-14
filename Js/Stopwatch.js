"use strict";

class StopwatchViewBackground {
  constructor() {
    this.animation = 0;
    this.fps = 30;
    this.fps_interval = 1000 / this.fps;
    this.now = 0;
    this.then = performance.now();
    this.elapsed = 0;
    this.indicator_angle = 0;

    this.canvas = document.querySelector(".stopwatch-view .background");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    addEventListener("resize", this.resize.bind(this));

    this.resize();
    this.resetAnimation();
  }

  startAnimation() {
    if (this.animation != 0) return;
    this.animation = requestAnimationFrame(this.animate.bind(this));
  }

  stopAnimation() {
    cancelAnimationFrame(this.animation);
    this.animation = 0;
  }

  resetAnimation() {
    this.stopAnimation();
    this.indicator_angle = 0;
    this.ctx.setTransform(1,0,0,1,0,0);
    this.ctx.translate(this.canvas_w / 2, this.canvas_h / 2);
    this.ctx.clearRect(-this.canvas_w / 2, -this.canvas_h / 2, this.canvas_w, this.canvas_h);
    this.drawClock();
    this.drawIndicator();
  }

  resize() {
    this.canvas_w = window.innerWidth;
    this.canvas_h = (window.innerHeight * 2) / 3 + 10;
    this.canvas.width = this.canvas_w;
    this.canvas.height = this.canvas_h;
    this.indicator_radius = this.canvas_h / 2.5;
    this.clock_radius = this.canvas_h / 2.2;
    this.indicator_angle = 0;

    this.ctx.translate(this.canvas_w / 2, this.canvas_h / 2);
    this.drawClock();
    this.drawIndicator();
  }

  animate(new_time) {
    this.animation = requestAnimationFrame(this.animate.bind(this));

    this.now = new_time;
    this.elapsed = this.now - this.then;

    if (this.elapsed > this.fps_interval) {
      this.then = this.now - (this.elapsed % this.fps_interval);

      this.drawIndicator();
      this.indicator_angle = (1.959 * Math.PI) / 60 / 30;
    }
  }

  drawIndicator() {
    this.ctx.clearRect(-10, -this.indicator_radius - 10, 20, 20);
    this.ctx.fillStyle = `red`;
    this.ctx.beginPath();
    this.ctx.arc(0, -this.indicator_radius, 8, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.rotate(this.indicator_angle);
  }

  drawClock() {
    for (let i = 0; i < 180; i++) {
      this.ctx.fillStyle = i == 0 ? "red" : "white";
      this.ctx.fillRect(0, -this.clock_radius, 2, 10);
      this.ctx.rotate((2 * Math.PI) / 180);
    }
  }
}

class StopwatchView {
  constructor() {
    this.background = new StopwatchViewBackground();
    this.container = document.querySelector(".stopwatch-view");

    this.timer_container = this.container.querySelector(".timer");
    this.time = [0, 0, 0, 0]; // h, m, s, ms
    this.timer_interval = null;

    this.buttons = this.container.querySelectorAll("button");
    this.buttons[0].addEventListener("click", this.startStopwatch.bind(this));
    this.buttons[1].addEventListener("click", this.stopStopwatch.bind(this));
    this.buttons[2].addEventListener("click", this.restartStopwatch.bind(this));
  }

  startStopwatch() {
    if (this.timer_interval != null) return;
    this.timer_interval = setInterval(this.stopwatchTick.bind(this), 10);
    this.background.startAnimation();
  }

  stopStopwatch() {
    this.timer_interval = clearInterval(this.timer_interval);
    this.background.stopAnimation();
  }

  restartStopwatch() {
    this.timer_interval = clearInterval(this.timer_interval);
    this.background.resetAnimation();
    this.timer_container.innerText = "00:00:00:00";
    this.time = [0, 0, 0, 0];
  }

  stopwatchTick() {
    this.time[3]++;

    if (this.time[3] >= 100) {
      this.time[3] %= 100;
      this.time[2]++;

      if (this.time[2] >= 60) {
        this.time[2] %= 60;
        this.time[1]++;

        if (this.time[1] >= 60) {
          this.time[0] %= 60;
          this.time[0]++;
        }
      }
    }

    this.timer_container.innerText = `${String(this.time[0]).padStart(2, "0")}:`;
    this.timer_container.innerText += `${String(this.time[1]).padStart(2, "0")}`;
    this.timer_container.innerText += `:${String(this.time[2]).padStart(2, "0")}`;
    this.timer_container.innerText += `:${String(this.time[3]).padStart(2, "0")}`;
  }
}

new StopwatchView();
