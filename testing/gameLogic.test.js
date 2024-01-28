const gameLogic = require('../docs/scripts/gameLogic'); // Replace with your actual file name

describe('Blackjack Game Tests', () => {
  beforeEach(() => {
    gameLogic.startNewGame();
  });

  test('Deck should be initialized correctly', () => {
    expect(gameLogic.getDeck().length).toBe(48); // 52 cards - 4 dealt cards (2 to player, 2 to dealer)
  });

  test('Dealing a card removes it from the deck', () => {
    const initialDeckLength = gameLogic.getDeck().length;
    gameLogic.playerHit();
    expect(gameLogic.getDeck().length).toBe(initialDeckLength - 1);
  });

  test('Calculate hand value correctly', () => {
    gameLogic.setPlayerHand([{ value: 10 }, { value: 7 }]); // Example hand
    expect(gameLogic.calculateHandValue(gameLogic.getPlayerHand())).toBe(17);
  });

  test('Player hit adds a card to player hand', () => {
    const initialHandLength = gameLogic.getPlayerHand().length;
    gameLogic.playerHit();
    expect(gameLogic.getPlayerHand().length).toBe(initialHandLength + 1);
  });

  test('Dealer hits until hand value is over 16', () => {
    gameLogic.dealerTurn();
    expect(
      gameLogic.calculateHandValue(gameLogic.getDealerHand())
    ).toBeGreaterThan(16);
  });

  test('Determining the winner works correctly', () => {
    gameLogic.setPlayerHand([{ value: 10 }, { value: 9 }]); // Example player hand totaling 19
    gameLogic.setDealerHand([{ value: 10 }, { value: 6 }]); // Example dealer hand totaling 16
    gameLogic.dealerTurn(); // Dealer should take at least one more card
    const isDealerWinner = gameLogic.determineWinner();
    expect(isDealerWinner).not.toBeNull();
  });
});
