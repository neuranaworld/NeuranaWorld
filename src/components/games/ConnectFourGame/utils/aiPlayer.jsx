// AI Oyuncu
import { GAME_CONFIG, PLAYERS } from '../constants/gameConfig';
import { checkWinner, dropPiece, canDropPiece } from './gameLogic';

export function makeAIMove(board, difficulty) {
  const validCols = [];
  for (let col = 0; col < GAME_CONFIG.COLS; col++) {
    if (canDropPiece(board, col)) {
      validCols.push(col);
    }
  }

  if (validCols.length === 0) return null;

  if (difficulty === 'easy') {
    return validCols[Math.floor(Math.random() * validCols.length)];
  }

  // Medium/Hard: Check for winning move
  for (const col of validCols) {
    const testBoard = dropPiece(board, col, PLAYERS.YELLOW);
    if (testBoard && checkWinner(testBoard)?.winner === PLAYERS.YELLOW) {
      return col;
    }
  }

  // Block opponent's winning move
  for (const col of validCols) {
    const testBoard = dropPiece(board, col, PLAYERS.RED);
    if (testBoard && checkWinner(testBoard)?.winner === PLAYERS.RED) {
      return col;
    }
  }

  if (difficulty === 'hard') {
    // Prefer center columns
    const centerCol = Math.floor(GAME_CONFIG.COLS / 2);
    if (validCols.includes(centerCol)) {
      return centerCol;
    }

    // Next prefer columns near center
    const sortedCols = validCols.sort((a, b) =>
      Math.abs(a - centerCol) - Math.abs(b - centerCol)
    );
    return sortedCols[0];
  }

  // Medium: random from valid columns
  return validCols[Math.floor(Math.random() * validCols.length)];
}
