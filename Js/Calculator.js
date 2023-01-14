"use strict";

class DatesCalculator {
  constructor(parent) {
    this.container = parent.querySelector(".dates-diff.calculator");

    this.inputs = this.container.querySelectorAll("input");

    const start_date = new Date(1950, 0, 1);
    const start_date_values = [
      String(start_date.getFullYear()).padStart(2, "0"),
      String(start_date.getMonth() + 1).padStart(2, "0"),
      String(start_date.getDate()).padStart(2, "0"),
    ];
    this.inputs[0].value = start_date_values.join("-");

    const end_date = new Date(Date.now());
    const end_date_values = [
      String(end_date.getFullYear()).padStart(2, "0"), 
      String(end_date.getMonth() + 1).padStart(2, "0"), 
      String(end_date.getDate()).padStart(2, "0")
    ];
    this.inputs[1].value = end_date_values.join("-");

    this.result_container = this.container.querySelector(".result");

    this.calculate = this.container.querySelector("button.calculate");
    this.calculate.addEventListener("click", () => {
      const date1 = new Date(this.inputs[0].value);
      const date2 = new Date(this.inputs[1].value);

      const years = new Date(Math.abs(date1 - date2)).getFullYear() - 1970;
      const months = years * 12 + 11 - (date1.getMonth() + date2.getMonth());
      const days = Math.round(Math.abs((date1 - date2) / (24 * 60 * 60 * 1000)));
      const hours = Math.round(Math.abs((date1 - date2) / (60 * 60 * 1000)));
      const minutes = Math.round(Math.abs((date1 - date2) / (60 * 1000)));
      const seconds = Math.round(Math.abs((date1 - date2) / 1000));

      this.result_container.innerHTML = `The difference between dates is:<br>`;
      this.result_container.innerHTML += `
      ${years} years, 
      ${(months + 1 - years * 12) % 12} months, 
      ${days - years * 365 - (years - (years % 4)) / 4} days<br>
      `;

      this.result_container.innerHTML += `<br>It is:<br>`;
      this.result_container.innerHTML += `${months} months<br>`;
      this.result_container.innerHTML += `${days} days<br>`;
      this.result_container.innerHTML += `${hours} hours<br>`;
      this.result_container.innerHTML += `${minutes} minutes<br>`;
      this.result_container.innerHTML += `${seconds} seconds`;
    });
  }

  show() {
    this.result_container.innerHTML = "";
    this.container.classList.remove("hidden");
  }

  hide() {
    this.container.classList.add("hidden");
  }
}

class TimeCalculator {
  constructor(parent) {
    this.container = parent.querySelector(".time-diff.calculator");

    this.inputs = this.container.querySelectorAll("input");
    this.inputs[0].value = "00:00:01";
    this.inputs[1].value = new Date(Date.now()).toLocaleTimeString();

    this.result_container = this.container.querySelector(".result");

    this.calculate = this.container.querySelector("button.calculate");
    this.calculate.addEventListener("click", () => {
      const date1 = new Date("01/01/2023 " + this.inputs[0].value);
      const date2 = new Date("01/01/2023 " + this.inputs[1].value);
      let diff = date2.getTime() - date1.getTime();

      const hours = Math.floor(diff / 1000 / 60 / 60);
      diff -= hours * 1000 * 60 * 60;
      const minutes = Math.floor(diff / 1000 / 60);
      diff -= minutes * 1000 * 60;
      const seconds = Math.floor(diff / 1000);
      diff -= seconds * 1000;

      this.result_container.innerHTML = `The difference between dates is:<br>`;
      this.result_container.innerHTML += `
      ${String(hours).padStart(2, "0")} hours, 
      ${String(minutes).padStart(2, "0")} minutes, 
      ${String(seconds).padStart(2, "0")} seconds<br>
      `;

      this.result_container.innerHTML += `<br>It is:<br>`;
      this.result_container.innerHTML += `${minutes + hours * 60} minutes<br>`;
      this.result_container.innerHTML += `${seconds + (minutes + hours * 60) * 60} seconds`;
    });
  }

