// Setup
let balance = 1000;
let currentChip = 5;
let bets = {}; // Where bets are placed { spot: amount }
let spinning = false;

// Numbers, colors, and payouts
const numbers = [
  { num: 0, color: 'green' },
  { num: 1, color: 'red' },
  { num: 2, color: 'black' },
  { num: 3, color: 'red' },
  { num: 4, color: 'black' },
  { num: 5, color: 'red' },
  { num: 6, color: 'black' },
  { num: 7, color: 'red' },
  { num: 8, color: 'black' },
  { num: 9, color: 'red' },
  { num: 10, color: 'black' },
  { num: 11, color: 'black' },
  { num: 12, color: 'red' },
  { num: 13, color: 'black' },
  { num: 14, color: 'red' },
  { num: 15, color: 'black' },
  { num: 16, color: 'red' },
  { num: 17, color: 'black' },
  { num: 18, color: 'red' },
  { num: 19, color: 'red' },
  { num: 20, color: 'black' },
  { num: 21, color: 'red' },
  { num: 22, color: 'black' },
  { num: 23, color: 'red' },
  { num: 24, color: 'black' },
  { num: 25, color: 'red' },
  { num: 26, color: 'black' },
  { num: 27, color: 'red' },
  { num: 28, color: 'black' },
  { num: 29, color: 'black' },
  { num: 30, color: 'red' },
  { num: 31, color: 'black' },
  { num: 32, color: 'red' },
  { num: 33, color: 'black' },
  { num: 34, color: 'red' },
  { num: 35, color: 'black' },
  { num: 36, color: 'red' }
];

// Generate betting table
const table = document.getElementById('roulette-table');
for (let i = 0; i <= 36; i++) {
  const div = document.createElement('div');
  div.classList.add('bet-spot');
  div.classList.add(numbers[i].color);
  div.innerText = numbers[i].num;
  div.onclick = () => placeBet(numbers[i].num);
  table.appendChild(div);
}

// Add dozens and halves manually
const extraBets = [
  { label: '1st 12', range: [1, 12] },
  { label: '2nd 12', range: [13, 24] },
  { label: '3rd 12', range: [25, 36] },
  { label: '1-18', range: [1, 18] },
  { label: '19-36', range: [19, 36] },
  { label: 'Red', color: 'red' },
  { label: 'Black', color: 'black' }
];

extraBets.forEach(bet => {
  const div = document.createElement('div');
  div.classList.add('bet-spot');
  div.innerText = bet.label;
  div.onclick = () => placeBet(bet.label);
  table.appendChild(div);
});

function selectChip(amount) {
  currentChip = amount;
}

function placeBet(spot) {
  if (spinning) return;
  if (balance >= currentChip) {
    balance -= currentChip;
    bets[spot] = (bets[spot] || 0) + currentChip;
    updateBalance();
    document.querySelectorAll('.bet-spot').forEach(spotDiv => {
      if (spotDiv.innerText == spot || spotDiv.innerText == spot.label) {
        spotDiv.classList.add('selected');
      }
    });
  }
}

function updateBalance() {
  document.getElementById('balance').innerText = balance;
}

function spinWheel() {
  if (spinning || Object.keys(bets).length === 0) return;
  spinning = true;
  const wheel = document.getElementById('wheel');
  const ball = document.getElementById('ball');
  const resultDiv = document.getElementById('result');

  // Spin animation
  let wheelRotation = 3600 + Math.floor(Math.random() * 360);
  let ballRotation = -(3600 + Math.floor(Math.random() * 360));

  wheel.style.transition = 'transform 5s ease-out';
  ball.style.transition = 'transform 5s ease-out';

  wheel.style.transform = `rotate(${wheelRotation}deg)`;
  ball.style.transform = `rotate(${ballRotation}deg)`;

  setTimeout(() => {
    const result = numbers[Math.floor(Math.random() * numbers.length)];
    handleResult(result);
    wheel.style.transition = '';
    ball.style.transition = '';
    spinning = false;
    bets = {};
    document.querySelectorAll('.bet-spot').forEach(spotDiv => spotDiv.classList.remove('selected'));
  }, 5000);
}

function handleResult(result) {
  const resultDiv = document.getElementById('result');
  let winAmount = 0;

  for (const [spot, amount] of Object.entries(bets)) {
    if (spot == result.num) {
      winAmount += amount * 35;
    } else if (spot == '1st 12' && result.num >= 1 && result.num <= 12) {
      winAmount += amount * 3;
    } else if (spot == '2nd 12' && result.num >= 13 && result.num <= 24) {
      winAmount += amount * 3;
    } else if (spot == '3rd 12' && result.num >= 25 && result.num <= 36) {
      winAmount += amount * 3;
    } else if (spot == '1-18' && result.num >= 1 && result.num <= 18) {
      winAmount += amount * 2;
    } else if (spot == '19-36' && result.num >= 19 && result.num <= 36) {
      winAmount += amount * 2;
    } else if (spot == 'Red' && result.color == 'red') {
      winAmount += amount * 2;
    } else if (spot == 'Black' && result.color == 'black') {
      winAmount += amount * 2;
    }
  }

  balance += winAmount;
  updateBalance();

  if (winAmount > 0) {
    resultDiv.innerText = `Ball landed on ${result.num} (${result.color}). You won $${winAmount}!`;
  } else {
    resultDiv.innerText = `Ball landed on ${result.num} (${result.color}). You lost.`;
  }
}
