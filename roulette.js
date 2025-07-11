let balance = 1000;
let currentChip = 5;
let bets = {};
let spinning = false;
let sectors = [];
const numbers = Array.from({length: 37}, (_, i) => i);

function generateWheel() {
  const wheel = document.getElementById('wheel');
  const radius = wheel.offsetWidth / 2 - 40; // Adjust radius smaller so numbers fit better

  numbers.forEach((num, i) => {
    const sector = document.createElement('div');
    sector.className = 'wheel-sector';

    const angle = (i * (360 / 37)) * Math.PI / 180;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    // 50% centers it, +150px moves it 3 inches right, +30px moves it 1 inch down
    sector.style.position = 'absolute';
    sector.style.left = `calc(50% + ${x + 150}px - 15px)`;
    sector.style.top = `calc(50% + ${y + 30}px - 15px)`;
    sector.innerText = num;
    sector.id = `sector-${num}`;

    if (num === 0) {
      sector.style.backgroundColor = 'green';
    } else if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(num)) {
      sector.style.backgroundColor = 'red';
    } else {
      sector.style.backgroundColor = 'black';
    }

    wheel.appendChild(sector);
    sectors.push(sector);
  });
}
function generateBettingTable() {
  const numberBets = document.getElementById('number-bets');
  numbers.forEach(num => {
    const div = document.createElement('div');
    div.className = 'number-bet';
    div.innerText = num;
    div.onclick = () => placeBet(num);
    numberBets.appendChild(div);
  });
}

function selectChip(amount) {
  currentChip = amount;
}

function placeBet(bet) {
  if (spinning) return;
  if (!bets[bet]) bets[bet] = 0;
  bets[bet] += currentChip;
  balance -= currentChip;
  updateBalance();
  updateLiveBets();
}

function placeSpecialBet(type) {
  placeBet(type);
}

function updateLiveBets() {
  const list = document.getElementById('live-bets-list');
  list.innerHTML = '';
  for (let bet in bets) {
    const div = document.createElement('div');
    div.innerText = `${bet}: $${bets[bet]}`;
    list.appendChild(div);
  }
}

function updateBalance() {
  document.getElementById('balance').innerText = balance;
}

function reloadBalance() {
  if (spinning) return;
  balance = 1000;
  bets = {};
  updateBalance();
  updateLiveBets();
}

function spinWheel() {
  if (spinning || Object.keys(bets).length === 0) return;
  spinning = true;
  document.getElementById('result-box').innerText = 'Spinning...';

  document.getElementById('spin-sound').play();

  let position = 0;
  let totalTicks = 70 + Math.floor(Math.random() * 20);
  let ticksLeft = totalTicks;
  let speed = 30;

  const spin = setInterval(() => {
    sectors.forEach(sec => sec.classList.remove('highlight-yellow', 'highlight-orange'));
    sectors[position].classList.add('highlight-yellow');

    position = (position + 1) % sectors.length;
    ticksLeft--;

    if (ticksLeft <= 0) {
      clearInterval(spin);
      const landedNumber = numbers[(position + sectors.length - 1) % sectors.length];
      sectors[(position + sectors.length - 1) % sectors.length].classList.remove('highlight-yellow');
      sectors[(position + sectors.length - 1) % sectors.length].classList.add('highlight-orange');

      document.getElementById('ding-sound').play();

      finishSpin(landedNumber);
    }

    if (ticksLeft < totalTicks * 0.5) speed += 1;
  }, speed);
}

function finishSpin(landedNumber) {
  let winAmount = 0;

  const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
  const blackNumbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];

  if (bets[landedNumber]) winAmount += bets[landedNumber] * 35;
  if (bets['red'] && redNumbers.includes(landedNumber)) winAmount += bets['red'] * 2;
  if (bets['black'] && blackNumbers.includes(landedNumber)) winAmount += bets['black'] * 2;
  if (bets['green'] && landedNumber === 0) winAmount += bets['green'] * 36;
  if (bets['1st12'] && landedNumber >=1 && landedNumber <=12) winAmount += bets['1st12'] * 3;
  if (bets['2nd12'] && landedNumber >=13 && landedNumber <=24) winAmount += bets['2nd12'] * 3;
  if (bets['3rd12'] && landedNumber >=25 && landedNumber <=36) winAmount += bets['3rd12'] * 3;
  if (bets['low'] && landedNumber >=1 && landedNumber <=18) winAmount += bets['low'] * 2;
  if (bets['high'] && landedNumber >=19 && landedNumber <=36) winAmount += bets['high'] * 2;

  balance += winAmount;
  updateBalance();

  if (winAmount > 0) {
    document.body.classList.add('win-flash');
    setTimeout(() => document.body.classList.remove('win-flash'), 500);
    document.getElementById('result-box').innerText = `Ball landed on ${landedNumber}. You won $${winAmount}!`;
  } else {
    document.getElementById('result-box').innerText = `Ball landed on ${landedNumber}. No win this time.`;
  }

  bets = {};
  updateLiveBets();
  spinning = false;
}

window.onload = function() {
  generateWheel();
  generateBettingTable();
};
