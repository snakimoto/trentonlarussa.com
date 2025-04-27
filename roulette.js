// Setup
let balance = 1000;
let currentChip = 5;
let bets = {}; // { number: amount }
let spinning = false;
let previousRolls = [];

// Wheel numbers (European style)
const numbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27,
  13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1,
  20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const colors = {
  0: 'green', 32: 'red', 15: 'black', 19: 'red', 4: 'black', 21: 'red',
  2: 'black', 25: 'red', 17: 'black', 34: 'red', 6: 'black', 27: 'red',
  13: 'black', 36: 'red', 11: 'black', 30: 'red', 8: 'black', 23: 'red',
  10: 'black', 5: 'red', 24: 'black', 16: 'red', 33: 'black', 1: 'red',
  20: 'black', 14: 'red', 31: 'black', 9: 'red', 22: 'black', 18: 'red',
  29: 'black', 7: 'red', 28: 'black', 12: 'red', 35: 'black', 3: 'red', 26: 'black'
};

// Generate Betting Table
const bettingTable = document.getElementById('betting-table');

numbers.sort((a,b) => a-b).forEach(num => {
  const div = document.createElement('div');
  div.classList.add('bet-spot');
  div.classList.add(colors[num]);
  div.id = `spot-${num}`;
  div.innerHTML = `<div>${num}</div><div class="bet-amount" id="amount-${num}"></div>`;
  div.onclick = () => placeBet(num);
  bettingTable.appendChild(div);
});

function selectChip(amount) {
  currentChip = amount;
}

function placeBet(num) {
  if (spinning) return;
  if (balance >= currentChip) {
    balance -= currentChip;
    bets[num] = (bets[num] || 0) + currentChip;
    updateBetDisplay(num);
    updateBalance();
  }
}

function updateBetDisplay(num) {
  const amt = bets[num] || 0;
  document.getElementById(`amount-${num}`).innerText = amt ? `$${amt}` : '';
}

function updateBalance() {
  document.getElementById('balance').innerText = balance;
}

function reloadBalance() {
  if (spinning) return;
  balance = 1000;
  bets = {};
  updateBalance();
  document.querySelectorAll('.bet-amount').forEach(e => e.innerText = '');
  document.querySelectorAll('.bet-spot').forEach(e => e.classList.remove('orange'));
}

function spinWheel() {
  if (spinning || Object.keys(bets).length === 0) return;
  spinning = true;
  document.getElementById('result-box').innerText = 'Spinning...';

  const ball = document.getElementById('ball');
  let position = Math.floor(Math.random() * numbers.length);
  let ticks = 0;
  let totalTicks = 50 + Math.floor(Math.random() * 30); // 50-80 ticks
  let speed = 50; // Initial speed

  const moveBall = setInterval(() => {
    position = (position + 1) % numbers.length;
    const deg = (position / numbers.length) * 360;
    ball.style.transform = `rotate(${deg}deg)`;

    ticks++;

    if (ticks > totalTicks) {
      clearInterval(moveBall);
      landOn(numbers[position]);
    }

    if (ticks > totalTicks * 0.7) speed += 10;

  }, speed);
}

function landOn(landedNum) {
  const resultBox = document.getElementById('result-box');

  document.querySelectorAll('.bet-spot').forEach(e => e.classList.remove('orange'));
  document.getElementById(`spot-${landedNum}`).classList.add('orange');

  previousRolls.unshift({num: landedNum, color: colors[landedNum]});
  if (previousRolls.length > 10) previousRolls.pop();
  updatePreviousRolls();

  let winAmount = 0;
  if (bets[landedNum]) {
    winAmount += bets[landedNum] * 35;
  }

  balance += winAmount;
  updateBalance();

  if (winAmount > 0) {
    resultBox.innerText = `Ball landed on ${landedNum} (${colors[landedNum]}). You won $${winAmount}!`;
  } else {
    resultBox.innerText = `Ball landed on ${landedNum} (${colors[landedNum]}). You lost.`;
  }

  bets = {};
  document.querySelectorAll('.bet-amount').forEach(e => e.innerText = '');
  spinning = false;
}

function updatePreviousRolls() {
  const container = document.getElementById('previous-rolls-list');
  container.innerHTML = '';
  previousRolls.forEach(roll => {
    const div = document.createElement('div');
    div.classList.add('roll-circle');
    div.style.backgroundColor = roll.color;
    div.innerText = roll.num;
    container.appendChild(div);
  });
}
