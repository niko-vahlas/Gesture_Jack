// ui.js

import {
  playerHit,
  startNewGame,
  dealerTurn,
  determineWinner,
  playerHand,
  dealerHand,
} from './gameLogic.js';

const playerHandDiv = document.getElementById('playerHand');
const dealerHandDiv = document.getElementById('dealerHand');
const hitButton = document.getElementById('hitButton');
const standButton = document.getElementById('standButton');
const newGameButton = document.getElementById('newGameButton');
const gameStatusDiv = document.getElementById('gameStatus');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
let revealDealerHoleCard = false;

hitButton.disabled = true;
standButton.disabled = true;

//User hit
hitButton.addEventListener('click', function () {
  const canUserHit = playerHit();

  if (!canUserHit) {
    hitButton.disabled = true;
    standButton.disabled = true;
    updateGameStatus("You've busted! Game over.");
    revealDealerHoleCard = true;
  }
  updateHandDisplay(playerHand, dealerHand);
});

standButton.addEventListener('click', function () {
  dealerTurn();
  const dealerWon = determineWinner();

  if (dealerWon) {
    updateGameStatus('Dealer won!');
  } else {
    updateGameStatus('You won!');
  }
  revealDealerHoleCard = true;
  updateHandDisplay(playerHand, dealerHand);
  hitButton.disabled = true;
  standButton.disabled = true;
});

newGameButton.addEventListener('click', function () {
  hitButton.disabled = false;
  standButton.disabled = false;
  revealDealerHoleCard = false;
  const result = startNewGame();

  if (result === true) {
    updateGameStatus('You got Blackjack!');
    revealDealerHoleCard = true;
    hitButton.disabled = true;
    standButton.disabled = true;
  } else if (result === false) {
    updateGameStatus('Dealer got Blackjack!');
    revealDealerHoleCard = true;
    hitButton.disabled = true;
    standButton.disabled = true;
  } else {
    updateGameStatus('Play on!');
  }

  updateHandDisplay(playerHand, dealerHand);
});

loginBtn.addEventListener('click', () => {
  showPopup('loginPopup');
});

signupBtn.addEventListener('click', () => {
  showPopup('signupPopup');
});

function updateHandDisplay(
  playerHand,
  dealerHand,
  revealDealerHoleCard = false
) {
  playerHandDiv.innerHTML = handToHTML(playerHand);
  dealerHandDiv.innerHTML = handToHTML(dealerHand, revealDealerHoleCard);
}

function handToHTML(hand) {
  if (!revealDealerHoleCard && hand === dealerHand && hand.length > 1) {
    return `
        <img src="assets/cards/${hand[0].suit.charAt(0)}${
      hand[0].value
    }.gif" alt="${hand[0].name} of ${hand[0].suit}" class="card">
        <img src="assets/cards/back.gif" alt="Card back" class="card">
      `;
  }

  return hand
    .map(
      (card) =>
        `<img src="assets/cards/${card.suit.charAt(0)}${card.value}.gif" alt="${
          card.name
        } of ${card.suit}" class="card">`
    )
    .join('');
}

function updateBalance(balance) {
  const balanceElement = document.getElementById('balance');
  balanceElement.textContent = `${balance}`;
}

function updateGameStatus(status) {
  gameStatusDiv.innerText = status;
}

function showPopup(popupId) {
  document.getElementById(popupId).style.display = 'block';
}

function closePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

const closeLoginPopupBtn = document.querySelector('#loginPopup .close-btn');
const closeSignupPopupBtn = document.querySelector('#signupPopup .close-btn');

closeLoginPopupBtn.addEventListener('click', () => {
  closePopup('loginPopup');
});

closeSignupPopupBtn.addEventListener('click', () => {
  closePopup('signupPopup');
});

//Signup
async function signup(username, password) {
  try {
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Signup error:', error);
  }
}

async function login(username, password) {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      updateBalance(data.balance);
    }
    return data;
  } catch (error) {
    console.error('Login error:', error);
  }
}

const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  const response = await signup(username, password);

  if (response.message) {
    updateGameStatus(response.message); // You can have a separate div for auth messages if you prefer
  }
});

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const response = await login(username, password);

  if (response.message) {
    updateGameStatus(response.message);
  }

  if (response.token) {
    // If you are using JWT or similar, save it to use later.
    localStorage.setItem('token', response.token);
  }
});
