"use strict";

/* ----------------------------- ----------------------------- */

function randomInt(min, max) { 
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createNewDOM(tag = "div", class_name = "", text = "") {
  const new_element = document.createElement(tag);
  new_element.className = class_name;
  new_element.innerText = text;

  return new_element;
}

const visible_views = document.querySelectorAll(".views > div");
const views_buttons = document.querySelectorAll(".modes button");

for (let i = 0; i < views_buttons.length; i++) {
  views_buttons[i].addEventListener("click", () => {
    visible_views.forEach((view) => view.classList.add("hidden"));
    visible_views[i].classList.remove("hidden");
    document.querySelector(".views-container").scrollIntoView();
  });
}
