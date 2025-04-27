// Setup
let balance = 1000;
let currentChip = 5;
let bets = {}; // { number: amount }
let spinning = false;
let previousRolls = [];

// Numbers and Colors
const numbers = [
  { num: 0, color: 'green' },
  { num: 32, color: 'red' }, { num: 15, color: 'black' },
  { num: 19, color: 'red' }, { num: 4, color: 'black' },
  { num: 21, color: 'red' }, { num: 2, color: 'black' },
  { num: 25, color: 'red' }, { num: 17, color: 'black' },
  { num: 34, color: 'red' }, { num: 6, color: 'black' },
  { num: 27, color: 'red' }, { num: 13, color: 'black' },
  { num: 36, color: 'red' }, { num: 11, color: 'black' },
  { num: 30, color: 'red' }, { num: 8, color: 'black' },
  { num: 23, color: 'red' }, { num: 10, color: 'black' },
  { num: 5, color: 'red' }, { num: 24, color: 'black' },
  { num: 16, color: 'red' }, { num: 33, color: 'black' },
  { num: 1, color: 'red' }, { num: 20, color: 'black' },
  { num: 14, color: 'red' }, { num: 31, color: 'black' },
  { num: 9, color: 'red' }, { num: 22, color: 'black' },
  { num: 18, color: 'red' }, { num: 29, color: 'black' },
  { num: 7, color: 'red' }, { num: 28, color: 'black' },
  { num: 12, color: 'red' }, { num: 35, color: 'black' },
  { num: 3, color: 'red' }, { num: 26, color: 'black' }
];

const bettingTable = document.getElementById('betting-table');

numbers.forEach((item) => {
  const div = document.createElement('div');
  div.classList.add('bet-spot');
  div.classList.add(item.color);
  div.id = `spot-${item.num}`;
  div.innerHTML = `<div>${item.num}</div><div class="bet-amount" id="amount-${item.num}"></div>`;
  div.onclick = () => placeBet(item.num);
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

function landOn(landed) {
  const resultBox = document.getElementById('result-box');

  // Highlight landed number orange
  document.querySelectorAll('.bet-spot').forEach(e => e.classList.remove('orange'));
  document.getElementById(`spot-${landed.num}`).classList.add('orange');

  // Update previous rolls
  previousRolls.unshift(landed);
  if (previousRolls.length > 10) previousRolls.pop();
  updatePreviousRolls();

  // Calculate winnings
  let winAmount = 0;
  if (bets[landed.num]) {
    winAmount += bets[landed.num] * 35;
  }

  balance += winAmount;
  updateBalance();

  if (winAmount > 0) {
    resultBox.innerText = `Ball landed on ${landed.num} (${landed.color}). You won $${winAmount}!`;
  } else {
    resultBox.innerText = `Ball landed on ${landed.num} (${landed.color}). You lost.`;
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
