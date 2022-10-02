const day = document.querySelector("day");
const barContainer = document.getElementsByClassName("expenses__daily")[0];
const totalValueWeek = document.getElementsByClassName("total-value")[0];
const deltaValue = document.getElementsByClassName("increase-value")[0];
const maxExpensePerDay = 80;
const setHeightBar = 60;
let heightBarValue;
let totalPerWeek = 0;
let DATA = [];
let totalExpenseLastWeek = 230;
let spentLastWeekInput = document.getElementById("spent_lastweek");
let delta;
let dayDate = new Date().getUTCDay();
let options = { weekday: "short" };
let currentDay = new Intl.DateTimeFormat("en-US", options)
  .format(dayDate)
  .toLowerCase();

// console.log(trial);

function displayChart() {
  barContainer.innerHTML = DATA.map((expense) => {
    if (expense.day == currentDay)
      return `
        <div class="vertical-wrapper">
            <div class="bar">
                <div class="progress blue">
                <div class="daily-expense">$${expense.amount}</div>
                </div>
            </div>
            <p class="day">${expense.day}</p>
         </div>
         `;
    else
      return `
        <div class="vertical-wrapper">
            <div class="bar">
                <div class="progress">
                <div class="daily-expense">$${expense.amount}</div>
                </div>
            </div>
            <p class="day">${expense.day}</p>
         </div>
         `;
  }).join("");
}

function setValue() {
  let heightBarValue = document.querySelectorAll(".progress");

  for (i = 0; i < DATA.length; i++) {
    heightBarValue[i].style.height = `${
      (DATA[i].amount * 100) / setHeightBar
    }%`;
  }
}

function setTotalWeek() {
  for (i = 0; i < DATA.length; i++) {
    totalPerWeek += DATA[i].amount;
  }
  return (totalValueWeek.textContent = "$" + totalPerWeek);
}

function setDeltaValue() {
  let delta = Math.ceil((totalPerWeek * 100) / totalExpenseLastWeek - 100);
  if (totalPerWeek <= 0 || totalExpenseLastWeek <= 0)
    return (deltaValue.textContent = "0%");
  else return (deltaValue.textContent = delta + "%");
}

// get data from json files
async function getData(json) {
  await fetch(json)
    .then((res) => res.json())
    .then((data) => {
      DATA = data;
    })
    .then(() => displayChart())
    .then(() => setValue())
    .then(() => setTotalWeek())
    .then(() => setDeltaValue());
}

window.addEventListener("load", getData("data.json"));

spentLastWeekInput.addEventListener("input", (e) => {
  totalExpenseLastWeek = e.target.value;
  setDeltaValue();
});