  show() {
    this.result_container.innerHTML = "";
    this.container.classList.remove("hidden");
  }

  hide() {
    this.container.classList.add("hidden");
  }
}

class BirthdayCalculator {
  constructor(parent) {
    this.container = parent.querySelector(".birthday.calculator");

    this.birthday_input = this.container.querySelector("input");

    const start_date = new Date(1950, 0, 1);
    const start_date_values = [
      String(start_date.getFullYear()).padStart(2, "0"),
      String(start_date.getMonth() + 1).padStart(2, "0"),
      String(start_date.getDate()).padStart(2, "0"),
    ];
    this.birthday_input.value = start_date_values.join("-");

    this.result_container = this.container.querySelector(".result");

    this.calculate = this.container.querySelector("button.calculate");
    this.calculate.addEventListener("click", () => {
      const birthday = new Date(this.birthday_input.value);
      const now = new Date(Date.now());

      const years = new Date(Math.abs(birthday - now)).getFullYear() - 1970;
      const birthday_values = [
        String(now.getFullYear()).padStart(2, "0"), 
        String(birthday.getMonth() + 1).padStart(2, "0"), 
        String(birthday.getDate()).padStart(2, "0")
      ];
      const days_unitl_birthday = Math.round(Math.abs((new Date(birthday_values.join("-")) - now) / (24 * 60 * 60 * 1000)));
       
      const star_zodiac = [
        "Aries (Ram)",
        "Taurus (Bull)",
        "Gemini (Twins)",
        "Cancer (Crab)",
        "Leo (Lion)",
        "Virgo (Virgin)",
        "Libra (Balance)",
        "Scorpius (Scorpion)",
        "Sagittarius (Archer)",
        "Capricornus (Goat)",
        "Aquarius (Water Bearer)",
        "Pisces (Fish)",
      ];
      const star_zodiac_id = +new Intl.DateTimeFormat('fr-TN-u-ca-persian', {month: 'numeric'}).format(birthday);
      
      const chinese_zodiac = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
      const chinese_zodiac_id = (birthday.getFullYear() - 4) % 12;

      this.result_container.innerHTML = `Your are ${years} years old<br>`;
      this.result_container.innerHTML += `${days_unitl_birthday + 1} days until next birthday<br>`;
      this.result_container.innerHTML += `<br>Your star zodiac is ${star_zodiac[star_zodiac_id  - 1]}<br>`;
      this.result_container.innerHTML += `Your chinese zodiac is ${chinese_zodiac[chinese_zodiac_id]}`;
    });
  }

  show() {
    this.result_container.innerHTML = "";
    this.container.classList.remove("hidden");
  }

  hide() {
    this.container.classList.add("hidden");
  }
}

class CalculatorView {
  constructor() {
    this.container = document.querySelector(".calculator-view");

    this.calculate_buttons = this.container.querySelectorAll(".calculate");
    this.dates_caculator = new DatesCalculator(this.container);
    this.time_caculator = new TimeCalculator(this.container);
    this.birthday_caculator = new BirthdayCalculator(this.container);

    this.buttons = this.container.querySelectorAll("button:not(.calculate)");
    this.buttons[0].addEventListener("click", this.openCalculator.bind(this));
    this.buttons[1].addEventListener("click", this.openCalculator.bind(this));
    this.buttons[2].addEventListener("click", this.openCalculator.bind(this));
  }

  openCalculator(e) {
    this.dates_caculator.hide();
    this.time_caculator.hide();
    this.birthday_caculator.hide();

    switch (e.target.classList[0]) {
      case "dates-diff": this.dates_caculator.show(); break;
      case "time-diff": this.time_caculator.show(); break;
      case "birthday": this.birthday_caculator.show(); break;
    }
  }
}

new CalculatorView();
