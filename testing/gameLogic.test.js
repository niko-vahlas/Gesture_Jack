import {
  startNewGame,
  playerHit,
  dealerTurn,
  determineWinner,
  playerHand,
  dealerHand,
  calculateHandValue,
} from '../frontend/scripts/gameLogic';

describe('Game Logic Tests', () => {
  beforeEach(() => {
    startNewGame();
  });

  //Check correct
  test('startNewGame initializes deck and hands correctly', () => {
    expect(playerHand.length + dealerHand.length).toBe(4);
  });

  test('playerHit adds a card to player hand', () => {
    const initialHandSize = playerHand.length;
    playerHit();
    expect(playerHand.length).toBe(initialHandSize + 1);
  });

  test('dealerTurn should deal cards to dealer until its hand value is > 16', () => {
    dealerTurn();
    // Assuming calculateHandValue is working correctly, this test should suffice
    expect(calculateHandValue(dealerHand)).toBeGreaterThan(16);
  });

  // You can add more tests for determineWinner, especially edge cases.
  // For instance, when both dealer and player bust, player should win.

  test('determineWinner returns false when both player and dealer bust', () => {
    while (calculateHandValue(playerHand) <= 21) {
      playerHit();
    }
    dealerTurn();
    expect(determineWinner()).toBe(false);
  });
});

// This is a simple example. Real tests should also include various edge cases.
