// Oyun Mantığı
import { GAME_CONFIG } from '../constants/gameConfig';

export function createEmptyBoard() {
  return Array(GAME_CONFIG.ROWS).fill(null).map(() => Array(GAME_CONFIG.COLS).fill(null));
}

export function checkWinner(grid) {
  const { ROWS, COLS, WIN_LENGTH } = GAME_CONFIG;

  // Check horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - WIN_LENGTH + 1; col++) {
      if (grid[row][col] &&
          grid[row][col] === grid[row][col + 1] &&
          grid[row][col] === grid[row][col + 2] &&
          grid[row][col] === grid[row][col + 3]) {
        return {
          winner: grid[row][col],
          cells: [[row, col], [row, col + 1], [row, col + 2], [row, col + 3]]
        };
      }
    }
  }

  // Check vertical
  for (let row = 0; row < ROWS - WIN_LENGTH + 1; row++) {
    for (let col = 0; col < COLS; col++) {
      if (grid[row][col] &&
          grid[row][col] === grid[row + 1][col] &&
          grid[row][col] === grid[row + 2][col] &&
          grid[row][col] === grid[row + 3][col]) {
        return {
          winner: grid[row][col],
          cells: [[row, col], [row + 1, col], [row + 2, col], [row + 3, col]]
        };
      }
    }
  }

  // Check diagonal (/)
  for (let row = WIN_LENGTH - 1; row < ROWS; row++) {
    for (let col = 0; col < COLS - WIN_LENGTH + 1; col++) {
      if (grid[row][col] &&
          grid[row][col] === grid[row - 1][col + 1] &&
          grid[row][col] === grid[row - 2][col + 2] &&
          grid[row][col] === grid[row - 3][col + 3]) {
        return {
          winner: grid[row][col],
          cells: [[row, col], [row - 1, col + 1], [row - 2, col + 2], [row - 3, col + 3]]
        };
      }
    }
  }

  // Check diagonal (\)
  for (let row = 0; row < ROWS - WIN_LENGTH + 1; row++) {
    for (let col = 0; col < COLS - WIN_LENGTH + 1; col++) {
      if (grid[row][col] &&
          grid[row][col] === grid[row + 1][col + 1] &&
          grid[row][col] === grid[row + 2][col + 2] &&
          grid[row][col] === grid[row + 3][col + 3]) {
        return {
          winner: grid[row][col],
          cells: [[row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]]
        };
      }
    }
  }

  // Check for draw
  if (grid.every(row => row.every(cell => cell !== null))) {
    return { winner: 'draw', cells: [] };
  }

  return null;
}

export function dropPiece(board, col, player) {
  const newBoard = board.map(row => [...row]);
  for (let row = GAME_CONFIG.ROWS - 1; row >= 0; row--) {
    if (!newBoard[row][col]) {
      newBoard[row][col] = player;
      return newBoard;
    }
  }
  return null; // Column is full
}

export function canDropPiece(board, col) {
  return board[0][col] === null;
}
