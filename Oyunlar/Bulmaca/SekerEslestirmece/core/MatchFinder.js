/**
 * Eşleşme Bulucu
 * Tahtada 3 veya daha fazla aynı şekerin eşleşmesini bulan algoritma
 */

import { GRID_SIZE } from './LevelConfig';

export const findAllMatches = (boardToCheck) => {
  const matches = [];

  // Yatay eşleşmeleri bul
  for (let i = 0; i < GRID_SIZE; i++) {
    let j = 0;
    while (j < GRID_SIZE) {
      let matchLength = 1;
      const currentType = boardToCheck[i][j].type;
      while (j + matchLength < GRID_SIZE && boardToCheck[i][j + matchLength].type === currentType) {
        matchLength++;
      }
      if (matchLength >= 3) {
        for (let k = 0; k < matchLength; k++) {
          matches.push({ row: i, col: j + k, length: matchLength });
        }
      }
      j += matchLength;
    }
  }

  // Dikey eşleşmeleri bul
  for (let j = 0; j < GRID_SIZE; j++) {
    let i = 0;
    while (i < GRID_SIZE) {
      let matchLength = 1;
      const currentType = boardToCheck[i][j].type;
      while (i + matchLength < GRID_SIZE && boardToCheck[i + matchLength][j].type === currentType) {
        matchLength++;
      }
      if (matchLength >= 3) {
        for (let k = 0; k < matchLength; k++) {
          matches.push({ row: i + k, col: j, length: matchLength });
        }
      }
      i += matchLength;
    }
  }

  // Tekrarlananları temizle
  const uniqueMatches = [];
  const seen = new Set();
  matches.forEach(match => {
    const key = `${match.row},${match.col}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueMatches.push(match);
    }
  });

  return uniqueMatches;
};
