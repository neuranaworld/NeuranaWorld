/**
 * Tahta Mantığı
 * Oyun tahtasını oluşturma, güncelleme ve şekerleri düşürme mantığı
 */

import { GRID_SIZE } from './LevelConfig';
import { findAllMatches } from './MatchFinder';

// Başlangıçta eşleşme OLMAYAN tahta oluştur
export const createBoard = (candyTypes) => {
  let newBoard;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    newBoard = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        // Üstteki ve soldaki şekerlere bakarak eşleşme olmamasını sağla
        let candyType;
        let validTypes = [...candyTypes];

        // Soldaki 2 şeker aynı mı kontrol et
        if (j >= 2 && row[j-1].type === row[j-2].type) {
          validTypes = validTypes.filter(t => t !== row[j-1].type);
        }

        // Üstteki 2 şeker aynı mı kontrol et
        if (i >= 2 && newBoard[i-1][j].type === newBoard[i-2][j].type) {
          validTypes = validTypes.filter(t => t !== newBoard[i-1][j].type);
        }

        // Eğer geçerli tip kalmadıysa, rastgele seç
        if (validTypes.length === 0) {
          validTypes = [...candyTypes];
        }

        candyType = validTypes[Math.floor(Math.random() * validTypes.length)];

        row.push({
          type: candyType,
          special: null,
          id: `${i}-${j}-${Date.now()}-${Math.random()}`
        });
      }
      newBoard.push(row);
    }
    attempts++;
  } while (findAllMatches(newBoard).length > 0 && attempts < maxAttempts);

  // Eğer hala eşleşme varsa, zorla temizle
  if (findAllMatches(newBoard).length > 0) {
    newBoard = fixInitialMatches(newBoard, candyTypes);
  }

  return newBoard;
};

// Başlangıçtaki eşleşmeleri zorla temizle
const fixInitialMatches = (board, candyTypes) => {
  const matches = findAllMatches(board);
  if (matches.length === 0) return board;

  const newBoard = board.map(row => row.map(cell => ({...cell})));

  matches.forEach(match => {
    const { row, col } = match;
    const currentType = newBoard[row][col].type;
    const validTypes = candyTypes.filter(t => {
      // Bu tipi koyduğumuzda eşleşme olur mu?
      newBoard[row][col].type = t;
      const hasMatch = findAllMatches(newBoard).some(m => m.row === row && m.col === col);
      newBoard[row][col].type = currentType;
      return !hasMatch;
    });

    if (validTypes.length > 0) {
      newBoard[row][col].type = validTypes[Math.floor(Math.random() * validTypes.length)];
    }
  });

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

// Olası hamleleri bul
export const findPossibleMoves = (board) => {
  const possibleMoves = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      // Sağa swap dene
      if (j < GRID_SIZE - 1) {
        const testBoard = board.map(row => row.map(cell => ({...cell})));
        [testBoard[i][j], testBoard[i][j+1]] = [testBoard[i][j+1], testBoard[i][j]];
        if (findAllMatches(testBoard).length > 0) {
          possibleMoves.push({ from: {row: i, col: j}, to: {row: i, col: j+1} });
        }
      }

      // Aşağı swap dene
      if (i < GRID_SIZE - 1) {
        const testBoard = board.map(row => row.map(cell => ({...cell})));
        [testBoard[i][j], testBoard[i+1][j]] = [testBoard[i+1][j], testBoard[i][j]];
        if (findAllMatches(testBoard).length > 0) {
          possibleMoves.push({ from: {row: i, col: j}, to: {row: i+1, col: j} });
        }
      }
    }
  }

  return possibleMoves;
};

// Tahtayı karıştır (hamle kalmadığında)
export const shuffleBoard = (board, candyTypes) => {
  let shuffledBoard;
  let attempts = 0;
  const maxAttempts = 50;

  do {
    // Mevcut şekerleri al
    const allCandies = [];
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.special === null) {
          allCandies.push(cell.type);
        }
      });
    });

    // Karıştır
    for (let i = allCandies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCandies[i], allCandies[j]] = [allCandies[j], allCandies[i]];
    }

    // Yeni tahta oluştur
    shuffledBoard = [];
    let candyIndex = 0;

    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j].special !== null) {
          // Özel şekerleri koru
          row.push({...board[i][j]});
        } else {
          row.push({
            type: allCandies[candyIndex++],
            special: null,
            id: `shuffled-${Date.now()}-${Math.random()}`
          });
        }
      }
      shuffledBoard.push(row);
    }

    attempts++;
  } while (
    (findAllMatches(shuffledBoard).length > 0 || findPossibleMoves(shuffledBoard).length === 0) &&
    attempts < maxAttempts
  );

  // Eğer hala uygun değilse, yeni tahta oluştur
  if (findPossibleMoves(shuffledBoard).length === 0) {
    return createBoard(candyTypes);
  }

  return shuffledBoard;
};
