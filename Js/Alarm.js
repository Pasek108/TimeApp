"use strict";

class AddAlarmView {
  constructor() {
    this.container = document.querySelector(".add-alarm-view");

    this.name = this.container.querySelector(".name");
    this.time = this.container.querySelector(".time");
    this.days = this.container.querySelectorAll("input[type=checkbox]");

    this.add_button = this.container.querySelector(".add");
    this.add_button.addEventListener("click", () => {
      this.hide();
      this.getValues();
      this.resetValues();
    });

    this.delete_button = this.container.querySelector(".delete");
    this.delete_button.addEventListener("click", () => {
      this.hide();
      this.parent_alarm.createAlarm();
      this.resetValues();
    });

    this.cancel_button = this.container.querySelector(".cancel");
    this.cancel_button.addEventListener("click", () => {
      this.hide();
      this.resetValues();
    });
  }

  show(type, parent_alarm, data) {
    this.parent_alarm = parent_alarm;
    this.container.classList.remove("hidden");

    if (type === "edit") {
      this.container.classList.remove("add");
      this.container.classList.add("edit");
      this.setValues(data);
    } else {
      this.container.classList.remove("edit");
      this.container.classList.add("add");
    }
  }

  hide() {
    this.container.classList.add("hidden");
  }

  resetValues() {
    this.name.value = "";
    this.time.value = "";
    this.days.forEach((day) => (day.checked = false));
  }

  getValues() {
    const values = {
      name: this.name.value.trim(),
      time: this.time.value,
      days: [],
    };

    if (values.name == "") values.name = "Alarm";
    if (values.time == "") values.time = "00:00";
    this.days.forEach((day) => values.days.push(day.checked));

    this.parent_alarm.createAlarm(values);
  }

  setValues(data) {
    this.name.value = data.name;
    this.time.value = data.time;
    this.days.forEach((day, id) => (day.checked = data.days[id]));
  }
}

class Alarm {
  constructor(container, data) {
    this.container = container;
    this.is_active = false;
    this.interval = null;

    this.container.addEventListener("click", (e) => {
      if (!e.target.classList.contains("add")) return;
      add_alarm_view.show("add", this);
    });

    this.createAlarm(data);
  }

  createAlarm(data) {
    this.container.innerHTML = "";
    if (data == null) {
      this.container.classList.add("add");
      return;
    }

    this.is_active = true;
    this.interval = setInterval(() => {
      const now = new Date(Date.now());
      const day_id = (now.getDay() + 6) % 7;
      const hour = now.getHours();
      const minutes = now.getMinutes();
      console.log(this.is_active, data.days[day_id], `${hour}:${minutes}`, data.time);

      if (this.is_active && `${hour}:${minutes}` == data.time) {
        if (data.days[day_id]) new Audio("./alarm.mp3").play();
        else if (!data.days.includes(true)) {
          new Audio("./alarm.mp3").play();

          setTimeout(() => {
            this.is_active = false;
            this.container.classList.add("unactive");
          }, 1000);
        }

        this.interval = clearInterval(this.interval);
      }
    }, 1000);

    const days_names = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."];
    let days_string = "";
    if (!data.days.includes(true)) days_string = "One time";
    for (let i = 0; i < 7; i++) if (data.days[i]) days_string += days_names[i] + " ";

    const col1 = createNewDOM("div", "col");
    const row = createNewDOM("div", "row");
    const name = createNewDOM("div", "name", data.name);
    const time = createNewDOM("div", "time", data.time);
    row.appendChild(name);
    row.appendChild(time);
    col1.appendChild(row);

    const days = createNewDOM("div", "days", days_string);
    col1.appendChild(days);
    this.container.appendChild(col1);

    const col2 = createNewDOM("div", "col");
    const switch_button = createNewDOM("div", "switch");
    const edit_button = createNewDOM("button", "edit", "Edit");
    col2.appendChild(switch_button);
    col2.appendChild(edit_button);
    this.container.appendChild(col2);

    edit_button.addEventListener("click", () => add_alarm_view.show("edit", this, data));
    switch_button.addEventListener("click", () => {
      this.is_active = !this.is_active;
      this.container.classList.toggle("unactive");
    });

    this.container.classList.remove("add");
  }
}

class AlarmView {
  constructor() {
    this.container = document.querySelector(".alarm-view");

    if (localStorage.getItem("alarms") == null) localStorage.setItem("alarms", "[]");
    this.alarms_data = JSON.parse(localStorage.getItem("alarms"));

    this.alarms_containers = this.container.querySelectorAll(".alarm");
    this.alarms = [];

    for (let i = 0; i < 8; i++) {
      if (this.alarms_data[i] == null) this.alarms.push(new Alarm(this.alarms_containers[i]));
      else this.alarms.push(new Alarm(this.alarms_containers[i], this.alarms_data[i]));
    }
  }
}

const add_alarm_view = new AddAlarmView();
new AlarmView();
