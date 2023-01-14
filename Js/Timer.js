"use strict";

class TimerViewBackground {
  constructor() {
    this.animation = 0;
    this.fps = 30;
    this.fps_interval = 1000 / this.fps;
    this.now = 0;
    this.then = performance.now();
    this.elapsed = 0;
    this.indicator_angle = 2 * Math.PI - Math.PI / 2;
    this.indicator_step = Math.PI / 180;

    this.canvas = document.querySelector(".timer-view .background");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    addEventListener("resize", this.resize.bind(this));

    this.resize();
    this.drawClock();
    this.drawIndicator();
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
    this.indicator_angle = 2 * Math.PI - Math.PI / 2;
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
    this.clock_radius = this.canvas_h / 2.25;
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

      this.ctx.clearRect(-this.canvas_w / 2, -this.canvas_h / 2, this.canvas_w, this.canvas_h);
      this.drawClock();
      this.drawIndicator();
      this.indicator_angle += this.indicator_step;
    }
  }

  drawIndicator() {
    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = "red";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.clock_radius, this.indicator_angle, 2 * Math.PI - Math.PI / 2);
    this.ctx.stroke();
  }

  drawClock() {
    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = "gray";
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.clock_radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
}

class TimerView {
  constructor() {
    this.background = new TimerViewBackground();
    this.container = document.querySelector(".timer-view");

    this.hours_input = this.container.querySelector("input.hours");
    this.minutes_input = this.container.querySelector("input.minutes");
    this.seconds_input = this.container.querySelector("input.seconds");

    this.timer_setting_container = this.container.querySelector(".timer-setting");
    this.timer_container = this.container.querySelector(".timer");
    this.time = [0, 0, 0]; // h, m, s
    this.timer_interval = null;
    this.stopped = true;

    this.buttons = this.container.querySelectorAll("button");
    this.buttons[0].addEventListener("click", this.startTimer.bind(this));
    this.buttons[1].addEventListener("click", this.stopTimer.bind(this));
    this.buttons[2].addEventListener("click", this.restartTimer.bind(this));
  }

  startTimer() {
    if (this.timer_interval != null) return;

    if (this.stopped) {
      this.time = [this.hours_input.value, this.minutes_input.value, this.seconds_input.value];
      this.timer_container.style.display = null;
      this.timer_setting_container.style.display = "none";
    }

    this.timer_interval = setInterval(this.timerTick.bind(this), 1000);
    this.background.startAnimation();
    const r = 2 * Math.PI;
    const seconds = (+this.seconds_input.value) + (+this.minutes_input.value * 60) + (+this.hours_input.value * 3600);
    this.background.indicator_step = r / this.background.fps / seconds;
    this.stopped = false;

    this.timer_container.innerText = `${String(this.time[0]).padStart(2, "0")}:`;
    this.timer_container.innerText += `${String(this.time[1]).padStart(2, "0")}:`;
    this.timer_container.innerText += `${String(this.time[2]).padStart(2, "0")}`;
  }

  stopTimer() {
    this.timer_interval = clearInterval(this.timer_interval);
    this.background.stopAnimation();
  }

  restartTimer() {
    this.timer_interval = clearInterval(this.timer_interval);
    this.background.resetAnimation();

    this.stopped = true;
    this.timer_container.innerText = "00:00:00";
    this.time = [0, 0, 0];
    this.hours_input.value = "00";
    this.minutes_input.value = "00";
    this.seconds_input.value = "00";

    this.timer_container.style.display = "none";
    this.timer_setting_container.style.display = null;
  }

  timerTick() {
    this.time[2]--;

    if (this.time[2] <= 0) {
      if (this.time[1] <= 0) {
        if (this.time[0] <= 0) this.time[2] = 0;
        else {
          this.time[0]--;
          this.time[1] = 59;
          this.time[2] = 59;
        }
      } else {
        this.time[1]--;
        this.time[2] = 59;
      }
    }

    this.timer_container.innerText = `${String(this.time[0]).padStart(2, "0")}:`;
    this.timer_container.innerText += `${String(this.time[1]).padStart(2, "0")}:`;
    this.timer_container.innerText += `${String(this.time[2]).padStart(2, "0")}`;

    if (this.time[0] <= 0 && this.time[1] <= 0 && this.time[2] <= 0) {
      new Audio("./Alarms/alarm2.mp3").play();
      this.restartTimer();
      return;
    }
  }
}

new TimerView();
