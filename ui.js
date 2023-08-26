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
    updateGameStatus("You've got a Blackjack!");
    revealDealerHoleCard = true;
    hitButton.disabled = true;
    standButton.disabled = true;
  } else if (result === false) {
    updateGameStatus('Dealer won with a Blackjack!');
    revealDealerHoleCard = true;
    hitButton.disabled = true;
    standButton.disabled = true;
  } else {
    updateGameStatus('Play on!');
  }

  updateHandDisplay(playerHand, dealerHand);
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
