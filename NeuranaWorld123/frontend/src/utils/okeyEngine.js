/**
 * 101 Okey - Temel Oyun Motoru
 * Modüler yapı, ES6+ standartları
 */

// Taş Sınıfı
export class Tile {
  constructor(color, number, isJoker = false) {
    this.color = color; // 'red', 'yellow', 'blue', 'black'
    this.number = number; // 1-13
    this.isJoker = isJoker;
    this.id = `${color}-${number}-${Date.now()}-${Math.random()}`;
  }

  equals(other) {
    return this.color === other.color && this.number === other.number;
  }

  canBeUsedAsOkey(okeyTile) {
    return this.isJoker || (this.color === okeyTile.color && this.number === okeyTile.number);
  }

  clone() {
    return new Tile(this.color, this.number, this.isJoker);
  }
}

// Taş Destesi
export class Deck {
  constructor() {
    this.tiles = [];
    this.initialize();
  }

  initialize() {
    const colors = ['red', 'yellow', 'blue', 'black'];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    // Her renk ve sayıdan 2'şer taş
    colors.forEach(color => {
      numbers.forEach(number => {
        this.tiles.push(new Tile(color, number));
        this.tiles.push(new Tile(color, number));
      });
    });

    // 2 sahte okey (joker)
    this.tiles.push(new Tile('joker', 0, true));
    this.tiles.push(new Tile('joker', 0, true));

    this.shuffle();
  }

  shuffle() {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
  }

  draw(count = 1) {
    return this.tiles.splice(0, count);
  }

  remaining() {
    return this.tiles.length;
  }
}

// Oyuncu Sınıfı
export class Player {
  constructor(id, name, isAI = false, aiLevel = 'medium') {
    this.id = id;
    this.name = name;
    this.isAI = isAI;
    this.aiLevel = aiLevel; // 'easy', 'medium', 'hard'
    this.hand = [];
    this.score = 0;
    this.hasDrawn = false;
  }

  addTile(tile) {
    this.hand.push(tile);
    this.sortHand();
  }

  removeTile(tileId) {
    const index = this.hand.findIndex(t => t.id === tileId);
    if (index !== -1) {
      return this.hand.splice(index, 1)[0];
    }
    return null;
  }

  sortHand() {
    this.hand.sort((a, b) => {
      if (a.color === b.color) {
        return a.number - b.number;
      }
      const colorOrder = { 'red': 0, 'yellow': 1, 'blue': 2, 'black': 3, 'joker': 4 };
      return colorOrder[a.color] - colorOrder[b.color];
    });
  }

  getHandSize() {
    return this.hand.length;
  }
}

// Grup Validator
export class GroupValidator {
  static isValidRun(tiles, okeyTile) {
    if (tiles.length < 3) return false;

    // Aynı renk kontrolü
    const color = tiles.find(t => !t.canBeUsedAsOkey(okeyTile))?.color;
    if (!color) return true; // Sadece okey'lerden oluşuyor

    // Sıralı mı kontrol et
    let numbers = tiles.map(t => t.canBeUsedAsOkey(okeyTile) ? null : t.number);
    numbers.sort((a, b) => (a || 0) - (b || 0));

    // Okey'leri boşluklara yerleştir
    let okeyCount = numbers.filter(n => n === null).length;
    let sequence = [];
    
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] !== null) {
        sequence.push(numbers[i]);
      }
    }

    // Ardışık kontrol
    for (let i = 1; i < sequence.length; i++) {
      const gap = sequence[i] - sequence[i - 1] - 1;
      if (gap > okeyCount) return false;
      okeyCount -= gap;
    }

    return okeyCount >= 0;
  }

  static isValidSet(tiles, okeyTile) {
    if (tiles.length < 3) return false;

    // Aynı sayı kontrolü
    const number = tiles.find(t => !t.canBeUsedAsOkey(okeyTile))?.number;
    if (!number) return true;

    // Farklı renkler kontrolü
    const colors = new Set();
    tiles.forEach(t => {
      if (!t.canBeUsedAsOkey(okeyTile)) {
        if (t.number !== number) return false;
        colors.add(t.color);
      }
    });

    return colors.size + tiles.filter(t => t.canBeUsedAsOkey(okeyTile)).length === tiles.length;
  }

  static validateHand(hand, okeyTile) {
    // El bitirme kontrolü: Tüm taşlar grup oluşturmalı + 1 atılan
    const groups = this.findAllGroups(hand, okeyTile);
    return groups !== null && groups.unusedTiles.length <= 1;
  }

  static findAllGroups(hand, okeyTile) {
    // Greedy algoritma: Tüm geçerli grupları bul
    // Basitleştirilmiş versiyon
    return { groups: [], unusedTiles: hand };
  }
}

