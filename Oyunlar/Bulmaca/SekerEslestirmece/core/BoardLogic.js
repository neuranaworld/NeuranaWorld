/**
 * Tahta Mantığı
 * Oyun tahtasını oluşturma, güncelleme ve şekerleri düşürme mantığı
 */

import { GRID_SIZE } from './LevelConfig';

export const createBoard = (candyTypes) => {
  const newBoard = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const row = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      row.push({
        type: candyTypes[Math.floor(Math.random() * candyTypes.length)],
        special: null,
        id: `${i}-${j}-${Date.now()}-${Math.random()}`
      });
    }
    newBoard.push(row);
  }
  return newBoard;
};

export const removeAndFill = (boardToUpdate, matches, candyTypes, specials = []) => {
  if (matches.length === 0 && specials.length === 0) return boardToUpdate;

  const newBoard = boardToUpdate.map(row => row.map(cell => ({...cell})));

  // Tüm silinecek hücreleri topla
  const allCells = [...matches, ...specials];
  const uniqueCells = [];
  const seen = new Set();

  allCells.forEach(cell => {
    const key = `${cell.row},${cell.col}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueCells.push(cell);
    }
  });

  // Hücreleri sil
  uniqueCells.forEach(cell => {
    newBoard[cell.row][cell.col] = null;
  });

  // Özel şeker oluşturma kontrolü
  const matchGroups = {};
  matches.forEach(match => {
    const key = `${match.row}-${match.col}`;
    if (!matchGroups[key]) {
      matchGroups[key] = [];
    }
    matchGroups[key].push(match);
  });

  // Eğer 4+ eşleşme varsa özel şeker oluştur
  Object.entries(matchGroups).forEach(([key, group]) => {
    if (group.length >= 4) {
      const [row, col] = key.split('-').map(Number);
      const specialType = group.length === 4 ? 'striped' : group.length === 5 ? 'wrapped' : 'rainbow';
      if (newBoard[row][col] === null) {
        const candyType = candyTypes[Math.floor(Math.random() * candyTypes.length)];
        newBoard[row][col] = {
          type: candyType,
          special: specialType,
          id: `special-${Date.now()}-${Math.random()}`
        };
      }
    }
  });

  // Şekerleri düşür
  for (let j = 0; j < GRID_SIZE; j++) {
    const column = [];
    for (let i = GRID_SIZE - 1; i >= 0; i--) {
      if (newBoard[i][j] !== null) {
        column.push(newBoard[i][j]);
      }
    }

    // Yeni şekerler ekle
    while (column.length < GRID_SIZE) {
      column.push({
        type: candyTypes[Math.floor(Math.random() * candyTypes.length)],
        special: null,
        id: `new-${Date.now()}-${Math.random()}`
      });
    }

    // Kolonu doldur
    for (let i = 0; i < GRID_SIZE; i++) {
      newBoard[GRID_SIZE - 1 - i][j] = column[i];
    }
  }

  return newBoard;
};
