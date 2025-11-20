/**
 * 101 Okey - AI Strategy Engine
 * 3 zorluk seviyesi: easy, medium, hard
 */

import { GroupValidator } from './okeyEngine';

export class OkeyAI {
  constructor(player, gameEngine) {
    this.player = player;
    this.gameEngine = gameEngine;
    this.level = player.aiLevel;
  }

  makeMove() {
    // 1. Taş çek
    const drawnTile = this.decideDraw();
    
    // 2. Taş at
    setTimeout(() => {
      const tileToDiscard = this.decideDiscard();
      if (tileToDiscard) {
        this.gameEngine.discardTile(this.player.id, tileToDiscard.id);
      }
    }, 800);
  }

  decideDraw() {
    const { discardPile } = this.gameEngine;
    
    switch (this.level) {
      case 'easy':
        // Rastgele seç
        return Math.random() > 0.5 && discardPile.length > 0
          ? this.gameEngine.drawFromDiscard(this.player.id)
          : this.gameEngine.drawTile(this.player.id);

      case 'medium':
        // Atılan taş yararlı mı kontrol et
        if (discardPile.length > 0) {
          const topDiscard = discardPile[discardPile.length - 1];
          if (this.isTileUseful(topDiscard)) {
            return this.gameEngine.drawFromDiscard(this.player.id);
          }
        }
        return this.gameEngine.drawTile(this.player.id);

      case 'hard':
        // Gelişmiş strateji
        if (discardPile.length > 0) {
          const topDiscard = discardPile[discardPile.length - 1];
          const score = this.evaluateTile(topDiscard);
          if (score > 7) {
            return this.gameEngine.drawFromDiscard(this.player.id);
          }
        }
        return this.gameEngine.drawTile(this.player.id);

      default:
        return this.gameEngine.drawTile(this.player.id);
    }
  }

  decideDiscard() {
    const hand = this.player.hand;
    if (hand.length === 0) return null;

    switch (this.level) {
      case 'easy':
        // Rastgele at
        return hand[Math.floor(Math.random() * hand.length)];

      case 'medium':
        // En az yararlı taşı at
        return this.findLeastUsefulTile();

      case 'hard':
        // Stratejik atış
        return this.strategicDiscard();

      default:
        return hand[0];
    }
  }

  isTileUseful(tile) {
    const hand = this.player.hand;
    const okeyTile = this.gameEngine.okeyTile;

    // Okey ise kesinlikle al
    if (tile.canBeUsedAsOkey(okeyTile)) return true;

    // Aynı renk yakın sayılar var mı?
    const sameColorTiles = hand.filter(t => t.color === tile.color);
    for (let t of sameColorTiles) {
      if (Math.abs(t.number - tile.number) <= 2) return true;
    }

    // Aynı sayı farklı renkler var mı?
    const sameNumberTiles = hand.filter(t => t.number === tile.number);
    if (sameNumberTiles.length >= 2) return true;

    return false;
  }

  evaluateTile(tile) {
    const hand = this.player.hand;
    const okeyTile = this.gameEngine.okeyTile;
    let score = 0;

    if (tile.canBeUsedAsOkey(okeyTile)) return 10;

    // Seri oluşturma potansiyeli
    const sameColorTiles = hand.filter(t => t.color === tile.color);
    sameColorTiles.forEach(t => {
      const diff = Math.abs(t.number - tile.number);
      if (diff === 1) score += 5;
      else if (diff === 2) score += 3;
    });

    // Grup oluşturma potansiyeli
    const sameNumberTiles = hand.filter(t => t.number === tile.number);
    score += sameNumberTiles.length * 3;

    return score;
  }

  findLeastUsefulTile() {
    const hand = this.player.hand;
    let minScore = Infinity;
    let worstTile = hand[0];

    hand.forEach(tile => {
      const score = this.evaluateTile(tile);
      if (score < minScore) {
        minScore = score;
        worstTile = tile;
      }
    });

    return worstTile;
  }

  strategicDiscard() {
    // İleri seviye: Rakipleri gözlemle, stratejik at
    const hand = this.player.hand;
    const leastUseful = this.findLeastUsefulTile();

    // Rakiplerin almayacağı taşları tercih et
    // Basitleştirilmiş: En düşük skorlu taşı at
    return leastUseful;
  }

  canFinishHand() {
    return GroupValidator.validateHand(this.player.hand, this.gameEngine.okeyTile);
  }
}
