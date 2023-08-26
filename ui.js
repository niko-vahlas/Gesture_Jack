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

hitButton.disabled = true;
standButton.disabled = true;

//User hit
hitButton.addEventListener('click', function () {
  const canUserHit = playerHit();
  updateHandDisplay(playerHand, dealerHand);

  if (!canUserHit) {
    // Handle the scenario where the user can't hit anymore (e.g., busted or other game logic)
    hitButton.disabled = true;
    standButton.disabled = true;
    updateGameStatus("You've busted! Game over.");
  }
});

standButton.addEventListener('click', function () {
  dealerTurn();
  const dealerWon = determineWinner();

  if (dealerWon) {
    updateGameStatus('Dealer won!');
    updateHandDisplay(playerHand, dealerHand);
  } else {
    updateGameStatus('You won!');
  }

  // You might want to disable hit and stand buttons here since the game is over
  hitButton.disabled = true;
  standButton.disabled = true;
});

newGameButton.addEventListener('click', function () {
  hitButton.disabled = false;
  standButton.disabled = false;
  const result = startNewGame();

  if (result === true) {
    updateGameStatus("You've got a Blackjack!");
    hitButton.disabled = true;
    standButton.disabled = true;
  } else if (result === false) {
    updateGameStatus('Dealer won with a Blackjack!');
    hitButton.disabled = true;
    standButton.disabled = true;
  } else {
    updateGameStatus('Play on!');
  }

  updateHandDisplay(playerHand, dealerHand);
});

function updateHandDisplay(playerHand, dealerHand) {
  playerHandDiv.innerHTML = handToHTML(playerHand);
  dealerHandDiv.innerHTML = handToHTML(dealerHand);
}

function handToHTML(hand) {
  return hand
    .map((card) => `<div class="card ${card.suit}">${card.name}</div>`)
    .join('');
}

function updateGameStatus(status) {
  gameStatusDiv.innerText = status;
}

// ---------- COMPUTER VISION CODE --------------
