const CARD_VALUES = {
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  JACK: 10,
  QUEEN: 10,
  KING: 10,
  ACE: 11, //Treat ace as always 11
};

const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];

const THRESHOLD = 21;

let deck = [];
let playerHand = [];
let dealerHand = [];

// Shuffle deck
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap elements at i and randomIndex
    const temp = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = temp;
  }
  console.log('shuffled\n');
}

// Pop a card from the deck and push it to the specified hand.
function dealCard(hand) {
  hand.push(deck.pop());
}

// Calculate value of a hand, ace is always 11
// Return INTEGER
function calculateHandValue(hand) {
  let handVal = 0;
  for (let i = 0; i < hand.length; i++) {
    handVal += hand[i].value;
  }
  return handVal;
}

// Reset deck
// Deal initial cards
// Return true if player won
// Return false if dealer won
function startNewGame() {
  deck = [];
  playerHand = [];
  dealerHand = [];
  for (let suit of SUITS) {
    for (let card in CARD_VALUES) {
      deck.push({
        name: card,
        value: CARD_VALUES[card],
        suit: suit,
      });
    }
  }
  shuffleDeck();
  dealCard(playerHand);
  dealCard(dealerHand);
  dealCard(playerHand);
  dealCard(dealerHand);
  console.log(deck.length);

  if (calculateHandValue(playerHand) === 21) {
    return true;
  } else if (calculateHandValue(dealerHand) === 21) {
    return false;
  }
}

//Deal a card to player
//return true if player can hit again
//Return false if not
function playerHit() {
  playerHand.push(deck.pop());
  return calculateHandValue(playerHand) <= THRESHOLD;
}

// dealers turn
function dealerTurn() {
  while (calculateHandValue(dealerHand) <= 16) {
    dealerHand.push(deck.pop());
  }
}

// Return True if dealer won
// Return False otherwise
//Player wins if tie
function determineWinner() {
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  if (playerValue > THRESHOLD) return true; // player busted
  if (dealerValue > THRESHOLD) return false; // dealer busted
  return dealerValue >= playerValue;
}

function getDeck() {
  return deck;
}

function getPlayerHand() {
  return playerHand;
}

function getDealerHand() {
  return dealerHand;
}

function setPlayerHand(newHand) {
  playerHand = newHand;
}

function setDealerHand(newHand) {
  dealerHand = newHand;
}

export {
  shuffleDeck,
  dealCard,
  calculateHandValue,
  startNewGame,
  playerHit,
  dealerTurn,
  determineWinner,
  getDeck,
  getDealerHand,
  getPlayerHand,
  setDealerHand,
  setPlayerHand,
  dealerHand,
  playerHand,
};
