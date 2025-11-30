// Puzzle Mantığı
export function createPuzzlePieces(gridSize, imageUrl) {
  const pieces = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      pieces.push({
        id: row * gridSize + col,
        correctRow: row,
        correctCol: col,
        currentRow: row,
        currentCol: col,
        imageUrl: imageUrl,
      });
    }
  }
  return pieces;
}

export function shufflePieces(pieces) {
  const shuffled = [...pieces];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap positions
    const tempRow = shuffled[i].currentRow;
    const tempCol = shuffled[i].currentCol;
    shuffled[i].currentRow = shuffled[j].currentRow;
    shuffled[i].currentCol = shuffled[j].currentCol;
    shuffled[j].currentRow = tempRow;
    shuffled[j].currentCol = tempCol;
  }
  return shuffled;
}

export function swapPieces(pieces, piece1Id, piece2Id) {
  const newPieces = [...pieces];
  const piece1 = newPieces.find(p => p.id === piece1Id);
  const piece2 = newPieces.find(p => p.id === piece2Id);

  if (piece1 && piece2) {
    const tempRow = piece1.currentRow;
    const tempCol = piece1.currentCol;
    piece1.currentRow = piece2.currentRow;
    piece1.currentCol = piece2.currentCol;
    piece2.currentRow = tempRow;
    piece2.currentCol = tempCol;
  }

  return newPieces;
}

export function checkPuzzleComplete(pieces) {
  return pieces.every(piece =>
    piece.currentRow === piece.correctRow &&
    piece.currentCol === piece.correctCol
  );
}

export function calculateScore(moves, time, gridSize) {
  let baseScore = 1000;
  baseScore -= moves * 10;
  baseScore -= time * 2;

  const sizeMultipliers = { 3: 1, 4: 1.5, 5: 2, 6: 2.5 };
  return Math.max(0, Math.floor(baseScore * (sizeMultipliers[gridSize] || 1)));
}
