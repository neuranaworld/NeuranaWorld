/**
 * Özel Şeker Sistemi
 * Özel şeker aktivasyonu ve etkileri
 */

import { GRID_SIZE } from './LevelConfig';

export const createSpecialCandy = (matchLength, row, col) => {
  if (matchLength === 4) return 'striped';
  if (matchLength === 5) return 'wrapped';
  if (matchLength >= 6) return 'rainbow';
  return null;
};

export const activateSpecial = (special, row, col, board) => {
  const cellsToDestroy = [];

  if (special === 'striped') {
    // Tüm satır ve sütunu yok et
    for (let i = 0; i < GRID_SIZE; i++) {
      cellsToDestroy.push({ row, col: i });
      cellsToDestroy.push({ row: i, col });
    }
  } else if (special === 'wrapped') {
    // 3x3 alan yok et
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (row + i >= 0 && row + i < GRID_SIZE && col + j >= 0 && col + j < GRID_SIZE) {
          cellsToDestroy.push({ row: row + i, col: col + j });
        }
      }
    }
  } else if (special === 'rainbow') {
    // Aynı tipteki tüm şekerleri yok et
    const targetType = board[row][col]?.type;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j]?.type === targetType) {
          cellsToDestroy.push({ row: i, col: j });
        }
      }
    }
  }

  return cellsToDestroy;
};
