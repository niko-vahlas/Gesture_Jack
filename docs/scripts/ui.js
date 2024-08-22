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
const balanceElement = document.getElementById('balance');
const chips = document.getElementById('chips');
const closeLoginPopupBtn = document.querySelector('#loginPopup .close-btn');
const closeSignupPopupBtn = document.querySelector('#signupPopup .close-btn');
const betField = document.getElementById('overlay-bet');
const chipsList = Array.from(chips.children);
updateChips();
let revealDealerHoleCard = false;
hitButton.disabled = true;
standButton.disabled = true;

//User hit
hitButton.addEventListener('click', function () {
  const canUserHit = playerHit();

  if (!canUserHit) {
    hitButton.disabled = true;
    standButton.disabled = true;
    newGameButton.disabled = false;
    updateGameStatus("You've busted! Game over.");
    revealDealerHoleCard = true;
    setBet(0);
  }
  updateHandDisplay(playerHand, dealerHand);
});

standButton.addEventListener('click', function () {
  dealerTurn();
  const dealerWon = determineWinner();

  if (dealerWon) {
    updateGameStatus('Dealer won!');
    newGameButton.disabled = false;
    setBet(0);
  } else {
    updateGameStatus('You won!');
    newGameButton.disabled = false;
    let bet = getBet();
    bet = bet * 2;
    let initialBalance = getBalance();
    let newBalance = initialBalance + bet;
    setBalance(newBalance);

    //Increase balance by double bet amount
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
    let bet = getBet();
    bet = bet * 2;
    let initialBalance = getBalance();
    let newBalance = initialBalance + bet;
    setBalance(newBalance);
    setBet(0);
  } else if (result === false) {
    updateGameStatus('Dealer got Blackjack!');
    revealDealerHoleCard = true;
    hitButton.disabled = true;
    standButton.disabled = true;
    setBet(0);
  } else {
    updateGameStatus('Play on!');
    newGameButton.disabled = true;
  }
  updateChips();

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

function updateGameStatus(status) {
  gameStatusDiv.innerText = status;
}

function showPopup(popupId) {
  document.getElementById(popupId).style.display = 'block';
}

function closePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

closeLoginPopupBtn.addEventListener('click', () => {
  closePopup('loginPopup');
});

closeSignupPopupBtn.addEventListener('click', () => {
  closePopup('signupPopup');
});

//Updates possible chip values for users balance
function updateChips() {
  const chipsList = Array.from(chips.children);
  chipsList.forEach((li) => {
    const id = li.id;
    const numericPart = parseInt(id.match(/\d+/)[0], 10);
    const balanceValue = getBalance();

    if (balanceValue / numericPart >= 1) {
      li.style.visibility = 'visible';
    } else {
      li.style.visibility = 'hidden';
    }
  });
}

chipsList.forEach((li) => {
  li.addEventListener('click', () => {
    if (newGameButton.disabled === false) {
      // if newgame is enabled add the bet
      const chipVal = parseInt(li.id.match(/\d+/)[0], 10);
      const initialNumber = getBet();
      setBet(initialNumber + chipVal);

      let balance = getBalance();
      let newVal = balance - chipVal;
      setBalance(newVal);
      updateChips();
    }
  });
});

function getBalance() {
  return parseInt(balanceElement.textContent, 10);
}

function setBalance(balance) {
  balanceElement.textContent = `${balance}`;
  let username = sessionStorage.getItem('username');
  if (username) {
    console.log('in set balance loop');
    updateBalanceOnServer(username, balance);
  }
}

function getBet() {
  let textContent = betField.textContent;
  let bet = parseInt(textContent.match(/\d+/)[0], 10);
  return bet;
}

function setBet(number) {
  betField.textContent = `Bet: $${number}`;
}

//Login and Signup functionality
async function signup(username, password, balance) {
  try {
    const response = await fetch(
      'http://159.203.2.197:3000/api/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, balance }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      sessionStorage.setItem('username', username);
    }
    return data;
  } catch (error) {
    console.error('Signup error:', error);
  }
}

async function login(username, password) {
  try {
    const response = await fetch(
      'http://159.203.2.197:3000/api/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      setBalance(data.balance);
      sessionStorage.setItem('username', username);
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
  const balance = balanceElement.innerText;

  const response = await signup(username, password, balance);

  if (response.message) {
    updateGameStatus(response.message);
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
});

async function updateBalanceOnServer(username, newBalance) {
  try {
    const response = await fetch(
      'https://gesturejack-b5cc110cd682.herokuapp.com/api/update-balance',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newBalance }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update balance on server.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating balance:', error);
  }
}