// Oyun Motoru
export class OkeyGameEngine {
  constructor() {
    this.deck = null;
    this.players = [];
    this.discardPile = [];
    this.okeyIndicator = null;
    this.okeyTile = null;
    this.currentPlayerIndex = 0;
    this.gamePhase = 'waiting'; // 'waiting', 'playing', 'finished'
    this.winner = null;
  }

  initGame(playerNames = ['Siz', 'Bot 1', 'Bot 2', 'Bot 3']) {
    this.deck = new Deck();
    this.players = [
      new Player(0, playerNames[0], false),
      new Player(1, playerNames[1], true, 'medium'),
      new Player(2, playerNames[2], true, 'medium'),
      new Player(3, playerNames[3], true, 'medium')
    ];

    // Okey gösterge taşını belirle
    this.okeyIndicator = this.deck.draw(1)[0];
    this.okeyTile = this.calculateOkeyTile(this.okeyIndicator);

    // 14'er taş dağıt
    this.players.forEach(player => {
      const tiles = this.deck.draw(14);
      tiles.forEach(tile => player.addTile(tile));
    });

    // İlk oyuncuya 1 taş daha
    this.players[0].addTile(this.deck.draw(1)[0]);

    this.currentPlayerIndex = 0;
    this.gamePhase = 'playing';
  }

  calculateOkeyTile(indicator) {
    const nextNumber = indicator.number === 13 ? 1 : indicator.number + 1;
    return new Tile(indicator.color, nextNumber);
  }

  drawTile(playerId) {
    const player = this.players[playerId];
    if (player.hasDrawn) return null;

    if (this.deck.remaining() === 0) return null;

    const tile = this.deck.draw(1)[0];
    player.addTile(tile);
    player.hasDrawn = true;
    return tile;
  }

  drawFromDiscard(playerId) {
    const player = this.players[playerId];
    if (player.hasDrawn || this.discardPile.length === 0) return null;

    const tile = this.discardPile.pop();
    player.addTile(tile);
    player.hasDrawn = true;
    return tile;
  }

  discardTile(playerId, tileId) {
    const player = this.players[playerId];
    if (!player.hasDrawn) return false;

    const tile = player.removeTile(tileId);
    if (!tile) return false;

    this.discardPile.push(tile);
    player.hasDrawn = false;

    // Kazanma kontrolü
    if (this.checkWin(player)) {
      this.gamePhase = 'finished';
      this.winner = player;
      this.calculateScore(player);
      return { success: true, gameOver: true, winner: player };
    }

    // Sırayı geç
    this.nextPlayer();
    return { success: true, gameOver: false };
  }

  checkWin(player) {
    return GroupValidator.validateHand(player.hand, this.okeyTile);
  }

  calculateScore(winner) {
    // Basit puanlama
    winner.score += 100;
    return winner.score;
  }

  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getGameState() {
    return {
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        handSize: p.getHandSize(),
        score: p.score,
        isAI: p.isAI
      })),
      currentPlayer: this.currentPlayerIndex,
      okeyTile: this.okeyTile,
      discardPileSize: this.discardPile.length,
      deckSize: this.deck.remaining(),
      gamePhase: this.gamePhase,
      winner: this.winner
    };
  }
}
